import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static("public"));

const users = [
  { id: 1, name: "Leslie Parks", email: "leslie.parks@cityplanning.gov" },
  { id: 2, name: "Sherlock Holmes", email: "sherlock@221b.co.uk" },
  { id: 3, name: "Michael Scott", email: "worldsbestboss@dundermifflin.com" },
];

// GET all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
