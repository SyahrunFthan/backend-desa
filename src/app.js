import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import i18n from "i18n";
import path from "path";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";

import db from "./configs/Database.js";
import RoleRouter from "./routers/RoleRouter.js";
import UserRouter from "./routers/UserRouter.js";
import AuthRouter from "./routers/AuthRouter.js";
import FamilyCardRouter from "./routers/FamilyCardRouter.js";
import ResidentRouter from "./routers/ResidentRouter.js";
import EmployeeRouter from "./routers/EmployeeRouter.js";
import IncomingLetterRouter from "./routers/IncomingLetterRouter.js";
import OutgoingLetterRouter from "./routers/OutgoingLetterRouter.js";
import PeriodRouter from "./routers/PeriodRouter.js";
import IncomeRouter from "./routers/IncomeRouter.js";
// import createModel from "./models/Income.js";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await db.authenticate();
  // await createModel.sync({ alter: true });
} catch (error) {
  console.log(error);
}
i18n.configure({
  locales: ["en", "id"],
  defaultLocale: "id",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
});

app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());

app.use("/public", express.static("public"));

app.use((req, res, next) => {
  const lang = req.headers["accept-language"] || "id";
  i18n.setLocale(req, lang);
  next();
});
app.use(i18n.init);

app.use("/role", RoleRouter);
app.use("/user", UserRouter);
app.use("/auth", AuthRouter);
app.use("/family-card", FamilyCardRouter);
app.use("/resident", ResidentRouter);
app.use("/employee", EmployeeRouter);
app.use("/incoming-letter", IncomingLetterRouter);
app.use("/outgoing-letter", OutgoingLetterRouter);
app.use("/period", PeriodRouter);
app.use("/income", IncomeRouter);

const port = 5001;
app.listen(port, () => console.log(`Server run at port ${port}`));
