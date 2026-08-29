import Image from "next/image";
import type { FootballClub } from "@/types";

/**
 * A club's official crest.
 *
 * `unoptimized` because these are SVGs: they are already resolution
 * independent, so running them through the image optimizer would cost a
 * round trip and give nothing back. Explicit dimensions still reserve the
 * space, so nothing shifts while they load.
 *
 * Decorative — the club name sits next to it as real text, so the crest is
 * hidden from assistive technology rather than given a redundant alt.
 */
export function ClubCrest({ club, size = 32 }: { club: FootballClub; size?: number }) {
  return (
    <Image
      src={club.crest}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      unoptimized
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}
