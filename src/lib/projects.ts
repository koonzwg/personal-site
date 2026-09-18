export type Project = {
  title: string;
  description: string;
  links: { label: string; href: string }[];
  /** Path in /public. Until set, the card renders as a placeholder. */
  media?: string;
};

// Placeholder copy — edit freely.
export const projects: Project[] = [
  {
    title: "Shado: AI Journal & Guide",
    description:
      "An AI-guided reflection app for iOS that helps people see their patterns across time. Designed, built, and shipped end-to-end.",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/shado-ai-journal-guide/id6777745636",
      },
    ],
  },
  {
    title: "Hyperliquid",
    description:
      "Product design exploration for Hyperliquid's trading interface.",
    links: [],
  },
  {
    title: "Tinyman",
    description:
      "Product design exploration for Tinyman's decentralized exchange.",
    links: [],
  },
  {
    title: "Finalform: AI Calorie Tracker",
    description:
      "An iOS calorie tracker that logs food from a photo, a voice note, or a text. Shipped to the App Store, now archived.",
    links: [],
  },
  {
    title: "Goodkleen",
    description:
      "Brand and Webflow site for the residential cleaning company I founded and ran.",
    links: [
      { label: "Website", href: "https://goodkleenprototype.webflow.io/" },
    ],
  },
  {
    title: "MetaPharm",
    description:
      "Brand, site, and NFT artwork for a play-to-earn game I founded and led.",
    links: [{ label: "X", href: "https://x.com/metapharmgame" }],
  },
];
