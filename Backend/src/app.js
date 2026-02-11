const express = require("express");
const cors = require("cors");
const meetingRoutes = require("./routes/meeting.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/meetings", meetingRoutes);

// Error handling
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});


module.exports = app;
