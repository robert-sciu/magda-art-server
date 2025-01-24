const { transporter } = require("../services/nodemailer");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../utilities/controllerUtilities");
const logger = require("../utilities/logger");

async function sendEmail(req, res, next) {
  const { name, email, subject, message } = req.body;
  // console.log(name, email, subject, message);
  // return handleSuccessResponse(res, 200, "Message sent");
  try {
    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address
      to: process.env.MAIL_RECIPIENT_1, // list of receivers
      subject: `Subject: ${subject}`, // Subject line
      text: `Sender email: ${email}\n${message}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    const responseData = {
      name,
      email,
    };

    return handleSuccessResponse(res, 200, responseData);
    // res.json({ status: "success", data: `Message sent: ${info.messageId}` });
  } catch (error) {
    logger.error(error.message);
    return handleErrorResponse(res, 500, error.message);
    // res.json({ status: "error", message: error.message });
  }
}

module.exports = { sendEmail };
