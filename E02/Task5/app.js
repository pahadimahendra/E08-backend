import express from "express";
import albumRoutes from "./routes/albums.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h1>Task 5 Album API 🎵</h1>
    <ul>
      <li><a href="/albums">GET /albums</a></li>
      <li><a href="/albums/1">GET /albums/1</a></li>
    </ul>
  `);
});

app.use("/albums", albumRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
