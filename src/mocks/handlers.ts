import { rest } from "msw";

export const handlers = [
  rest.get("https://www.googleapis.com/oauth2/v1/userinfo", (req, res, ctx) => {
    const email = req.url.searchParams.get("access_token");
    return res(ctx.json({ email }));
  }),
];
