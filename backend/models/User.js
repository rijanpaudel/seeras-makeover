import mongoose from "mongoose";

//Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user"
  },

  fullName: {
    type: String,
    required: function () {
      return this.role === "user";
    }
  },
  
  phoneNumber: {
    type: String,
    required: function () {
      return this.role === "user";
    }
  },

  address: {
    type: String,
    required: function () {
      return this.role === "user";
    }
  }
}, {timeStamps: true});

const User = mongoose.model("User", userSchema);
export default User;