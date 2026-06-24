import { Hero } from "@/components/Hero";
import { TextReveal } from "@/components/TextReveal";
import { MeetProduct } from "@/components/MeetProduct";
import { Capabilities } from "@/components/Capabilities";
import { Comparison } from "@/components/Comparison";
import { UseCases } from "@/components/UseCases";
import { Integration } from "@/components/Integration";
import { News } from "@/components/News";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <TextReveal />
      </Reveal>
      <Reveal>
        <MeetProduct />
      </Reveal>
      <Reveal>
        <Capabilities />
      </Reveal>
      <Reveal>
        <Comparison />
      </Reveal>
      <Reveal>
        <UseCases />
      </Reveal>
      <Reveal>
        <Integration />
      </Reveal>
      <Reveal>
        <News />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}
