import { db } from "./db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByClerkId(clerkId) {
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return user;
  }

  async createUser(insertUser) {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
