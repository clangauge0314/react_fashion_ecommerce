const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    price: {
      type: Number,
      required: false,
      default: 0,
      validate: {
        validator: (v) => v >= 0,
        message: "Price must be a positive number",
      },
    },
    image: { type: [String], required: false },
    category: { type: String, required: false },
    mercari_uri: {
      type: String,
      required: false,
    },
    description: { type: String, required: false },
    status: {
      type: String,
      required: false,
      enum: ["yes", "no"],
      message: "Status must be either 'yes' or 'no'",
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: false,
      default: "unisex",
    },
    color: {
      type: [String],
      required: false,
    },
    stock: {
      type: Number,
      default: 0,
      validate: {
        validator: (v) => v >= 0,
        message: "Stock must be a non-negative number",
      },
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.stock <= 1) {
    this.status = "no";
  }
  next();
});

productSchema.virtual("createdAtKST").get(function () {
  return moment(this.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
});

productSchema.virtual("updatedAtKST").get(function () {
  return moment(this.updatedAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
