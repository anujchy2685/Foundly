
import { randomInt, createHash } from "node:crypto";

export const generateOtp = () => {
  return randomInt(100000, 1000000).toString();
};

export const hashOtp = (otp) => {
  return createHash("sha256")
    .update(otp)
    .digest("hex");
};