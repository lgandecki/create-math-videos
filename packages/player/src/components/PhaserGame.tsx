import { useEffect, useRef, useState } from "react";

import { launchPirates } from "@/game/main";
import { launchDino } from "@/game/main";
import { slideRuleApi } from "./bridges/SlideRuleBridge";

interface PhaserGameProps {
  backgroundOnly?: boolean;
  dino?: boolean;
  pirates?: boolean;
}

let currentQuestion = 0;
const questions = [
  { expectedA: 2, expectedB: 8 },
  { expectedA: 6, expectedB: 7 },
];

const returnMessagesForQuestion = (question: number) => {
  const { expectedA, expectedB } = questions[question];
  console.log("returnMessagesForQuestion", { question, expectedA, expectedB });
  switch (question) {
    case 0:
      return [`Nice shot!`, `Now ${expectedA} * ${expectedB}, lets hit those scallywags again!`];
    case 1:
      return [`Last one!`, `what about ${expectedA} * ${expectedB}?`];
    default:
      return [`Nice shot!`, `Now ${expectedA} * ${expectedB}, lets hit those scallywags again!`];
  }
};

export const PhaserGame: React.FC<PhaserGameProps> = ({ backgroundOnly, dino, pirates }) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  const [alignmentSet, setAlignmentSet] = useState<number | null>(null);
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [clickedB, setClickedB] = useState<number | null>(null);
  console.log("PhaserGame", { backgroundOnly, dino, pirates });
  useEffect(() => {
    if (phaserRef.current) {
      let game = null;
      if (pirates) {
        game = launchPirates(phaserRef.current.id);
      }
      if (dino) {
        game = launchDino(phaserRef.current.id, backgroundOnly);
      }
      return () => {
        game.destroy(true);
      };
    }
  }, [backgroundOnly]);

  useEffect(() => {
    if (phaserRef.current) {
      slideRuleApi.onRsAlignmentSet(({ value }) => {
        console.log("[PhaserGame] setting alignmentSet", { value });
        setAlignmentSet(value);
      });

      const off = slideRuleApi.onCmdTrackMultiplication(({ a, b }) => {
        console.log("[PhaserGame] TrackMultiplication", { a, b });
        setA(a as number);
        setB(b as number);
      });

      return () => {
        off();
      };
    }
  }, []);

  console.log("AlignmentSet outsideUseEffect", { alignmentSet, a, b });
  useEffect(() => {
    if (alignmentSet && a && b && pirates) {
      window.bus.emit("aimControl", 1 / (a / alignmentSet));
      const offBValueClicked = slideRuleApi.onCmdBValueClicked(({ value }) => {
        console.log("[PhaserGame] BValueClicked", { value });
        const clickedBHigh = value;
        const clickedBLow = value / 10;
        // alignemnt poprawny klikniecie poprawy - strzelamy
        console.log("[PhaserGame] AlignmentSet value", { alignmentSet, a, b, clickedB });
        const expectedResult = a * b;
        console.log("expectedResult", { expectedResult, clickedBHigh, clickedBLow });
        const isCorrect = expectedResult === clickedBHigh || expectedResult === clickedBLow;
        if (isCorrect && a === alignmentSet) {
          window.bus.emit("fire_player");

          // alignment niepoprawny klikniecie poprawne - strzela ale miss
          // alignment niepoprawny klikniecie niepoprawne - strzelamy w przeciwnika z missem
        } else if (a !== alignmentSet && (isCorrect || !isCorrect)) {
          window.bus.emit("fire_player");
          // alignment poprawny klikniecie niepoprawne - enemy w nas  + reset alignmentu
        } else if (a === alignmentSet && !isCorrect) {
          window.bus.emit("fire_enemy", false);
          slideRuleApi.emitCmdResetSlideRule(null);
        }
      });

      return () => {
        offBValueClicked();
      };
    }
  }, [alignmentSet, a, b]);

  useEffect(() => {
    if (pirates) {
      window.bus.on("hit_enemy", () => {
        console.log("hit_enemy in phaser game");
        slideRuleApi.emitCmdHideSlideRule(null);
        const { expectedA, expectedB } = questions[currentQuestion];
        window.bus.emit("showDialog_capitan", {
          messages: returnMessagesForQuestion(currentQuestion),
          btn1Label: "continue",
          onComplete: () => {
            console.log("captainDialog onComplete");
            slideRuleApi.emitCmdTrackMultiplication({ a: expectedA, b: expectedB });
            const existingEl = document.getElementById("multiplication-hint");
            if (existingEl) {
              existingEl.innerText = `${expectedA} × ${expectedB}`;
            }
            slideRuleApi.emitCmdShowSlideRule(null);
            currentQuestion = (currentQuestion + 1) % questions.length;
          },
          onDialogProgress: (progress) => {
            console.log("captainDialog onDialogProgress", progress);
          },
        });
      });
      window.bus.on("hit_player", () => {
        console.log("hit_player");
      });
    }
  }, []);

  useEffect(() => {
    if (pirates) {
      if (a && b) {
        const interval = setInterval(() => {
          // INSERT_YOUR_CODE
          const isMissed = Math.random() > 1 / 6;
          window.bus.emit("fire_enemy", isMissed);
        }, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [a, b]);

  return (
    <div
      id="game-container"
      ref={phaserRef}
      style={{
        width: "100vw",
        height: "100vh",
        minWidth: "100%",
        minHeight: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    />
  );
};
