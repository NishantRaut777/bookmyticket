import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

export const generateOTP = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // generates 0–9 digit
  }
  return otp;
};

export const sendEmail = async (to, subject, message) => {
  try {
    console.log("SMTP HOST", process.env.SMTP_HOST);
    console.log("SMTP PORT",  process.env.SMTP_PORT);
    console.log("EMail USer", process.env.EMAIL_USER);
    console.log("Email Password", process.env.EMAIL_PASS)

    // 1️⃣ Create transporter
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.sendgrid.net",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: "apikey",
    //     pass: process.env.SENDGRID_API_KEY,
    //   },
    //   tls: {
    //   rejectUnauthorized: false // Helps bypass some cloud network restrictions
    // }
    // });

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2️⃣ Email options
    const mailOptions = {
      from: `"Ticket Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Ticket Management System</h2>
          <p>${message}</p>
          <p style="font-size: 14px; color: #555;">If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    // 3️⃣ Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("INFO Transporter", info);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};


const privateKey = process.env.PRIVATE_KEY
  ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

const publicKey = process.env.PUBLIC_KEY
  ? process.env.PUBLIC_KEY.replace(/\\n/g, '\n')
  : undefined;


// Safety check to ensure keys loaded correctly
if (!privateKey || !publicKey) {
  throw new Error("FATAL: Private or Public key is missing from environment variables.");
}


const expiresIn = "24h";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, privateKey, {
    algorithm: "RS256",
    expiresIn
  })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] })
  } catch (error) {
    return null;
  }
}

export const generateBusSeats = () => {
  const rows = ["A","B","C","D"];
  const seatNumbers = [];

  for (const row of rows){
    for(let i=1; i<=10; i++){
      seatNumbers.push({
        seatNumber: `${row}${i}`,
        isBooked: false
      })
    }
  }

  return seatNumbers
}

export const generateTrainSeats = () => {
  const rows = 'ABCDEFGHIJKLMNOPQRST'.split("");
  const seats = [];

  for(const row of rows){
    for(let i=1; i<=10; i++){
      seats.push({
        seatNumber: `${row}${i}`,
        isBooked: false
      })
    }
  }

  return seats;
}