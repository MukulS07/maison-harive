import { existsSync } from "node:fs";
import { join } from "node:path";
import { HomeHeader } from "@/components/HomeHeader";
import { HomeExperience } from "@/components/HomeExperience";
import { ButtonLink } from "@/components/ui";
import { site } from "@/content/site";

/** Use the film only once it has actually been dropped into /public. */
function heroVideo() {
  return existsSync(join(process.cwd(), "public", site.heroVideo)) ? site.heroVideo : null;
}

export default function Home() {
  return (
    <main>
      <HomeExperience
        lead="Enter the"
        word={site.heroWord}
        label={`Enter ${site.brand}`}
        tagline={site.tagline}
        videoSrc={heroVideo()}
        header={<HomeHeader />}
        action={
          <ButtonLink href="/chambers" className="km-pulse">
            ENTER
          </ButtonLink>
        }
      />
    </main>
  );
}
