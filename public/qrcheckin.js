console.log("qrcheckin.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
}

function goHome() {
  window.location.href = "home.html";
}

  function goToVisitPage() {
    window.location.href = "visit.html";
  }
function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}

function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

window.goBack = goBack;
window.goHome = goHome;
window.goToVisitPage = goToVisitPage;
window.logout = logout;

const qrRegionId = "reader";
const qrMessage = document.getElementById("qrMessage");
const startBtn = document.getElementById("startScannerBtn");
const stopBtn = document.getElementById("stopScannerBtn");

console.log("Start button:", startBtn);
console.log("Stop button:", stopBtn);

startBtn.addEventListener("click", () => {
  console.log("Start Camera clicked");
  startScanner();
});

stopBtn.addEventListener("click", () => {
  console.log("Stop Camera clicked");
  stopScanner();
});

const html5QrCode = new Html5Qrcode(qrRegionId);
let scannerRunning = false;
let lastScannedText = "";

function showMessage(message, isError = false) {
  qrMessage.textContent = message;
  qrMessage.style.color = isError ? "#c62828" : "#1b5e20";
}

async function startScanner() {
  console.log("startScanner running");
  try {
    if (scannerRunning) {
      showMessage("Camera is already running.");
      return;
    }

    showMessage("Requesting camera access...");

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
    console.error("Error starting scanner:", error);
    showMessage(
      "Unable to open camera. Use HTTPS or localhost and allow camera permission.",
      true
    );
  }
}

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
    console.error("Error stopping scanner:", error);
    showMessage("Could not stop camera cleanly.", true);
  }
}

async function onScanSuccess(decodedText) {
  if (decodedText === lastScannedText) return;
  lastScannedText = decodedText;

  console.log("Scanned QR:", decodedText);

  let parsed;
  try {
    parsed = JSON.parse(decodedText);
  } catch {
    showMessage("Invalid QR code format.", true);
    return;
  }

  const destinationId = Number(parsed.destinationId);

  if (!destinationId) {
    showMessage("QR code does not contain a valid destination.", true);
    return;
  }

  try {
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

function onScanFailure(errorMessage) {
  console.log("QR scan attempt:", errorMessage);
}

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