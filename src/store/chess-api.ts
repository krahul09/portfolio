import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** The slice of chess.com's public stats payload that this site consumes. */
interface ChessStatsPayload {
  chess_rapid?: {
    last?: {
      rating?: number;
    };
  };
}

function isChessStatsPayload(value: unknown): value is ChessStatsPayload {
  return typeof value === "object" && value !== null;
}

/**
 * Live rapid rating from chess.com's public, unauthenticated API.
 *
 * RTK Query handles the parts a hand-rolled `useEffect` + `fetch` usually gets
 * wrong: request deduplication, cancellation on unmount, polling that pauses
 * when no component is subscribed, and cached data surviving navigation
 * between panes.
 */
export const chessApi = createApi({
  reducerPath: "chessApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.chess.com/pub/" }),
  // The rating is cosmetic; never block a render waiting on it.
  keepUnusedDataFor: 300,
  endpoints: (build) => ({
    getRapidRating: build.query<number | null, string>({
      query: (username) => `player/${encodeURIComponent(username)}/stats`,
      transformResponse: (response: unknown): number | null => {
        if (!isChessStatsPayload(response)) return null;
        const rating = response.chess_rapid?.last?.rating;
        return typeof rating === "number" ? rating : null;
      },
    }),
  }),
});

export const { useGetRapidRatingQuery } = chessApi;
