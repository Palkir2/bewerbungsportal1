import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated, verifyAdmin, sessionMiddleware } from "./auth";
import { compareSync, hashSync } from "bcrypt";
import { insertUserSchema, insertApplicationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply session middleware
  app.use(sessionMiddleware);
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isPasswordValid = compareSync(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      
      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "An error occurred during login" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });
  
  app.get("/api/auth/user", (req, res) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json(null);
    }
    return res.status(200).json(req.session.user);
  });
  
  // User routes
  app.get("/api/users", isAuthenticated, verifyAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "An error occurred while fetching users" });
    }
  });
  
  app.post("/api/users", isAuthenticated, verifyAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = hashSync(userData.password, 10);
      
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "An error occurred while creating user" });
    }
  });
  
  app.put("/api/users/:id", isAuthenticated, verifyAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Validate user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user
      const userData = req.body;
      
      // Hash password if provided
      if (userData.password) {
        userData.password = hashSync(userData.password, 10);
      } else {
        // Remove password field if not provided to keep the existing one
        delete userData.password;
      }
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "An error occurred while updating user" });
    }
  });
  
  app.delete("/api/users/:id", isAuthenticated, verifyAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Validate user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Prevent deleting the admin user
      if (existingUser.username === "Admin") {
        return res.status(403).json({ message: "Cannot delete admin user" });
      }
      
      await storage.deleteUser(userId);
      
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "An error occurred while deleting user" });
    }
  });
  
  // Application routes
  app.get("/api/applications", isAuthenticated, verifyAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      return res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      return res.status(500).json({ message: "An error occurred while fetching applications" });
    }
  });
  
  app.post("/api/applications", isAuthenticated, async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      
      const newApplication = await storage.createApplication({
        ...applicationData,
        userId: req.session.user!.id,
        username: req.session.user!.username,
        createdAt: new Date().toISOString(),
        status: "pending",
      });
      
      return res.status(201).json(newApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating application:", error);
      return res.status(500).json({ message: "An error occurred while creating application" });
    }
  });

  // Initialize admin user if it doesn't exist
  try {
    const adminUser = await storage.getUserByUsername("Admin");
    if (!adminUser) {
      const hashedPassword = hashSync("123456", 10);
      await storage.createUser({
        username: "Admin",
        password: hashedPassword,
        email: "admin@example.com",
        role: "admin",
        status: "active",
      });
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }

  const httpServer = createServer(app);
  
  return httpServer;
}
