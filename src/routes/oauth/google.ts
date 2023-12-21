import express, { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Token } from "@4kprojects/project-util-server";
import { User } from "../../models";

const router = express.Router();

router.post("/api/oauth/google", async (req: Request, res: Response) => {
  const { grant } = req.body;
  const response: AxiosResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${grant.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${grant.access_token}`,
        Accept: "application/json",
      },
    }
  );
  const userInfo = response.data;
  const { email } = userInfo as UserAttrs;

  const user = User.build({
    email,
    username: email,
    oauth: true,
  });
  await user.save();

  const userJwt = Token.tokenizeUser(user as UserPayload);

  req.session = {
    jwt: userJwt,
  };

  res.status(201).send(user);
});

export { router as googleOAuthRouter };
