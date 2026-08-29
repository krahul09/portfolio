import { PongGame } from "@/components/game/pong-game";
import { HobbiesCard } from "@/components/hobbies/hobbies-card";
import { CodeLine, Token } from "@/components/ui/syntax";

/**
 * Shown when every tab is closed, and reachable directly at `/playground`.
 */
export function PlaygroundPane() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <CodeLine>
          <Token kind="comment">{"// no files open"}</Token>
        </CodeLine>
        <CodeLine>
          <Token kind="comment">
            {"// pick a file from the explorer — or rally below while you decide"}
          </Token>
        </CodeLine>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <PongGame />
        <HobbiesCard />
      </div>
    </div>
  );
}
