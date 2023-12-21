import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  Token,
  validateRequest,
} from "@4kprojects/project-util-server";
import { User } from "../models/user";
import { Password } from "../services";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("userID").trim().notEmpty(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userID, password } = req.body;

    let user = await User.findOne({ email: userID });
    if (!user) user = await User.findOne({ username: userID });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      user.password || "",
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = Token.tokenizeUser(user as UserPayload);

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
