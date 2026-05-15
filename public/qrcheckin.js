// Confirms that the QR Check-In JavaScript file has loaded successfully
console.log("qrcheckin.js loaded");

// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Prevents users who are not logged in as tourists from accessing this page
if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

// Sends the user back to the previous page or to the home page if no previous page exists
function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
}

// Redirects the user to the home page
function goHome() {
  window.location.href = "home.html";
}

 // Redirects the user to the visit recording page 
function goToVisitPage() {
    window.location.href = "visit.html";
  }

 // Redirects the user to the My Visits page 
function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}

// Redirects the user to the QR Check-In page
function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Makes navigation functions available to inline HTML onclick events
window.goBack = goBack;
window.goHome = goHome;
window.goToVisitPage = goToVisitPage;
window.logout = logout;

// Stores QR scanner element IDs and button references
const qrRegionId = "reader";
const qrMessage = document.getElementById("qrMessage");
const startBtn = document.getElementById("startScannerBtn");
const stopBtn = document.getElementById("stopScannerBtn");

console.log("Start button:", startBtn);
console.log("Stop button:", stopBtn);

// Starts the QR scanner when the user clicks the Open Camera button
startBtn.addEventListener("click", () => {
  console.log("Start Camera clicked");
  startScanner();
});

// Stops the QR scanner when the user clicks the Stop Camera button
stopBtn.addEventListener("click", () => {
  console.log("Stop Camera clicked");
  stopScanner();
});

// Creates a QR scanner instance using the html5-qrcode library
const html5QrCode = new Html5Qrcode(qrRegionId);

// Tracks whether the scanner is currently running
let scannerRunning = false;

// Stores the last scanned QR text to prevent duplicate submissions
let lastScannedText = "";

// Displays status or error messages to the user
function showMessage(message, isError = false) {
  qrMessage.textContent = message;
  qrMessage.style.color = isError ? "#c62828" : "#1b5e20";
}

// Starts the camera and begins scanning QR codes
async function startScanner() {
  console.log("startScanner running");

  try {
   // Prevents the scanner from starting more than once 
    if (scannerRunning) {
      showMessage("Camera is already running.");
      return;
    }

    showMessage("Requesting camera access...");

    // Opens the device camera and begins scanning for QR codes
    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 }
      },
      onScanSuccess,
      onScanFailure
    );

    scannerRunning = true;
    showMessage("Camera opened. Point it at a destination QR code.");
  } catch (error) {
    // Handles camera permission or browser access errors
    console.error("Error starting scanner:", error);
    showMessage(
      "Unable to open camera. Use HTTPS or localhost and allow camera permission.",
      true
    );
  }
}

// Stops the camera and clears the QR scanner
async function stopScanner() {
  try {
    if (!scannerRunning) {
      showMessage("Camera is not running.");
      return;
    }

    await html5QrCode.stop();
    await html5QrCode.clear();

    scannerRunning = false;
    showMessage("Camera stopped.");
  } catch (error) {
     // Handles errors that occur while stopping the camera
    console.error("Error stopping scanner:", error);
    showMessage("Could not stop camera cleanly.", true);
  }
}

// Handles a successful QR code scan
async function onScanSuccess(decodedText) {

  // Prevents the same QR code from being submitted repeatedly
  if (decodedText === lastScannedText) return;
  lastScannedText = decodedText;

  console.log("Scanned QR:", decodedText);

  let parsed;

    // Parses the scanned QR code text as JSON and extracts the destination ID
  try {
    parsed = JSON.parse(decodedText);
  } catch {
    showMessage("Invalid QR code format.", true);
    return;
  }

  // Extracts the destination ID from the scanned QR code
  const destinationId = Number(parsed.destinationId);

   // Validates that the QR code contains a destination ID
  if (!destinationId) {
    showMessage("QR code does not contain a valid destination.", true);
    return;
  }

  try {
      // Sends the check-in information to the backend API to record the visit
    const response = await fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destinationId,
        rating: 0,
        comment: "",
        username: currentUser.username
      })
    });

    const data = await response.json();

    // Shows success message and stops the camera after successful check-in
    if (response.ok) {
      showMessage("QR Check-In successful!");
      await stopScanner();
    } else {
      showMessage(data.message || "Check-in failed.", true);
    }
  } catch (error) {
    console.error("Error submitting QR check-in:", error);
    showMessage("Error submitting QR check-in.", true);
  }
}

// Handles scan attempts that do not successfully detect a QR code
function onScanFailure(errorMessage) {
  console.log("QR scan attempt:", errorMessage);
}

// Stops and clears the scanner if the user leaves or refreshes the page
window.addEventListener("beforeunload", async () => {
  if (scannerRunning) {
    try {
      await html5QrCode.stop();
      await html5QrCode.clear();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }
});