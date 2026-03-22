import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type Payload = {
  userId: string;
  role: "admin" | "user";
};

export function generateToken(payload: Payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d"
  });
}

export function verifyToken(token: string): Payload {
  try {
    return jwt.verify(token, JWT_SECRET) as Payload;
  } catch {
    throw new Error("Token inválido");
  }
}