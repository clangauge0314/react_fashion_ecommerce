require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const contactRoutes = require("./routes/contact");
const orderRoutes = require("./routes/order");
const postRoutes = require("./routes/post");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/contact", contactRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/post", postRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "fashion_ecommerce",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});