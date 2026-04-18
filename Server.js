import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
import JobRoute from "./routes/JobRoute.js";
import authRoute from "./routes/authRoute.js"

const app = express();
const Port = process.env.Port || 3000;

// Middleware 
app.use(cors({
  origin: "http://localhost:5173",  // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/jobs", JobRoute);
app.use("/api/auth", authRoute)

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
