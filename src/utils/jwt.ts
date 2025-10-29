import jwt from "jsonwebtoken";

export const signJWT = (payload: any, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn } as any);
};

export const verifyJWT = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);