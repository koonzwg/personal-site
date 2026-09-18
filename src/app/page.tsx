import { Header } from "@/components/header";
import { Intro } from "@/components/intro";
import { Showcase } from "@/components/showcase";
import { Skills } from "@/components/skills";
import { Activity } from "@/components/activity";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-10 px-6 pt-10 pb-16 sm:py-24">
      <Header />
      <Intro />
      <div className="flex flex-col gap-6">
        <Showcase />
        <Skills />
      </div>
      <Activity />
      <Experience />
      <Footer />
    </main>
  );
}
