import express from "express";
const app = express();

// middleware
app.use(express.json()); // allows POST requests with JSON

// in memory data storage
let destinations = [
{id: 1, name: "Baltimore Zoo", city: "Baltimore"},
{id: 2, name: "Fort McHenry", city: "Baltimore" }
];

let visits: any[] = []; // empty array for storing visits

// Root route
app.get("/", (req,res) => {
  res.send("Welcome to The Domestic Tourist Passport Project Alpha!!");
});

// GET destinations
app.get("/api/destinations",(req,res) => {
  res.json(destinations);
});

// POST visits
app.post("/api/visits", (req,res) => {
  const {destinationId, rating } = req.body;

  //Checking if destination exists
  const destination = destinations.find(d => d.id === destinationId);
  if (!destination) {
  return res.status(404).json({ message: "Destination not found"});
}
  // Checking rating
  if (!destinationId || !rating) {
    return res.sendStatus(400).json({message: "destinationId and rating are requited"});
  }
// Creating Visit
  const visit = {
    id: visits.length + 1,
    destinationId,
    rating,
    footprints: rating * 10, // simple reward calculation
    date: new Date()
  };

 visits.push(visit);

  res.status(201).json(visit);
});

app.get("/api/visits", (req, res) => {
  res.json(visits);
});

app.listen(3000, () => {
  console.log('Express is running on 3000');
});
