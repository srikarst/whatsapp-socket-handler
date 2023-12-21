import mongoose from "mongoose";

import { Password } from "../services";

interface BaseUserDoc extends mongoose.Document {
  email: string;
  username: string;
}

interface OAuthUserDoc extends BaseUserDoc {
  password?: string;
  oauth: true;
}

interface SignupUserDoc extends BaseUserDoc {
  password: string;
  oauth?: false;
}

type UserDoc = OAuthUserDoc | SignupUserDoc;

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [
        function (this: UserDoc) {
          return this.oauth ? false : true;
        },
      ],
    },
    oauth: {
      type: Boolean,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
