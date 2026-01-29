import express from "express";

const app = express();
const PORT = 3000;
const users = [
  { id: 1, name: "Leslie Parks", email: "leslie.parks@cityplanning.gov" },
  { id: 2, name: "Sherlock Holmes", email: "sherlock@221b.co.uk" },
  { id: 3, name: "Michael Scott", email: "worldsbestboss@dundermifflin.com" },
];
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome! Mahendra Pahadi’s Express Server</h1>
    <p>Task 2 routes:</p>
    <ul>
      <li><a href="/api/users">/api/users</a></li>
      <li><a href="/api/users/2">/api/users/:id</a></li>
      <li><a href="/api/echo/hello">/api/echo/:message</a></li>
      <li><a href="/contact">/contact</a></li>
      <li><a href="/health">/health</a></li>
    </ul>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.get("/api/users", (req, res) => {
  res.json(users);
});
app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

app.get("/api/echo/:message", (req, res) => {
  res.json({ message: req.params.message });
});

app.get("/contact", (req, res) => {
  res.send(`
    <h1>Contact</h1>
    <p>Name: Mahendra Pahadi</p>
    <p>Email: Ag2199@student.jamk.fi</p>
    <p>Location: Jyväskylä</p>
  `);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
