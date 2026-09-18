import { Header } from "@/components/header";
import { Intro } from "@/components/intro";
import { Showcase } from "@/components/showcase";
import { Skills } from "@/components/skills";
import { Activity } from "@/components/activity";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-10 px-6 py-24">
      <Header />
      <Intro />
      <div className="flex flex-col gap-6">
        <Showcase />
        <Skills />
      </div>
      <Activity />
    </main>
  );
}
