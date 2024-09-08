const mongoose = require("mongoose");
const generateRandomString = require("../utils/generateRandomString");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true, // Ensure uniqueness
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderPlaced: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Completed",
      "Cancelled",
    ],
    default: "Pending",
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          "Pending",
          "Confirmed",
          "Shipped",
          "Out for Delivery",
          "Delivered",
          "Completed",
          "Cancelled",
        ],
        required: true,
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
      comment: {
        type: String,
      },
    },
  ],
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryInformation: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    mobileNumber: {
      type: String,
      required: true,
      // match: /^\d{10}$/, // Adjust regex based on your format
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery", "GCash"],
    required: true,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const day = String(now.getDate()).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2); // Last two digits of year

    let randomString;
    let uniqueId = "";
    let isUnique = false;

    while (!isUnique) {
      randomString = generateRandomString(6); // Generate a 6-character random string
      uniqueId = `${month}${day}${year}${randomString}`;

      // Check if the ID already exists in the database
      const existingOrder = await mongoose
        .model("Order")
        .findOne({ orderId: uniqueId });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    this.orderId = uniqueId;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
