require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  uploadPath: process.env.UPLOAD_PATH
};
