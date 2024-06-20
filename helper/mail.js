const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const gmail = require("../config/").gmail;
//
ROOT_DIR = path.join(path.resolve(__dirname), "..");
//
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: gmail.email,
        pass: gmail.password,
      },
    });
    this.connect = false;
  }
  connection() {
    this.transporter.verify((error, _) => {
      if (error) {
        console.log(error.message);
        console.log(`INFO:   ${error.message}`);
      } else {
        this.connect = true;
        console.log("INFO:   Mail Service is running");
      }
    });
  }

  SendMail = async (receiveEmail, message) => {
  // SendMail = async (sendEmail, receiveEmail, message) => {
    try {
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: receiveEmail,
        subject: "Information",
        text: message,
      };
      this.transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
          console.log(err.message);
          return false;
        }
        return true;
      });
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };
}
const mailService = new MailService();
mailService.connection();

module.exports = mailService;
