import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Project Auth Server");
});

export { router as indexRouter };

export * from "./current-user";
export * from "./signup";
export * from "./signin";
export * from "./signout";
export * from "./oauth/google";
