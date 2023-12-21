import request from "supertest";
import { app } from "../../app";

const testEmail = "testemail@email.com";

it("has a route handler listening to /api/users/currentuser for get requests", async () => {
  const response = await request(app).get("/api/users/currentuser").send();
  expect(response.status).not.toEqual(404);
});

it("responds with details about the current user after signup", async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.user.email).toEqual(testEmail);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.user).toEqual(null);
});
