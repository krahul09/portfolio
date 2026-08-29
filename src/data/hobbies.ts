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
