const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  role: {
    type: String,
    enum: ["candidate", "recruiter"],
    default: "candidate"
  },
  company: { type: String }
});




module.exports = mongoose.model("User", userSchema);
 
