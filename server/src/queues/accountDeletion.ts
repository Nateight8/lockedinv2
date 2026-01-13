// src/queues/accountDeletionQueue.ts
import { Queue, Worker, Job } from "bullmq";
import { db } from "../db";
import { users, refreshTokens } from "../db/schema";
import { eq } from "drizzle-orm";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL must be defined in your environment");
}

const connection = { url: process.env.REDIS_URL };

// Create the queue
export const accountDeletionQueue = new Queue("accountDeletionQueue", {
  connection,
});

// Worker to process permanent deletion
export const accountDeletionWorker = new Worker(
  "accountDeletionQueue",
  async (job: Job) => {
    const { userId } = job.data;

    console.log(
      `[AccountDeletionWorker] Deleting user ${userId} permanently...`
    );

    try {
      await db.transaction(async (tx) => {
        await tx.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
        await tx.delete(users).where(eq(users.id, userId));
      });

      console.log(
        `[AccountDeletionWorker] User ${userId} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `[AccountDeletionWorker] Failed to delete user ${userId}:`,
        error
      );
      throw error; // allow BullMQ to retry
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

// Optional logging
accountDeletionWorker.on("completed", (job) => {
  console.log(`[Queue] Job ${job.id} completed`);
});

accountDeletionWorker.on("failed", (job, err) => {
  console.error(`[Queue] Job ${job?.id} failed:`, err);
});
