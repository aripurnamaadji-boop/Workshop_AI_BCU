import type { VercelRequest, VercelResponse } from "@vercel/node";
import status from "./_lib/handlers/status.js";
import authLogin from "./_lib/handlers/authLogin.js";
import authLogout from "./_lib/handlers/authLogout.js";
import authMe from "./_lib/handlers/authMe.js";
import authSeed from "./_lib/handlers/authSeed.js";
import authUsers from "./_lib/handlers/authUsers.js";
import bcuSeed from "./_lib/handlers/bcuSeed.js";
import bcuPrograms from "./_lib/handlers/bcuPrograms.js";
import bcuUpdate from "./_lib/handlers/bcuUpdate.js";
import aiSummary from "./_lib/handlers/aiSummary.js";
import aiChat from "./_lib/handlers/aiChat.js";
import aiConversationsIndex from "./_lib/handlers/aiConversationsIndex.js";
import aiConversationsId from "./_lib/handlers/aiConversationsId.js";

// Single catch-all Vercel Function for the whole /api surface. Vercel's Hobby
// plan caps a deployment at 12 Serverless Functions; routing everything
// through one dynamic file keeps the count at 1 no matter how many endpoints
// this app grows to, while every /api/* URL below stays exactly the same.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const parts = ([] as string[]).concat(req.query.path ?? []);
  const [a, b, c] = parts;

  if (a === "status" && !b) return status(req, res);

  if (a === "auth") {
    if (b === "login") return authLogin(req, res);
    if (b === "logout") return authLogout(req, res);
    if (b === "me") return authMe(req, res);
    if (b === "seed") return authSeed(req, res);
    if (b === "users") return authUsers(req, res);
  }

  if (a === "bcu") {
    if (b === "seed") return bcuSeed(req, res);
    if (b === "programs") return bcuPrograms(req, res);
    if (b === "update") return bcuUpdate(req, res);
  }

  if (a === "ai") {
    if (b === "summary") return aiSummary(req, res);
    if (b === "chat") return aiChat(req, res);
    if (b === "conversations") {
      if (c) {
        req.query.id = c;
        return aiConversationsId(req, res);
      }
      return aiConversationsIndex(req, res);
    }
  }

  res.status(404).json({ error: "Not found" });
}
