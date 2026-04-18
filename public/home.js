const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

const badgeDistribution = [
  { visits: 1, name: "Waypoint", image: "images/waypoint.png" },
  { visits: 2, name: "Dockside", image: "images/dockside.png" },
  { visits: 3, name: "Charm City", image: "images/charm-city.png" },
  { visits: 4, name: "Harborline", image: "images/harborline.png" },
  { visits: 5, name: "Blue Crab", image: "images/blue-crab.png" },
  { visits: 6, name: "Old Bay", image: "images/old-bay.png" },
  { visits: 7, name: "Bayfront", image: "images/bayfront.png" },
  { visits: 8, name: "Anchor", image: "images/anchor.png" },
  { visits: 9, name: "Harbor East", image: "images/harbor-east.png" },
  { visits: 10, name: "Fells Point", image: "images/fells-point.png" },
  { visits: 11, name: "Crab Shack", image: "images/crab-shack.png" },
  { visits: 12, name: "City Pass", image: "images/city-pass.png" }
];

function getCurrentBadge(totalVisits) {
  let currentBadge = null;

  for (const badge of badgeDistribution) {
    if (totalVisits >= badge.visits) {
      currentBadge = badge;
    }
  }

  return currentBadge;
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

    const totalVisits = userVisits.length;
    const currentBadge = getCurrentBadge(totalVisits);

console.log("Current user:", currentUser);
console.log("All visits:", allVisits);
console.log("User visits:", userVisits);
console.log("Total visits:", totalVisits);
console.log("Total footprints:", totalFootprints);
console.log("Current badge:", currentBadge);

if (currentBadge) {
  document.getElementById("badgeTitle").textContent = currentBadge.name;
  document.getElementById("badgeImage").src = currentBadge.image;
}

    document.getElementById("memberFootprints").textContent = totalFootprints;
    document.getElementById("badgeTitle").textContent = getBadgeTitle(totalFootprints);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    document.getElementById("memberFootprints").textContent = "0";
    document.getElementById("badgeTitle").textContent = "Beginner";
  }
}

loadDashboard();