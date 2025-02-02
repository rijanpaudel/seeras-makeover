import mongoose from "mongoose";

//Define the user schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phoneNumber: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
}, {timeStamps: true});

const User = mongoose.model("User", userSchema);
export default User;