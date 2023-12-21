import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

var asyncScript = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await asyncScript(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }
  static async compare(storedPassword: string, supliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await asyncScript(supliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") == hashedPassword;
  }
}
