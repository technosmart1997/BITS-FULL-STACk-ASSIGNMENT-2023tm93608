import mongoose from "mongoose";

const AvailabilityStatus = Object.freeze({
  AVALAIBLE: "available",
  RESERVED: "reserved",
  REQUESTED: "requested",
});

export const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    condition: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AvailabilityStatus),
      default: AvailabilityStatus.AVALAIBLE,
    },
  },
  {
    collection: "books",
    timestamps: true,
  }
);

export const Book = mongoose.model("books", bookSchema);
