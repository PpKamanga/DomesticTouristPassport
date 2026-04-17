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

const params = new URLSearchParams(window.location.search);
const destinationId = Number(params.get("id"));

document.getElementById("confirmQR").addEventListener("click", () => {
  if (!destinationId) {
    document.getElementById("qrMessage").textContent =
      "Invalid destination. Please try again.";
    return;
  }

  window.location.href = `destination-details.html?id=${destinationId}`;
});