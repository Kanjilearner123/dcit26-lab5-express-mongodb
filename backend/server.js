
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Student Records API is running"
  });
});

function validId(id) {
  return mongoose.isValidObjectId(id);
}

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { fullName, course, yearLevel, section } = req.body;

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof course !== "string" ||
      !course.trim() ||
      yearLevel === undefined ||
      yearLevel === null ||
      yearLevel === "" ||
      !Number.isInteger(Number(yearLevel)) ||
      Number(yearLevel) < 1 ||
      Number(yearLevel) > 4 ||
      (section !== undefined && typeof section !== "string")
    ) {
      return res.status(400).json({
        message: "Provide a name, course, year level from 1 to 4, and a valid optional section"
      });
    }

    const student = await Student.create({
      fullName,
      course,
      yearLevel: Number(yearLevel),
      section
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const allowedFields = ["fullName", "course", "yearLevel", "section"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one valid field to update"
      });
    }

    if (
      ("fullName" in updates &&
        (typeof updates.fullName !== "string" || !updates.fullName.trim())) ||
      ("course" in updates &&
        (typeof updates.course !== "string" || !updates.course.trim())) ||
      ("section" in updates && typeof updates.section !== "string") ||
      ("yearLevel" in updates &&
        (updates.yearLevel === "" ||
          updates.yearLevel === null ||
          !Number.isInteger(Number(updates.yearLevel)) ||
          Number(updates.yearLevel) < 1 ||
          Number(updates.yearLevel) > 4))
    ) {
      return res.status(400).json({ message: "Invalid student data" });
    }

    if ("yearLevel" in updates) {
      updates.yearLevel = Number(updates.yearLevel);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }

  next(error);
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
