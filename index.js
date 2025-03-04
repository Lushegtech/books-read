const express = require("express")
const app = express()
const port = process.env.PORT || 3000

// Set EJS as the view engine
app.set("view engine", "ejs")

// Serve static files from the public directory
app.use(express.static("public"))

// Sample books data
const sampleBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    rating: 5,
    notes: "Great book on habit formation.",
    dateRead: "2024-02-25",
    coverUrl: "/images/atomic-habits.jpg", // Replace with actual image path
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    rating: 4,
    notes: "Insightful perspectives on how people think about money.",
    dateRead: "2024-01-15",
    coverUrl: "/images/psychology-of-money.jpg",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    rating: 5,
    notes: "Fascinating exploration of human history.",
    dateRead: "2023-11-10",
    coverUrl: "/images/sapiens.jpg",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    rating: 4,
    notes: "Engaging sci-fi with great scientific problem-solving.",
    dateRead: "2023-12-05",
    coverUrl: "/images/project-hail-mary.jpg",
  },
]

// Routes
app.get("/", (req, res) => {
  res.render("books", { books: sampleBooks })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

