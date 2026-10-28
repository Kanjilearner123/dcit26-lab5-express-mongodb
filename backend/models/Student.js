
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true
  },
  course: {
    type: String,
    required: [true, "Course is required"],
    trim: true
  },
  yearLevel: {
    type: Number,
    required: [true, "Year level is required"],
    min: [1, "Year level must be from 1 to 4"],
    max: [4, "Year level must be from 1 to 4"],
    validate: {
      validator: Number.isInteger,
      message: "Year level must be a whole number"
    }
  },
  section: {
    type: String,
    trim: true,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Student", studentSchema);
