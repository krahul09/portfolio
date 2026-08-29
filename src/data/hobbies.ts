import type { FootballClub, Interest } from "@/types";

export const chess = {
  username: "zaddiChill",
  apiUsername: "zaddichill",
  url: "https://www.chess.com/member/zaddichill",
  /** Rendered on the server and while the live request is in flight. */
  fallbackRapid: 974,
  streak: 16,
  league: "Bronze League",
  leagueRank: 8,
} as const;

export const footballClubs: readonly FootballClub[] = [
  {
    code: "RM",
    name: "Real Madrid",
    founded: 1902,
    colors: {
      top: "#1c2b4a",
      bottom: "#0a0e18",
      trim: "#f5d47a",
      text: "#f5d47a",
    },
  },
  {
    code: "MU",
    name: "Manchester United",
    founded: 1878,
    colors: {
      top: "#da291c",
      bottom: "#560d08",
      trim: "#f5d47a",
      text: "#ffffff",
    },
  },
];

export const interests: readonly Interest[] = [
  { label: "Anime & Manga", icon: "sparkles" },
  { label: "Comics", icon: "book" },
];
