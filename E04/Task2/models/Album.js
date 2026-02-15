import mongoose from "mongoose";

const currentYear = new Date().getFullYear();

const allowedGenres = [
  "Pop",
  "Rock",
  "Electronic",
  "Jazz",
  "Hip Hop",
  "Classical",
  "Progressive Rock",
  "Metal",
  "R&B",
  "Folk"
];

const albumSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: [true, "Artist is required"],
      minlength: [3, "Artist must be at least 3 characters"],
      maxlength: [50, "Artist must be at most 50 characters"],
      trim: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [50, "Title must be at most 50 characters"],
      trim: true
    },
    tracks: {
      type: Number,
      required: [true, "Tracks is required"],
      min: [1, "Tracks must be at least 1"],
      max: [100, "Tracks must be at most 100"]
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year must be 1900 or later"],
      max: [currentYear, `Year must be ${currentYear} or earlier`]
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: allowedGenres,
        message: "Genre is not allowed"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);
