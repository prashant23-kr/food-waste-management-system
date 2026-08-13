const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    donorName: {
      type: String,
      required: true,
      trim: true,
    },

    foodCategory: {
      type: String,
      required: true,
      enum: [
        "Fruits",
        "Vegetables",
        "Grains",
        "Dairy",
        "Cooked Food",
        "Bakery",
        "Other",
      ],
    },

    foodDescription: {
      type: String,
      trim: true,
      default: "",
    },

    foodQuantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      default: "kg",
    },

    location: {
      type: String,
      required: true,
    },

    ngoName: {
      type: String,
      trim: true,
      default: "",
    },

    pickupDate: {
      type: Date,
      default: null,
    },

    pickupTime: {
      type: String,
      default: "",
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Picked Up",
        "Delivered",
        "Wasted",
        "Accepted",
        "Rejected",
        "Scheduled",
      ],
      default: "Pending",
    },

    distributedQuantity: {
      type: Number,
      default: 0,
    },

    wastedQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

foodDonationSchema.index({ donorId: 1, createdAt: -1 });
foodDonationSchema.index({ ngoId: 1, status: 1 });

module.exports = mongoose.model(
  "FoodDonation",
  foodDonationSchema
);
