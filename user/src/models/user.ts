import mongoose from "mongoose";
import { Password } from "../services/Password";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface alamatKirimAttrs {
  alamat: string;
  kota: string;
  kodePos: string;
}

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
  isAdmin: boolean;
  nama: string;
  foto?: string;
  alamatKirim?: alamatKirimAttrs;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  isAdmin: boolean;
  nama: string;
  foto?: string;
  alamatKirim?: alamatKirimAttrs;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    nama: {
      type: String,
      required: true,
    },
    foto: {
      type: String,
    },
    alamatKirim: {
      alamat: { type: String },
      kota: { type: String },
      kodePos: { type: String },
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
    timestamps: true,
  }
);

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

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
