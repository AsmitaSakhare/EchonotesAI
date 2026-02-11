const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { uploadMeeting, getMeetings } = require("../controllers/meeting.controller");


router.post("/upload", upload.single("audio"), uploadMeeting);
router.get("/", getMeetings);

module.exports = router;
