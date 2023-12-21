import request from "supertest";
import { app } from "../../app";
import { User } from "../../models";
import { Password } from "../../services";

const testEmail = "testemail@email.com";
const testPassword = "test-password";
const testUsername = "test-user-name";

const signupBody = {
  email: testEmail,
  password: testPassword,
  username: testUsername,
};

it("has a route handler listening to /api/users/signup for post requests", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(signupBody);
  expect(response.status).not.toEqual(404);
});

it("returns a 201 on successful signup", async () => {
  return request(app).post("/api/users/signup").send(signupBody).expect(201);
});

it("adds user with hashed password", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(signupBody);
  expect(response.status).toEqual(201);

  const users = await User.find({});
  expect(users.length).toEqual(1);
  expect(users[0].email).toEqual(testEmail);
  expect(users[0].username).toEqual(testUsername);
  const passwordsMatch = await Password.compare(
    users[0].password || "",
    testPassword
  );
  expect(passwordsMatch).toEqual(true);
});

it("returns added user", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(signupBody);
  expect(response.status).toEqual(201);

  const users = await User.find({});
  expect(response.body.email).toEqual(testEmail);
  expect(response.body.username).toEqual(testUsername);
  expect(response.body.id).toEqual(users[0].id);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(signupBody)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns Bad Request error if email is in use", async () => {
  await request(app).post("/api/users/signup").send(signupBody);
  const response = await request(app)
    .post("/api/users/signup")
    .send(signupBody)
    .expect(400);
  expect(response.body[0].message).toEqual("Email in use");
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      ...signupBody,
      email: "alskdflaskjfd",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      ...signupBody,
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: testEmail,
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: testPassword,
    })
    .expect(400);
});

it("adds user with email as username when username is not present", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: testEmail,
      password: testPassword,
    })
    .expect(201);

  const users = await User.find({});
  expect(response.body.username).toEqual(testEmail);
});
