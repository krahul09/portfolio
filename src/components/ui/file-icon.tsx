import { Braces, FileCode2, FileText, FileType2 } from "lucide-react";
import type { FileKind } from "@/types";

interface FileIconProps {
  kind: FileKind;
  size?: number;
}

/**
 * Editor-style file glyphs, colour-coded by extension the way a real file
 * tree is. Keyed by `FileKind`, so adding an extension is a type error until
 * an icon is provided for it.
 */
const iconByKind = {
  tsx: { Icon: FileCode2, className: "text-blue" },
  ts: { Icon: FileCode2, className: "text-blue" },
  json: { Icon: Braces, className: "text-amber" },
  md: { Icon: FileText, className: "text-ink-muted" },
  pdf: { Icon: FileType2, className: "text-pink" },
} as const satisfies Record<FileKind, { Icon: typeof FileCode2; className: string }>;

export function FileIcon({ kind, size = 14 }: FileIconProps) {
  const { Icon, className } = iconByKind[kind];
  return <Icon size={size} strokeWidth={2} className={className} aria-hidden="true" />;
}
