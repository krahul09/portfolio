import Link from "next/link";
import { CodeLine, Token } from "@/components/ui/syntax";

export default function NotFound() {
  return (
    <div className="max-w-2xl font-mono">
      <CodeLine n={1}>
        <Token kind="comment">{"// 404 — file not found"}</Token>
      </CodeLine>
      <CodeLine n={2}>
        <Token kind="keyword">throw new</Token> <Token kind="fn">Error</Token>
        <Token kind="punctuation">(</Token>
        <Token kind="string">&quot;no such file in this workspace&quot;</Token>
        <Token kind="punctuation">);</Token>
      </CodeLine>

      <p className="text-ink-muted mt-6 text-sm">
        That path isn&apos;t in the file tree. Try one from the explorer.
      </p>

      <Link
        href="/"
        className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 mt-4 inline-flex rounded-md border px-3.5 py-2 text-[13px] font-medium transition-colors"
      >
        open about.tsx
      </Link>
    </div>
  );
}
