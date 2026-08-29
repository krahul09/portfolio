import type { ReactNode } from "react";
import { CodeLine, Token } from "./syntax";

interface CodeFrameProps {
  children: ReactNode;
  /** Component name for the `const X = () => {}` wrapper. */
  name?: string;
  /** `json` frames content in braces instead of a component declaration. */
  variant?: "component" | "json";
}

/**
 * Wraps a pane's real, rendered content in code-shaped chrome.
 *
 * The point is that the *content* is genuine semantic HTML — headings, lists,
 * links — with the surrounding braces as decoration. That keeps the pane
 * readable to screen readers and crawlers while still looking like an editor.
 */
export function CodeFrame({ children, name, variant = "component" }: CodeFrameProps) {
  if (variant === "json") {
    return (
      <div className="font-mono">
        <CodeLine n={1}>
          <Token kind="punctuation">{"{"}</Token>
        </CodeLine>

        <div className="py-2 pl-4 sm:pl-12">{children}</div>

        <CodeLine n={2}>
          <Token kind="punctuation">{"}"}</Token>
        </CodeLine>
      </div>
    );
  }

  return (
    <div className="font-mono">
      <CodeLine n={1}>
        <Token kind="keyword">const</Token> <Token kind="fn">{name}</Token>{" "}
        <Token kind="punctuation">{"= () => {"}</Token>
      </CodeLine>

      <CodeLine n={2} indent={1}>
        <Token kind="keyword">return</Token> <Token kind="punctuation">(</Token>
      </CodeLine>

      <div className="py-4 pl-4 sm:pl-12">{children}</div>

      <CodeLine n={3} indent={1}>
        <Token kind="punctuation">{");"}</Token>
      </CodeLine>

      <CodeLine n={4}>
        <Token kind="punctuation">{"};"}</Token>
      </CodeLine>
    </div>
  );
}
