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
require("dotenv/config");
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
if (db_1.pool) {
    db_1.pool.query("SELECT NOW()")
        .then(res => console.log("Database connected:", res.rows[0]))
        .catch(err => console.error("Database connection error:", err));
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
// Array to store user visits
let visits = [];
let users = [
    { id: 1, username: "tourist1", password: "tour123", role: "tourist" },
    { id: 2, username: "admin1", password: "admin123", role: "admin" }
];
// API Route
// GET Routes
// Retrieve (GET) all available destinations
app.get("/api/destinations", (req, res) => {
    res.json(destinations);
});
// Retrieve (GET) all visits and total footprints
app.get("/api/visits", (req, res) => {
    // Calculate total footprints earned
    const totalFootprints = visits.reduce((sum, visit) => sum + visit.footprints, 0);
    // Return visits along with total footprints
    res.json({
        visits,
        totalFootprints
    });
});
// Retrieve (GET) a specific visit by ID
app.get("/api/visits/:id", (req, res) => {
    // Convert ID from string to number
    const visitId = parseInt(req.params.id);
    // Find the visit in the array
    const visit = visits.find((v) => v.id === visitId);
    // If visit does not exist, return error
    if (!visit) {
        return res.status(404).json({ error: "visit not found" });
    }
    // Return the found visit
    res.json(visit);
});
// POST Routes
// Record a new visit
app.post("/api/visits", (req, res) => {
    // Extract data from request body
    const { destinationId, rating, comment, username } = req.body;
    // Validation
    // Check required fields
    if (destinationId === undefined) {
        return res.status(400).json({
            message: "destinationId is required"
        });
    }
    // Convert inputs to numbers
    const destId = Number(destinationId);
    const visitRating = Number(rating);
    // Ensure rating is a valid number
    if (visitRating !== 0) {
        if (isNaN(visitRating) || visitRating <= 0) {
            return res.status(400).json({ message: "Rating must be a positive number" });
        }
        if (visitRating < 1 || visitRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
    }
    //Checking if destination exists
    const destination = destinations.find(d => d.id === destId);
    if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
    }
    // Business Logic
    // Calculate footprints based on rating
    let footprints = 0;
    if (visitRating > 0 && comment && comment.trim() !== "") {
        footprints = visitRating * 10;
    }
    // Assign badge based on footprints
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
    // Create Visit 
    const visit = {
        id: visits.length + 1,
        destinationId: destId,
        rating: visitRating,
        comment: comment ? comment.trim() : "",
        username,
        footprints,
        badge,
        date: new Date()
    };
    console.log("New visit saved:", visit);
    // Store visit in memory
    visits.push(visit);
    // Response
    // Return confirmation and visit data
    res.status(201).json({
        message: "Visit recorded successfully",
        visit
    });
});
app.post("/api/login", (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({
            message: "Username, password, and role are required"
        });
    }
    const user = users.find(u => u.username === username &&
        u.password === password &&
        u.role === role);
    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});
app.get("/api/admin/analytics", (req, res) => {
    const role = req.query.role;
    if (role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    const totalVisits = visits.length;
    const totalFootprints = visits.reduce((sum, visit) => sum + visit.footprints, 0);
    const averageRating = visits.length > 0
        ? visits.reduce((sum, visit) => sum + visit.rating, 0) / visits.length
        : 0;
    const activeUsers = new Set(visits.map((visit) => visit.username)).size;
    res.json({
        totalVisits,
        totalFootprints,
        averageRating,
        activeUsers
    });
});
// Start Server
// Run server on port 3000
app.listen(PORT, () => {
    console.log(`Express is running on ${PORT}`);
});
