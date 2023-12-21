import request from "supertest";
import { app } from "../../../app";
import { User } from "../../../models";

const testEmail = "testemail@gmail.com";

it("has a route handler listening to /api/oauth/google for post requests", async () => {
  const response = await request(app)
    .post("/api/oauth/google")
    .send({
      grant: {
        access_token: testEmail,
      },
    });
  expect(response.status).not.toEqual(404);
});

it("returns a 201 on successful signup", async () => {
  await request(app)
    .post("/api/oauth/google")
    .send({
      grant: {
        access_token: testEmail,
      },
    })
    .expect(201);
});

it("adds user with google email", async () => {
  await request(app)
    .post("/api/oauth/google")
    .send({
      grant: {
        access_token: testEmail,
      },
    })
    .expect(201);

  const users = await User.find({});
  expect(users.length).toEqual(1);
  expect(users[0].email).toEqual(testEmail);
});

it("returns added user", async () => {
  const response = await request(app)
    .post("/api/oauth/google")
    .send({
      grant: {
        access_token: testEmail,
      },
    })
    .expect(201);

  const users = await User.find({});
  expect(response.body.email).toEqual(testEmail);
  expect(response.body.id).toEqual(users[0].id);
});
