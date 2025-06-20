/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/document";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import OpenAI from "openai";

initializeApp();

// Define your function
export const generateSummary = onDocumentUpdated("calls/{sessionId}", async (event) => {
  logger.info("Function triggered for sessionId:", event.params.sessionId);

  const beforeData = event.data?.before.data();
  const afterData = event.data?.after.data();

  // Check if the call has just ended
  if (beforeData?.status !== "ended" && afterData?.status === "ended") {
    logger.info("Call ended. Generating summary for:", event.params.sessionId);

    const db = getFirestore();
    const sessionId = event.params.sessionId;

    // 1. Fetch all messages for the session
    const messagesSnapshot = await db.collection(`sessions/${sessionId}/messages`).orderBy("createdAt").get();
    if (messagesSnapshot.empty) {
      logger.info("No messages found, skipping summary.");
      return;
    }
    const messages = messagesSnapshot.docs.map((doc) => doc.data());
    const chatContent = messages.map((m) => `${m.sender}: ${m.text}`).join("\n");
    const prompt = `Summarize the following chat conversation in a few concise sentences:\n\n${chatContent}`;

    try {
      // 2. Call OpenAI API
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        logger.error("OpenAI API key is not set.");
        throw new Error("OpenAI API key not configured.");
      }
      const openai = new OpenAI({apiKey});
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        max_tokens: 150,
      });

      const summary = completion.choices[0]?.message?.content || "No summary could be generated.";
      logger.info("Summary generated successfully:", summary);

      // 3. Save the summary back to the call document
      await db.doc(`calls/${sessionId}`).update({summary});
      logger.info("Summary saved to Firestore.");
    } catch (error) {
      logger.error("Error generating or saving summary:", error);
    }
  }
});
