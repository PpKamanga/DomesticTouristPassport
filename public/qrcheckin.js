const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goHome() {
  window.location.href = "home.html";
}

function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
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

document.getElementById("confirmQR").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destinationId: 1, // temporary for now
        rating: 0,
        comment: "",
        username: currentUser.username
      })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("qrMessage").textContent =
        "QR Check-In successful!";
    } else {
      document.getElementById("qrMessage").textContent =
        data.message || "Error checking in.";
    }
  } catch (error) {
    console.error(error);
  }
});