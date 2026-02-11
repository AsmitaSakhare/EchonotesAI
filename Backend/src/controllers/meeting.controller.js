const fs = require("fs");

exports.uploadMeeting = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      success: true,
      message: "Meeting audio uploaded successfully",
      data: {
        filename: req.file.filename,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.getMeetings = (req, res) => {
  try {
    const uploadPath = process.env.UPLOAD_DIR || "uploads";
    const files = fs.readdirSync(uploadPath);

    res.status(200).json({
      success: true,
      files: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch files",
      error: error.message
    });
  }
};

