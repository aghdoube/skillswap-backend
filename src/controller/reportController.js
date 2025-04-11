import Report from "../models/Reports.js";

export const submitReport = async (req, res, next ) => {
  try {
    const { reporter, reportedUser, reason } = req.body;

    const report = new Report({ reporter, reportedUser, reason });
    await report.save();

    res.status(201).json({ message: "Report submitted successfully.", report });
  } catch (error) {
    next(error);  }  
};

export const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate("reporter", "name email").populate("reportedUser", "name email").sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);  }  
};

export const reviewReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findByIdAndUpdate(reportId, { status, adminNotes }, { new: true });

    if (!report) return res.status(404).json({ message: "Report not found." });

    res.json({ message: "Report updated successfully.", report });
  } catch (error) {
    next(error);  }  
};
