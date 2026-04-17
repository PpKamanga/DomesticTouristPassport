// Import Express Framework
import bcrypt from "bcrypt";
import "dotenv/config";
import { pool } from "./db";
import express from "express";
import * as path from "path";

// Create Express Application
const app = express();

const PORT = process.env.PORT || 3000;

const publicPath = path.join(process.cwd(), "public");

//Enable JSON parsing for incoming requests
app.use(express.json()); // allows POST requests with JSON
app.use(express.static(publicPath));

if (pool) {
  pool.query("SELECT NOW()")
    .then((res: any) => console.log("Database connected:", res.rows[0]))
    .catch((err: Error) => console.error("Database connection error:", err));
} else {
  console.warn("DATABASE_URL is not set; skipping database connection test.");
}

function dbUnavailable(res: express.Response) {
  return res.status(500).json({
    message: "Database is not configured"
  });
}

// Root Route - Serve the login page
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});

// List of tourist destinations
let destinations = [
  {
    id: 1,
    name: "Miss Shirley's Cafe",
    city: "Baltimore",
    image: "images/miss shirleys cafe.jpg",
    description: "A cozy local café in Baltimore offering a welcoming atmosphere and a memorable neighborhood experience."
  },
  {
    id: 2,
    name: "Maryland Zoo",
    city: "Baltimore",
    image: "images/maryland-zoo.jpg",
    description: "A popular family-friendly attraction featuring a wide range of animals and educational exhibits."
  },
  {
    id: 3,
    name: "Everyman Theatre",
    city: "Baltimore",
    image: "images/everyman-theatre.jpg",
    description: "A well-known Baltimore theatre offering engaging live performances in a historic setting."
  },
  {
    id: 4,
    name: "Walter's Museum of Art",
    city: "Baltimore",
    image: "images/walters-museum.jpg",
    description: "An art museum showcasing diverse collections and cultural exhibits in the heart of Baltimore."
  },
  {
    id: 5,
    name: "Baltimore Museum of Art",
    city: "Baltimore",
    image: "images/baltimore-museum-of-art.jpg",
    description: "A major cultural destination known for its art collections, exhibitions, and educational programs."
  },
  {
    id: 6,
    name: "Baltimore Museum of Industry",
    city: "Baltimore",
    image: "images/baltimore-museum-of-industry.jpg",
    description: "A museum preserving and presenting Baltimore’s industrial and manufacturing history."
  },
  {
    id: 7,
    name: "Medieval Times",
    city: "Baltimore",
    image: "images/medieval-times.jpg",
    description: "A themed entertainment destination combining dining, live performances, and medieval-style competitions."
  },
  {
    id: 8,
    name: "Baltimore National Aquarium",
    city: "Baltimore",
    image: "images/national-aquarium.jpg",
    description: "A waterfront attraction featuring aquatic life exhibits and immersive marine experiences."
  },
  {
    id: 9,
    name: "Maryland Science Center",
    city: "Baltimore",
    image: "images/maryland-science-center.jpg",
    description: "An interactive science attraction offering hands-on exhibits, learning experiences, and family activities."
  }
];

// Badge levels based on visit count
const badgeLevels = [
  { visits: 1, name: "Waypoint" },
  { visits: 2, name: "Dockside" },
  { visits: 3, name: "Charm City" },
  { visits: 4, name: "Harborline" },
  { visits: 5, name: "Blue Crab" },
  { visits: 6, name: "Old Bay" },
  { visits: 7, name: "Bayfront" },
  { visits: 8, name: "Anchor" },
  { visits: 9, name: "Harbor East" },
  { visits: 10, name: "Fells Point" },
  { visits: 11, name: "Crab Shack" },
  { visits: 12, name: "City Pass" }
];

// Register Route - Handle user registration

