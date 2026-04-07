import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  artist: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true }
});

const Album = mongoose.model("Album", albumSchema);

export default Album;