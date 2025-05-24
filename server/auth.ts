import { Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";

// Create memory store for session
const MemoryStoreSession = MemoryStore(session);

// Session middleware
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "application-portal-secret",
  resave: false,
  saveUninitialized: true,
  store: new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false, // Set to false to allow HTTP during development
    sameSite: 'lax'
  },
  name: "bewerbungsportal.sid"
});

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next();
};

// Middleware to check if user is an admin
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Extend the Express Request type
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
    };
  }
}
