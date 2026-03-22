import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../../infrastructure/auth/jwt";

export function authMiddleware(
  roles: ("admin" | "user")[] = []
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token não informado" });
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = verifyToken(token);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      (req as any).user = decoded;

      return next();
    } catch {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}