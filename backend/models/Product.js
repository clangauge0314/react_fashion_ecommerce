const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v >= 0,
        message: "Price must be a positive number",
      },
    },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    mercari_uri: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: "Invalid URI format",
      },
    },
    description: { type: String, required: true },
    details: { type: String, required: true },
    highlights: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["yes", "no"], 
      message: "Status must be either 'yes' or 'no'",
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: true,
      default: "unisex",
    },
    color: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[a-zA-Z]+$/.test(v),
        message: "Color must be a valid string containing only alphabets",
      },
    },
  },
  { timestamps: true }
);

productSchema.virtual("createdAtKST").get(function () {
  return moment(this.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
});

productSchema.virtual("updatedAtKST").get(function () {
  return moment(this.updatedAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
