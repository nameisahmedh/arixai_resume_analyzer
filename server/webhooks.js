import { Webhook } from "svix";
import { db } from "./db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export function registerWebhooks(app) {
  // Clerk webhook endpoint
  app.post('/api/webhooks/clerk', async (req, res) => {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set');
        return res.status(500).json({ error: 'Webhook secret not configured' });
      }

      const headers = req.headers;

      // Convert raw buffer to string for Svix verification
      const payload = Buffer.isBuffer(req.body)
        ? req.body.toString('utf8')
        : JSON.stringify(req.body);

      const wh = new Webhook(WEBHOOK_SECRET);
      let evt;

      try {
        evt = wh.verify(payload, headers);
      } catch (err) {
        console.error('Webhook verification failed:', err);
        return res.status(400).json({ error: 'Webhook verification failed' });
      }

      const { type, data } = evt;

      switch (type) {
        case 'user.created':
          await handleUserCreated(data);
          break;
        case 'user.updated':
          await handleUserUpdated(data);
          break;
        case 'user.deleted':
          await handleUserDeleted(data);
          break;
        default:
          console.log(`Unhandled webhook event: ${type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

async function handleUserCreated(userData) {
  try {
    const { id: clerkId, username, email_addresses } = userData;

    // Use email as username if username is not available
    const userUsername = username || email_addresses?.[0]?.email_address || `user_${clerkId}`;

    await db.insert(users).values({
      clerkId,
      username: userUsername,
    }).onConflictDoNothing();

    console.log(`User created in database: ${clerkId}`);
  } catch (error) {
    console.error('Error creating user in database:', error);
  }
}

async function handleUserUpdated(userData) {
  try {
    const { id: clerkId, username, email_addresses } = userData;

    const userUsername = username || email_addresses?.[0]?.email_address || `user_${clerkId}`;

    await db.update(users)
      .set({ username: userUsername })
      .where(eq(users.clerkId, clerkId));

    console.log(`User updated in database: ${clerkId}`);
  } catch (error) {
    console.error('Error updating user in database:', error);
  }
}

async function handleUserDeleted(userData) {
  try {
    const { id: clerkId } = userData;

    await db.delete(users).where(eq(users.clerkId, clerkId));

    console.log(`User deleted from database: ${clerkId}`);
  } catch (error) {
    console.error('Error deleting user from database:', error);
  }
}
