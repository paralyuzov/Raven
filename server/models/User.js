const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  nickname: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
  avatar: { type: String, default: "" },
  password: { type: String, required: true },

  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null }, 
});


const MAX_ATTEMPTS = 5; 
const LOCK_TIME = 30 * 60 * 1000; 

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  if (this.lockUntil && this.lockUntil > Date.now()) {
    throw new Error("Account locked due to too many failed login attempts. Try again later.");
  }

  const isMatch = await bcrypt.compare(password, this.password);
  if (!isMatch) {
    this.failedAttempts += 1;

    if (this.failedAttempts >= MAX_ATTEMPTS) {
      this.lockUntil = Date.now() + LOCK_TIME;
    }

    await this.save(); 
    throw new Error("Invalid credentials. Too many failed attempts will lock the account.");
  }

  this.failedAttempts = 0;
  this.lockUntil = null;
  await this.save();
  
  return true;
};

module.exports = mongoose.model("User", UserSchema);