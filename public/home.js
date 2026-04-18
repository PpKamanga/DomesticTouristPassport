const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function generateMembershipId(username) {
  const cleanName = (username || "tourist").replace(/\s+/g, "").toUpperCase();
  const shortName = cleanName.slice(0, 3).padEnd(3, "X");

  return `DTP-${shortName}-2026`;
}

function getBadgeTitle(totalFootprints) {
  if (totalFootprints >= 500) return "Elite Explorer";
  if (totalFootprints >= 200) return "Explorer";
  if (totalFootprints >= 50) return "Rising Traveler";
  return "Beginner";
}

async function loadDashboard() {
  document.getElementById("memberName").textContent =
    currentUser.fullName || currentUser.username || "Tourist User";

  document.getElementById("memberId").textContent =
    currentUser.membershipId || generateMembershipId(currentUser.username);

  try {
    const response = await fetch("/api/visits");
    const data = await response.json();

    let allVisits = data.visits || [];

    const userVisits = allVisits.filter(
      (visit) => visit.username === currentUser.username
    );

    const totalFootprints = userVisits.reduce(
      (sum, visit) => sum + (visit.footprints || 0),
      0
    );

    document.getElementById("memberFootprints").textContent = totalFootprints;
    document.getElementById("badgeTitle").textContent = getBadgeTitle(totalFootprints);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    document.getElementById("memberFootprints").textContent = "0";
    document.getElementById("badgeTitle").textContent = "Beginner";
  }
}

loadDashboard();