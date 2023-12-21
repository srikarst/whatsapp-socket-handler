import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { server } from "../mocks/server";
import { app } from "../app";

const testEmail = "testemail@email.com";
const testPassword = "test-password";
const testUsername = "test-user-name";

const signupBody = {
  email: testEmail,
  password: testPassword,
  username: testUsername,
};

declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  server.listen({
    onUnhandledRequest: "bypass",
  });
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(() => server.resetHandlers());

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  server.close();
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(signupBody)
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
