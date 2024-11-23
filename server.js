const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Ensure you're using dotenv to load environment variables

const app = express();

// Use the dynamic port from the environment (required for cloud hosting platforms)
const PORT = process.env.PORT || 5000; // Default to 5000 if no port is provided

// Middleware
app.use(cors()); // Enable CORS to handle requests from the frontend (Netlify)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to the backend server!");
});

// Email sending route
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ error: "All fields are required" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.APP_PASSWORD, // Your Gmail app password
            },
        });

        const mailOptions = {
            from: email, // Sender's email (from the frontend form)
            to: process.env.RECEIVER_EMAIL, // Receiver's email
            subject: `Portfolio Contact Form: Message from ${name}`,
            text: message, // Message content
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ error: "Failed to send email" });
    }
});

// Start the server and listen on the dynamic port provided by Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
