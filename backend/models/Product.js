const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, validate: { validator: (v) => v >= 0, message: "Price must be a positive number" } },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    mercari_uri: { type: String, required: false, validate: { validator: function (v) { return /^(http|https):\/\/[^ "]+$/.test(v); }, message: "Invalid URI format" } },
    description: { type: String, required: true },
    details: { type: String, required: true },
    highlights: { type: String, required: true },
    status: { type: String, required: true },
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
