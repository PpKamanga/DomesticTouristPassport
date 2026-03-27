"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Express Framework
const express_1 = __importDefault(require("express"));
// Create Express Application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
//Enable JSON parsing for incoming requests
app.use(express_1.default.json()); // allows POST requests with JSON
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
// Root Route
// Basic route to confirm server is running
app.get("/", (req, res) => {
    res.send("Welcome to The Domestic Tourist Passport Project Alpha!!");
});
// GET Routes
// Retrieve (GET) all available destinations
app.get("/api/destinations", (req, res) => {
    res.json(destinations);
});
// Retrieve (GET) all visits and total footprints
app.get("/api/visits", (req, res) => {
    // Calculate total footprints earned
    const totalFootprints = visits.reduce((sum, v) => sum + v.footprints, 0);
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
    const { destinationId, rating, comment } = req.body;
    // Validation
    // Check required fields
    if (!destinationId === undefined || rating === undefined) {
        return res.status(400).json({ message: "destinationId and rating are required" });
    }
    // Convert inputs to numbers
    const destId = Number(destinationId);
    const visitRating = Number(rating);
    // Ensure rating is a valid number
    if (isNaN(visitRating) || visitRating <= 0) {
        return res.status(400).json({ message: "Rating must be a positive number" });
    }
    //Ensure rating is within valid range
    if (visitRating < 1 || visitRating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    //Checking if destination exists
    const destination = destinations.find(d => d.id === destId);
    if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
    }
    // Business Logic
    // Calculate footprints based on rating
    const footprints = visitRating * 10;
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
        comment: comment || "", // Optional user feedback
        footprints,
        badge,
        date: new Date()
    };
    // Store visit in memory
    visits.push(visit);
    // Response
    // Return confirmation and visit data
    res.status(201).json({
        message: "Visit recorded successfully",
        visit
    });
});
// Start Server
// Run server on port 3000
app.listen(PORT, () => {
    console.log('Express is running on ${PORT}');
});
