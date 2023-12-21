import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://srikar:Srikar10$@whatsapp-user-dev.cluster-cuxpofqxekh3.us-east-1.docdb.amazonaws.com:27017/?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
    );
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3001, () => {
    console.log("Listening on port 3001!!!!!!!!");
  });
};

start();
