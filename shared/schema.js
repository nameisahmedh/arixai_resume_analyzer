import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clerkId: text("clerk_id").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password"),
  analysisCount: integer("analysis_count").default(0).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  premiumSince: timestamp("premium_since"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  clerkId: true,
  username: true,
  password: true,
});

// Analysis result type for the frontend
export const AnalysisResult = {
  overallScore: 0,
  strengths: [],
  improvements: [],
  keywordMatch: {
    matched: [],
    missing: [],
    score: 0,
  },
  sections: [],
  recommendations: [],
};
