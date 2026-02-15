import mongoose from "mongoose";

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
  "Folk",
];

const albumSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: [true, "Artist is required"],
      minlength: [3, "Artist must be at least 3 characters"],
      maxlength: [50, "Artist must be at most 50 characters"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [50, "Title must be at most 50 characters"],
      trim: true,
    },
    tracks: {
      type: Number,
      required: [true, "Tracks is required"],
      min: [1, "Tracks must be at least 1"],
      max: [100, "Tracks must be at most 100"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year must be 1900 or later"],
      validate: {
        validator: function (value) {
          const currentYear = new Date().getFullYear();
          return value <= currentYear;
        },
        message: "Release year cannot be in the future",
      },
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: allowedGenres,
        message: "Genre is not allowed",
      },
    },
  },
  { timestamps: true }
);

/*Task 4: Virtual property - ageInYears */
albumSchema.virtual("ageInYears").get(function () {
  return new Date().getFullYear() - this.year;
});

/*Task 4: Instance method - isClassic() */
albumSchema.methods.isClassic = function () {
  return this.ageInYears > 25;
};

/*Task 4: Static method - findByGenre(genre) */
albumSchema.statics.findByGenre = function (genre) {
  return this.find({ genre }).exec();
};

export default mongoose.model("Album", albumSchema);
