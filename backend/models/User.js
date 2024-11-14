const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual("createdAtKST").get(function () {
  return moment(this.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
});

userSchema.virtual("updatedAtKST").get(function () {
  return moment(this.updatedAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
});

const User = mongoose.model("User", userSchema);
module.exports = User;
