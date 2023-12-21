import request from "supertest";
import { app } from "../../app";

const testEmail = "testemail@email.com";
const testPassword = "test-password";
const testUsername = "test-user-name";

it("fails when a userID is not supplied", async () => {
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      password: testPassword,
    })
    .expect(400);

  expect(response.body[0].message).toEqual("Invalid value");
  expect(response.body[0].field).toEqual("userID");
});

it("fails when a userID that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      userID: testEmail,
      password: testPassword,
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: testEmail,
      password: testPassword,
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      userID: testEmail,
      password: "aslkdfjalskdfj",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials using email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: testEmail,
      password: testPassword,
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      userID: testEmail,
      password: testPassword,
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("responds with a cookie when given valid credentials using username", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: testEmail,
      username: testUsername,
      password: testPassword,
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      userID: testUsername,
      password: testPassword,
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
