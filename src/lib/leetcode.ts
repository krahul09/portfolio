import "server-only";

import type { LeetcodeStats } from "@/types";
import { leetcode } from "@/data/hobbies";

/**
 * LeetCode stats, fetched on the server.
 *
 * It has to be the server: leetcode.com/graphql sends no
 * `Access-Control-Allow-Origin`, so a browser request from this site is
 * blocked outright. (Chess.com does send it, which is why that one can poll
 * from the client — the two differ because the APIs differ, not by accident.)
 *
 * `server-only` makes importing this from a Client Component a build error,
 * so the query can never be bundled into the browser.
 */

const endpoint = "https://leetcode.com/graphql";

/** Cache for an hour — a few submissions a week does not need fresher. */
const revalidateSeconds = 3600;

/** Give up rather than hold the page open if LeetCode is slow. */
const timeoutMs = 4000;

const statsQuery = `
  query userProblemsSolved($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
    }
  }
`;

interface DifficultyCount {
  difficulty: string;
  count: number;
}

interface LeetcodeResponse {
  data?: {
    allQuestionsCount?: DifficultyCount[];
    matchedUser?: {
      profile?: { ranking?: number | null };
      submitStatsGlobal?: { acSubmissionNum?: DifficultyCount[] };
    } | null;
  };
}

/** Pull one difficulty out of LeetCode's `[{difficulty, count}]` shape. */
function countFor(rows: DifficultyCount[] | undefined, difficulty: string): number {
  return rows?.find((row) => row.difficulty === difficulty)?.count ?? 0;
}

function isLeetcodeResponse(value: unknown): value is LeetcodeResponse {
  return typeof value === "object" && value !== null;
}

export async function fetchLeetcodeStats(): Promise<LeetcodeStats> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // LeetCode rejects requests without a plausible referer.
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: statsQuery,
        variables: { username: leetcode.username },
      }),
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) throw new Error(`leetcode responded ${response.status}`);

    const payload: unknown = await response.json();
    if (!isLeetcodeResponse(payload)) throw new Error("unexpected payload");

    const user = payload.data?.matchedUser;
    if (!user) throw new Error(`no such user: ${leetcode.username}`);

    const solved = user.submitStatsGlobal?.acSubmissionNum;
    const totals = payload.data?.allQuestionsCount;

    return {
      solved: countFor(solved, "All"),
      total: countFor(totals, "All"),
      easy: { solved: countFor(solved, "Easy"), total: countFor(totals, "Easy") },
      medium: {
        solved: countFor(solved, "Medium"),
        total: countFor(totals, "Medium"),
      },
      hard: { solved: countFor(solved, "Hard"), total: countFor(totals, "Hard") },
      ranking: user.profile?.ranking ?? null,
      isLive: true,
    };
  } catch (error) {
    // Never let a third-party outage break the page — show the last snapshot.
    console.warn("LeetCode stats unavailable, using fallback:", error);
    return leetcode.fallback;
  }
}
