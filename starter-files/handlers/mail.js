const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const path = require('path');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

const generateHTML = (filename, options = {}) => {
  const emailPath = path.join(__dirname, `./../views/email/${filename}.pug`);
  const html = pug.renderFile(emailPath, options);
  const inlined = juice(html);

  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const mailOptions = {
    from: 'David Nuñez <dh_nz@hotmail.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text: htmlToText.fromString(html)
  };

  const sendMail = promisify(transport.sendMail, transport);

  return sendMail(mailOptions);
};
