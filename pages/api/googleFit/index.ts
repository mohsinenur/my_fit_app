import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";

const cors = Cors({
  allowMethods: ["GET", "POST"], // Adjust the allowed methods as needed
  origin: "*",
});

const oAuth2Client = new OAuth2Client(
  "1057655363182-ibsiskiieg92t41t5ofk5hvu39q6kmlq.apps.googleusercontent.com",
  "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",
  // "https://zero-fitness01.netlify.app/fit.html"
  "http://localhost:3000/fit.html"
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const SCOPES = [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.blood_glucose.read",
      "https://www.googleapis.com/auth/fitness.blood_pressure.read",
      "https://www.googleapis.com/auth/fitness.heart_rate.read",
      "https://www.googleapis.com/auth/fitness.body.read",
      "https://www.googleapis.com/auth/fitness.sleep.read",
      "https://www.googleapis.com/auth/fitness.reproductive_health.read",
    ];

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    res
      .status(200)
      .json({ message: "Get API for google fit", authUrl: authUrl });
    //res.redirect(authUrl);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default cors(handler);
