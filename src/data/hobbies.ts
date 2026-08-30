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

export const leetcode = {
  username: "raulk09x",
  url: "https://leetcode.com/u/raulk09x/",
  /**
   * Rendered when the live request fails, so the card is never empty.
   * Snapshot taken 2026-08-30.
   */
  fallback: {
    solved: 25,
    total: 4041,
    easy: { solved: 17, total: 962 },
    medium: { solved: 7, total: 2109 },
    hard: { solved: 1, total: 970 },
    ranking: 3_979_055,
    isLive: false,
  },
} as const;

export const footballClubs: readonly FootballClub[] = [
  {
    id: "real-madrid",
    name: "Real Madrid",
    founded: 1902,
    crest: "/crests/real-madrid.svg",
    accent: "#febe10",
  },
  {
    id: "manchester-united",
    name: "Manchester United",
    founded: 1878,
    crest: "/crests/manchester-united.svg",
    accent: "#da291c",
  },
];

export const interests: readonly Interest[] = [
  { label: "Anime & Manga", icon: "sparkles" },
  { label: "Comics", icon: "book" },
];
