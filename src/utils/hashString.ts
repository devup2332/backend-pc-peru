import * as bcrypt from "bcryptjs";

export const hashPassword = async (pass: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(pass, saltOrRounds);
};

export const comparePassword = async (pass: string, hash: string) => {
  return await bcrypt.compare(pass, hash);
};
