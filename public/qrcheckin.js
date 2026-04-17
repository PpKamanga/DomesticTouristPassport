const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "tourist.html";
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