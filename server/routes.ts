import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, createUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid credentials format" });
      }

      const { email, password } = result.data;
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      // Return user without password
      const { password: _, ...safeUser } = user;
      return res.json({ user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    // In a real app, you'd get the user from the session
    // For now, we'll return null if not logged in
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  });

  // User management routes (Super Admin only)
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const result = createUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid user data",
          errors: result.error.flatten().fieldErrors
        });
      }

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(result.data);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "User deleted" });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
