import mongoose from "mongoose";

export const ExchangeStatus = Object.freeze({
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
});

export const exchangeSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "books",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users", // assuming it references a User collection
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // assuming it references a User collection
    },
    duration: {
      type: Number,
    },
    status: {
      type: String,
      enum: Object.values(ExchangeStatus),
      default: ExchangeStatus.PENDING,
    },
  },
  {
    collection: "exchange",
    timestamps: true,
  }
);

export const Exchange = mongoose.model("exchange", exchangeSchema);
