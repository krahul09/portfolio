import { Download, ExternalLink } from "lucide-react";
import { profile, resumeFileName, resumePath } from "@/data/profile";
import { CodeLine, Token } from "@/components/ui/syntax";
import { getResumeMeta } from "@/lib/resume-meta";

/**
 * Resume viewer.
 *
 * A Server Component: the PDF is an `<iframe>`, so nothing here needs to be
 * interactive. The browser's own PDF viewer handles zoom, print and scroll —
 * shipping a JS renderer (pdf.js is ~350KB) to redraw a single page a native
 * viewer already handles well would be a poor trade.
 *
 * The `<iframe>` is the primary path and the links below are the escape hatch:
 * some mobile browsers refuse to render PDFs inline, so the actions are always
 * visible rather than hidden behind a failed embed.
 */
export function ResumePane() {
  const meta = getResumeMeta();

  return (
    <div className="flex min-h-0 max-w-4xl flex-1 flex-col">
      <CodeLine>
        <Token kind="comment">
          {`// resume.pdf — ${meta.pages} page${meta.pages === 1 ? "" : "s"} · ${meta.sizeKb} KB`}
        </Token>
      </CodeLine>

      <div className="border-line-soft bg-surface-raised mt-4 flex min-h-[20rem] flex-1 flex-col overflow-hidden rounded-lg border">
        {/* Toolbar */}
        <div className="border-line-soft flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0">
            <p className="text-ink truncate text-[13px]">{resumeFileName}</p>
            <p className="text-ink-faint text-[11px]">
              {profile.name} · {profile.headline}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/*
              `download` only forces a save for same-origin URLs — which is
              exactly why the file moved out of Google Drive and into public/.
            */}
            <a
              href={resumePath}
              download={resumeFileName}
              className="border-mint/30 bg-mint/10 text-mint hover:bg-mint/20 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-medium transition-colors"
            >
              <Download size={14} aria-hidden="true" />
              Download
            </a>

            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="border-line-soft text-ink-muted hover:border-mint/40 hover:text-ink inline-flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] transition-colors"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Open
              <span className="sr-only">resume in a new tab</span>
            </a>
          </div>
        </div>

        {/*
          The viewer grows into whatever vertical space is left after the
          toolbar and the note below. `flex-1` plus `min-h-0` rather than a
          `calc()` on viewport units: the chrome around it (title bar, tabs,
          status bar) is not a constant this component can know, and guessing
          it produced a few pixels of overflow — which made the browser scroll
          the pane when the PDF plugin took focus, giving two scrollbars.
        */}
        <iframe
          src={`${resumePath}#view=FitH`}
          title={`${profile.name} — resume`}
          loading="lazy"
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      </div>

      <p className="text-ink-faint mt-3 text-[12px] leading-5">
        Not rendering? Some mobile browsers block inline PDFs — use{" "}
        <a
          href={resumePath}
          download={resumeFileName}
          className="text-mint underline underline-offset-2"
        >
          download
        </a>{" "}
        or{" "}
        <a
          href={resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mint underline underline-offset-2"
        >
          open in a new tab
        </a>
        .
      </p>
    </div>
  );
}
