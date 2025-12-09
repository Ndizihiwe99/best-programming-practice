const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true,
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["theft", "vandalism", "assault", "fraud", "suspicious", "other"],
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: 1000,
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    district: String,
    sector: String,
    cell: String,
    village: String,
  },
  images: [
    {
      url: String,
      publicId: String,
    },
  ],
  status: {
    type: String,
    enum: [
      "submitted",
      "under_review",
      "assigned",
      "investigating",
      "resolved",
      "closed",
    ],
    default: "submitted",
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  policeStation: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  incidentDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.pre("save", function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.reportId = `CR${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Report", reportSchema);
