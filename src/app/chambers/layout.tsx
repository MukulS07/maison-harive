import { ChambersStage } from "@/components/chambers/ChambersStage";

/** Page 2: one stage for /chambers and all three opened chambers, so the panels never unmount. */
export default function ChambersLayout({ children }: LayoutProps<"/chambers">) {
  return (
    <main>
      <ChambersStage />
      {children}
    </main>
  );
}
