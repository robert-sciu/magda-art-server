const { transporter } = require("../config/nodemailer");

async function sendEmail(req, res, next) {
  const { name, email, subject, message } = req.body;
  try {
    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address
      to: `robert.sciu@gmail.com`, // list of receivers
      subject: `Subject: ${subject}`, // Subject line
      text: `Sender email: ${email}\n${message}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
    res.json({ status: "success", data: `Message sent: ${info.messageId}` });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

module.exports = { sendEmail };
