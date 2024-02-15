import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";

const cors = Cors({
  allowMethods: ["GET", "POST"], // Adjust the allowed methods as needed
  origin: "*",
});

const oAuth2Client = new OAuth2Client("798513138133-8j86j07a1pvno1k64b321f5cguvqru6u.apps.googleusercontent.com","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","https://zero-fitness01.netlify.app/fit.html");

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
