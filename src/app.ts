import express from "express";
import cors from "cors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import {
  indexRouter,
  currentUser,
  signinRouter,
  signupRouter,
  signoutRouter,
  googleOAuthRouter,
} from "./routes";
import { errorHandler, NotFoundError } from "@4kprojects/project-util-server";

var app = express();

app.use(cors());
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(indexRouter);
app.use(currentUser);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(googleOAuthRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
