import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import contactRoute from "./routes/contact.route.js";
import path from "path"; // For deploying

dotenv.config({});

const app = express();

const _dirname = path.resolve();

// middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// cors use
const corsOptions = {
  origin:
    process.env.CLIENT_URL ||
    "http://localhost:5173" ||
    "https://jobspot-om79.onrender.com/login",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/contact", contactRoute);

// serve frontend file
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});

// centralized error handler
app.use((err, req, res, next) => {
  const isMulter = err?.name === "MulterError";
  const status = isMulter ? 400 : 500;
  const message = isMulter
    ? err.message || "Upload error"
    : err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});
