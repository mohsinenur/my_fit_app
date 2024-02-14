import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import Cors from "micro-cors";

const cors = Cors({
  allowMethods: ["GET", "POST"], // Adjust the allowed methods as needed
  origin: "*",
});

const oAuth2Client = new OAuth2Client(
  "798513138133-8q428nvjp71olpff3aedq2ujpbckk4jl.apps.googleusercontent.com",
  "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",
  "https://api-fit-app.netlify.app/dashboard"
);

const handler = async (req, res) => {
  try {
    const { code } = req.query;
    // console.log(code);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Set start and end time for data aggregation
    const endTimeMillisInTS = Date.now() + 24 * 60 * 60 * 1000;

    // Convert to UTC Unix time
    const endTimeUTC = Date.parse(new Date(endTimeMillisInTS).toUTCString());

    // Calculate 7 days before and reset to start of the day
    const sevenDaysBefore = 7 * 24 * 60 * 60 * 1000;
    const startTimeMillis = Date.parse(new Date(endTimeUTC - sevenDaysBefore).toISOString().split('T')[0]);

    // Adjust the endTimeUTC to the end of the day
    const endOfDayMillis = 24 * 60 * 60 * 1000 - 1; // 23:59:59.999
    const endTimeMillis = endTimeUTC - (2 * 24 * 60 * 60 * 1000) + endOfDayMillis;


    const fitness = google.fitness({ version: "v1", auth: oAuth2Client });

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
          },
          {
            dataTypeName: "com.google.blood_glucose",
          },
          {
            dataTypeName: "com.google.blood_pressure",
          },
          {
            dataTypeName: "com.google.heart_rate.bpm",
          },
          {
            dataTypeName: "com.google.weight",
          },
          {
            dataTypeName: "com.google.height",
          },
          {
            dataTypeName: "com.google.sleep.segment",
          },
          {
            dataTypeName: "com.google.body.fat.percentage",
          },
          {
            dataTypeName: "com.google.menstruation",
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Aggregate data in daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    const fitnessData = response.data.bucket;
    //console.log(fitnessData);
    const formattedData = [];

    fitnessData.map((data) => {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedDate = date.toDateString();

      //console.log("Date:", formattedDate);
      const formattedEntry = {
        date: formattedDate,
        step_count: 0,
        glucose_level: 0,
        blood_pressure: [],
        // low_blood_pressure: 0,
        heart_rate: 0,
        weight: 0,
        height_in_cms: 0,
        sleep_hours: 0,
        body_fat_in_percent: 0,
        menstrual_cycle_start: "",
      };

      const datasetMap = data.dataset;
      datasetMap.map((mydataset) => {
        const point = mydataset.point;
        // console.log(mydataset.dataSourceId)
        if (point && point.length > 0) {
          const value = point[0].value;
          switch (mydataset.dataSourceId) {
            case "derived:com.google.step_count.delta:com.google.android.gms:aggregated":
              // console.log("Step count:", value[0]?.intVal);
              formattedEntry.step_count = value[0]?.intVal || 0;
              break;
            case "derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated":
              // console.log("Blood glucose:",mydataset.point[0]?.value)
              let glucoseLevel = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  const dataArray = mydataset.point[0]?.value;
                  dataArray.map((data) => {
                    if (data.fpVal) {
                      glucoseLevel = data.fpVal * 10;
                    }
                  });
                }
              }
              formattedEntry.glucose_level = glucoseLevel;
              break;
            case "derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated":
              // console.log("Blood pressure:",mydataset.point[0]?.value)
              let finalData = [0, 0];
              if (mydataset.point[0]?.value) {
                const BParray = mydataset.point[0]?.value;
                if (BParray.length > 0) {
                  BParray.map((data) => {
                    if (data.fpVal) {
                      if (data.fpVal > 100) {
                        finalData[0] = data.fpVal;
                      } else if (data.fpVal < 100) {
                        finalData[1] = data.fpVal;
                      }
                    }
                  });
                }
              }
              formattedEntry.blood_pressure = finalData;
              break;
            case "derived:com.google.heart_rate.summary:com.google.android.gms:aggregated":
              // console.log("Heart rate:",mydataset.point[0]?.value)
              let heartData = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  const heartArray = mydataset.point[0]?.value;
                  heartArray.map((data) => {
                    if (data.fpVal) {
                      heartData = data.fpVal;
                    }
                  });
                }
              }
              formattedEntry.heart_rate = heartData;
              break;
            case "derived:com.google.weight.summary:com.google.android.gms:aggregated":
              // console.log("Weight:",value[0]?.fpVal)
              formattedEntry.weight = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.height.summary:com.google.android.gms:aggregated":
              // console.log("Height:",value[0]?.fpVal)
              formattedEntry.height_in_cms = value[0]?.fpVal * 100 || 0;
              break;
            case "derived:com.google.sleep.segment:com.google.android.gms:merged":
              // console.log("Sleep:",mydataset.point[0]?.value)
              formattedEntry.sleep_hours = mydataset.point[0]?.value || 0;
              break;
            case "derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated":
              // console.log("Body Fat:",mydataset.point[0]?.value)
              let bodyFat = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  bodyFat = mydataset.point[0].value[0].fpVal;
                }
              }
              formattedEntry.body_fat_in_percent = bodyFat;
              break;
            case "derived:com.google.menstruation:com.google.android.gms:aggregated":
              // console.log("Menstrual:",mydataset.point[0]?.value)
              formattedEntry.menstrual_cycle_start =
                mydataset.point[0]?.value[0]?.intVal || 0;
              break;
            default:
              break;
          }
        }
        // else {
        //     console.log(`No data available`);
        //   }
      });
      formattedData.push(formattedEntry);

      // console.log("-----------------------")
      // console.log(datasetMap[0].point[0]?.value)
    });

    res.status(200).json({ data: formattedData, isRedirectedToHome: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default cors(handler);
