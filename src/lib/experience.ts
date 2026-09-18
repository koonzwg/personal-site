export type Role = {
  company: string;
  title: string;
  dates: string;
  description: string;
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Shado",
    title: "Founder · AI Product & Design Engineer",
    dates: "Apr 2026 – Present",
    description:
      "Founded, designed, and shipped an AI-guided reflection app for iOS. Own it end-to-end: product strategy, UX/UI and design system, AI behavior and personalization, SwiftUI, Supabase/Postgres architecture, and App Store release.",
    stack: ["Figma", "SwiftUI", "Supabase", "PostgreSQL", "Claude Code"],
  },
  {
    company: "Design Studio",
    title: "Product Designer",
    dates: "Jul 2024 – Mar 2026",
    description:
      "Led product design across web apps, crypto/DeFi, and early-stage software, turning ambiguous requirements into user flows, interaction models, design systems, and developer-ready prototypes.",
    stack: ["Figma", "Prototyping", "Design systems", "Developer handoff"],
  },
  {
    company: "Finalform",
    title: "Founder · Product Designer & Developer",
    dates: "Mar 2024 – Aug 2025",
    description:
      "Designed and shipped an AI-powered iOS calorie tracker used by 200–300 people, with food logging through photos, voice, and conversational text.",
    stack: ["Swift", "SwiftUI", "Supabase", "OpenAI API", "Figma"],
  },
  {
    company: "Goodkleen",
    title: "Founder",
    dates: "Mar 2023 – Feb 2024",
    description:
      "Founded and ran a residential cleaning company. Designed the brand and Webflow site, integrated booking and contractor scheduling, ran acquisition and service delivery, and exited by transferring the customer base and operations to two contractors.",
    stack: ["Figma", "Webflow", "BookingKoala", "Operations"],
  },
  {
    company: "MetaPharm",
    title: "Founder & Product Lead",
    dates: "Oct 2021 – Mar 2022",
    description:
      "Founded and led pre-launch product for a play-to-earn game and NFT ecosystem, coordinating 12–15 contributors and partners across engineering, game design, illustration, branding, growth, and community.",
    stack: ["Product strategy", "Web3", "Branding", "Community"],
  },
  {
    company: "Self-employed",
    title: "Quantitative Crypto Trader & Strategy Developer",
    dates: "Sep 2017 – Oct 2021",
    description:
      "Built and operated systematic crypto strategies across low-liquidity markets, arbitrage, and momentum, progressing from manual validation to automated execution and risk controls. Also provided paid strategy and automation consulting from 2018–2020.",
    stack: ["Python", "Node.js", "CCXT", "WebSockets", "REST APIs"],
  },
];
