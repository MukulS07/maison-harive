"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { StageIntro } from "./StageIntro";
import { VideoTextHero } from "./VideoTextHero";

const SEEN_KEY = "km-intro-seen";

function readSeen() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* Private mode or blocked storage: the intro simply plays again next time. */
  }
}

type HomeExperienceProps = Omit<Parameters<typeof VideoTextHero>[0], "play"> & { header: ReactNode };

/**
 * Page 1: the Stage intro plays once per session in front of Home, then its gold flash
 * dissolves into the hero, whose own entrance starts as the flash clears.
 */
export function HomeExperience(props: HomeExperienceProps) {
  // The server always renders the intro, so first-time visitors never glimpse Home underneath.
  const [intro, setIntro] = useState<"playing" | "revealing" | "done">("playing");

  // Before the first paint: if the intro was already seen this session, go straight to Home.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable on the client
    if (readSeen()) setIntro("done");
  }, []);

  return (
    <>
      <div inert={intro === "playing"}>
        <VideoTextHero {...props} play={intro !== "playing"} />
      </div>
      {intro !== "done" && (
        <StageIntro
          onReveal={() => {
            markSeen();
            setIntro("revealing");
          }}
          onDone={() => setIntro("done")}
        />
      )}
    </>
  );
}
