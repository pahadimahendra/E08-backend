import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    artist: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    year: { type: Number },
    genre: { type: String, trim: true },
    tracks: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);
