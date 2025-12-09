const Report = require("../models/Report");
const Subject = require("../observers/Subject");
const SmsObserver = require("../observers/SmsObserver");

const statusChangeSubject = new Subject();
const smsObserver = new SmsObserver();
statusChangeSubject.attach(smsObserver);

exports.createReport = async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      citizen: req.user.id,
    };

    const report = await Report.create(reportData);

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found",
      });
    }

    const oldStatus = report.status;
    report.status = status;
    report.updatedAt = Date.now();

    if (status === "assigned" || status === "investigating") {
      report.assignedOfficer = req.user.id;
    }

    await report.save();

    // Get citizen for SMS
    await report.populate("citizen", "phone");

    // Notify observers
    await statusChangeSubject.notify({
      report,
      oldStatus,
      newStatus: status,
      citizenPhone: report.citizen.phone,
      updatedBy: req.user.id,
    });

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;

    const query = {};

    if (req.user.role === "officer") {
      query.policeStation = req.user.policeStation;
    } else if (req.user.role === "citizen") {
      query.citizen = req.user.id;
    }

    if (status) query.status = status;
    if (category) query.category = category;

    const reports = await Report.find(query)
      .populate("citizen", "name phone")
      .populate("assignedOfficer", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort("-createdAt");

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
