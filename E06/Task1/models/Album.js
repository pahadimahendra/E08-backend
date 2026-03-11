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

function buildArtistTitle(artist, title) {
  return `${String(artist).trim().toLowerCase()}::${String(title)
    .trim()
    .toLowerCase()}`;
}

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

    // Task 5: async duplicate prevention
    artistTitle: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: async function (value) {
          // Works for create (doc) and update (query)
          const Model =
            typeof this.model === "function" ? this.model() : this.constructor;

          const query =
            typeof this.getQuery === "function" ? this.getQuery() : {};
          const currentId = this._id || query._id;

          const existing = await Model.findOne({
            artistTitle: value,
            _id: { $ne: currentId },
          }).lean();

          return !existing;
        },
        message: "An album with this artist and title already exists",
      },
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
          return value <= new Date().getFullYear();
        },
        message: "Release year cannot be in the future",
      },
    },

    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: { values: allowedGenres, message: "Genre is not allowed" },
    },
  },
  { timestamps: true }
);

// Task 4: virtual
albumSchema.virtual("ageInYears").get(function () {
  return new Date().getFullYear() - this.year;
});

// Task 4: instance method
albumSchema.methods.isClassic = function () {
  return this.ageInYears > 25;
};

// Task 4: static method
albumSchema.statics.findByGenre = function (genre) {
  return this.find({ genre }).exec();
};

// Auto-build artistTitle on CREATE
albumSchema.pre("validate", function () {
  this.artistTitle = buildArtistTitle(this.artist, this.title);
});

// Auto-build artistTitle on UPDATE (handles partial updates)
albumSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() || {};
  const setObj = update.$set || update;

  const artistIncoming = setObj.artist;
  const titleIncoming = setObj.title;

  if (artistIncoming === undefined && titleIncoming === undefined) return;

  let artistFinal = artistIncoming;
  let titleFinal = titleIncoming;

  if (artistFinal === undefined || titleFinal === undefined) {
    const current = await this.model
      .findOne(this.getQuery())
      .select("artist title")
      .lean();

    if (!current) return;

    if (artistFinal === undefined) artistFinal = current.artist;
    if (titleFinal === undefined) titleFinal = current.title;
  }

  const artistTitle = buildArtistTitle(artistFinal, titleFinal);

  if (update.$set) update.$set.artistTitle = artistTitle;
  else update.artistTitle = artistTitle;

  this.setUpdate(update);
});

export default mongoose.model("Album", albumSchema);