app.post("/api/register", async (req, res) => {
  try {
    if (!pool) {
      return dbUnavailable(res);
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required"
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with that email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log("About to register:", { username, email });

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'tourist')
       RETURNING id, username, email, role`,
      [username, email, passwordHash]
    );

    res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0]
    });
 } catch (error) {
  console.error("Register error full:", error);
  res.status(500).json({
    message: "Server error during registration"
  });
}
});

//Login Route - Handle user login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const result = await pool.query(
      "SELECT id, username, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login"
    });
  }
});

// API Route

// GET Routes

// Retrieve (GET) all available destinations
app.get("/api/destinations",(req,res) => {
  res.json(destinations);
});

//Get all badge names
app.get("/api/badges", (req, res) => {
  const badgeNames = badgeLevels.map(badge => badge.name);
  res.json(badgeNames);
});

// Retrieve (GET) all visits and total footprints
app.get("/api/visits", async (_req, res) => {
  try {
    if (!pool) {
      return dbUnavailable(res);
    }

    const visitsResult = await pool.query(
      `SELECT
         id,
         destination_id AS "destinationId",
         rating,
         comment,
         username,
         footprints,
         badge,
         visit_date AS date
       FROM visits
       ORDER BY visit_date DESC`
    );

    const visits = visitsResult.rows;

    const totalFootprints = visits.reduce(
      (sum: number, visit: any) => sum + Number(visit.footprints || 0),
      0
    );

    res.json({
      visits,
      totalFootprints
    });
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({
      message: "Failed to load visits"
    });
  }
});

// Retrieve (GET) a specific visit by ID
app.get("/api/visits/:id", async (req, res) => {
  try {
    if (!pool) {
      return dbUnavailable(res);
    }

    const visitId = parseInt(req.params.id);

    const result = await pool.query(
      `SELECT
         id,
         destination_id AS "destinationId",
         rating,
         comment,
         username,
         footprints,
         badge,
         visit_date AS date
       FROM visits
       WHERE id = $1`,
      [visitId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "visit not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching visit:", error);
    res.status(500).json({
      message: "Failed to load visit"
    });
  }
});

// POST Routes

// Record a new visit
app.post("/api/visits", async (req, res) => {
  try {
    if (!pool) {
      return dbUnavailable(res);
    }

    const { destinationId, rating, comment, username } = req.body;

    if (destinationId === undefined) {
      return res.status(400).json({
        message: "destinationId is required"
      });
    }

    if (!username) {
      return res.status(400).json({
        message: "username is required"
      });
    }

    const destId = Number(destinationId);
    const visitRating = Number(rating);

      if (isNaN(destId)) {
        return res.status(400).json({
          message: "destination ID must be a number"
        });
      }

      if (isNaN(visitRating) || visitRating < 1 || visitRating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5"
        });
      }

    const destination = destinations.find(d => d.id === destId);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found"
      });
    }

    let footprints = 0;

    if (comment && comment.trim() !== "") {
      footprints = visitRating * 10;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS visitCount
       FROM visits
       WHERE username = $1`,
      [username]
    );

    const visitCount = countResult.rows[0].visitCount + 1;

    const matchedBadge = badgeLevels.find(
      (badge) => badge.visits === visitCount
    );
    const badge = matchedBadge 
    ? matchedBadge.name
    : badgeLevels[badgeLevels.length - 1].name;

    const result = await pool.query(
      `INSERT INTO visits
       (destination_id, rating, comment, username, footprints, badge)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
         id,
         destination_id AS "destinationId",
         rating,
         comment,
         username,
         footprints,
         badge,
         visit_date AS date`,
      [
        destId, 
        visitRating, 
        comment ? comment.trim() : "", 
        username, 
        footprints, 
        badge 
      ]
    );

    res.status(201).json({
      message: "Visit recorded successfully",
      visit: result.rows[0]
    });
  } catch (error) {
    console.error("Error saving visit:", error);
    res.status(500).json({
      message: "Failed to save visit"
    });
  }
});

// Admin Analytics Route - Get overall statistics (admin only)
app.get("/api/admin/analytics", async (req, res) => {
  try {
    if (!pool) {
      return dbUnavailable(res);
    }

  const role = req.query.role;

  if (role !== "admin") {
    return res.status(403).json({ 
      error: "Access denied" });
  }

    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS "totalVisits",
        COALESCE(SUM(footprints), 0)::int AS "totalFootprints",
        COALESCE(AVG(rating), 0)::float AS "averageRating",
        COUNT(DISTINCT username)::int AS "activeUsers"
      FROM visits
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error loading analytics:", error);
    res.status(500).json({
      message: "Failed to load analytics"
    });
  }
});

// Start Server
app.listen(PORT, () => {
console.log(`Express is running on ${PORT}`);
});

