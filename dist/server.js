"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Express Framework
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
if (db_1.pool) {
    db_1.pool.query("SELECT NOW()")
        .then((res) => console.log("Database connected:", res.rows[0]))
        .catch((err) => console.error("Database connection error:", err));
}
else {
    console.warn("DATABASE_URL is not set; skipping database connection test.");
}
// Create Express Application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(process.cwd(), "public");
// Middleware
//Enable JSON parsing for incoming requests
app.use(express_1.default.json()); // allows POST requests with JSON
app.use(express_1.default.static(publicPath));
// Root Route (Load Frontend)
app.get("/", (_req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required"
            });
        }
        const existingUser = await db_1.pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "An account with that email already exists"
            });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        console.log("About to register:", { username, email });
        const result = await db_1.pool.query(`INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'tourist')
       RETURNING id, username, email, role`, [username, email, passwordHash]);
        res.status(201).json({
            message: "Account created successfully",
            user: result.rows[0]
        });
    }
    catch (error) {
        console.error("Register error full:", error);
        res.status(500).json({
            message: "Server error during registration"
        });
    }
});
// In Memory Data Storage
// List of tourist destinations
let destinations = [
    { id: 1, name: "Maryland Zoo", city: "Baltimore" },
    { id: 2, name: "Everyman Theatre", city: "Baltimore" },
    { id: 3, name: "Walter's Museum of Art", city: "Baltimore" },
    { id: 4, name: "Baltimore Museum of Art", city: "Baltimore" },
    { id: 5, name: "Baltimore Museum of Industry", city: "Baltimore" },
    { id: 6, name: "Medieval Times", city: "Baltimore" },
    { id: 7, name: "Baltimore National Aquarium", city: "Baltimore" },
    { id: 8, name: "Maryland Science Center", city: "Baltimore" },
];
// API Route
// GET Routes
// Retrieve (GET) all available destinations
app.get("/api/destinations", (req, res) => {
    res.json(destinations);
});
// Retrieve (GET) all visits and total footprints
app.get("/api/visits", async (_req, res) => {
    try {
        const visitsResult = await db_1.pool.query(`SELECT
         id,
         destination_id AS "destinationId",
         rating,
         comment,
         username,
         footprints,
         badge,
         visit_date AS date
       FROM visits
       ORDER BY visit_date DESC`);
        const visits = visitsResult.rows;
        const totalFootprints = visits.reduce((sum, visit) => sum + visit.footprints, 0);
        res.json({
            visits,
            totalFootprints
        });
    }
    catch (error) {
        console.error("Error fetching visits:", error);
        res.status(500).json({
            message: "Failed to load visits"
        });
    }
});
// Retrieve (GET) a specific visit by ID
app.get("/api/visits/:id", async (req, res) => {
    try {
        const visitId = parseInt(req.params.id);
        const result = await db_1.pool.query(`SELECT
         id,
         destination_id AS "destinationId",
         rating,
         comment,
         username,
         footprints,
         badge,
         visit_date AS date
       FROM visits
       WHERE id = $1`, [visitId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "visit not found" });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
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
        if (visitRating !== 0) {
            if (isNaN(visitRating) || visitRating <= 0) {
                return res.status(400).json({
                    message: "Rating must be a positive number"
                });
            }
            if (visitRating < 1 || visitRating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5"
                });
            }
        }
        const destination = destinations.find(d => d.id === destId);
        if (!destination) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }
        let footprints = 0;
        if (visitRating > 0 && comment && comment.trim() !== "") {
            footprints = visitRating * 10;
        }
        let badge = "First Step";
        if (footprints >= 20)
            badge = "Traveler";
        if (footprints >= 40)
            badge = "Explorer";
        if (footprints >= 50)
            badge = "Adventurer";
        if (footprints >= 80)
            badge = "Voyager";
        if (footprints >= 100)
            badge = "Trailblazer";
        const result = await db_1.pool.query(`INSERT INTO visits
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
         visit_date AS date`, [destId, visitRating, comment ? comment.trim() : "", username, footprints, badge]);
        res.status(201).json({
            message: "Visit recorded successfully",
            visit: result.rows[0]
        });
    }
    catch (error) {
        console.error("Error saving visit:", error);
        res.status(500).json({
            message: "Failed to save visit"
        });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const result = await db_1.pool.query("SELECT id, username, email, password_hash, role FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const user = result.rows[0];
        const passwordMatch = await bcrypt_1.default.compare(password, user.password_hash);
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
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error during login"
        });
    }
});
app.get("/api/admin/analytics", async (req, res) => {
    const role = req.query.role;
    if (role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const result = await db_1.pool.query(`
      SELECT
        COUNT(*)::int AS "totalVisits",
        COALESCE(SUM(footprints), 0)::int AS "totalFootprints",
        COALESCE(AVG(rating), 0)::float AS "averageRating",
        COUNT(DISTINCT username)::int AS "activeUsers"
      FROM visits
    `);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error loading analytics:", error);
        res.status(500).json({
            message: "Failed to load analytics"
        });
    }
});
// Start Server
// Run server on port 3000
app.listen(PORT, () => {
    console.log(`Express is running on ${PORT}`);
});
