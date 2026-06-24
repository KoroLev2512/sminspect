import { SiteShell } from "@/components/SiteShell";
import { Hero } from "@/components/Hero";
import { TextReveal } from "@/components/TextReveal";
import { MeetProduct } from "@/components/MeetProduct";
import { Capabilities } from "@/components/Capabilities";
import { Comparison } from "@/components/Comparison";
import { UseCases } from "@/components/UseCases";
import { Integration } from "@/components/Integration";
import { News } from "@/components/News";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <TextReveal />
      <MeetProduct />
      <Capabilities />
      <Comparison />
      <UseCases />
      <Integration />
      <News />
      <FinalCTA />
    </SiteShell>
  );
}
