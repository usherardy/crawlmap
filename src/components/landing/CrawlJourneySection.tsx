import { Globe, Search, Network, BarChart2, Download } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const crawlTimelineData = [
  {
    id: 1,
    title: "Initiate",
    date: "Step 1",
    content: "Enter a URL and configure crawl depth, page limits, and scope. SiteExplorer prepares the crawler with your settings.",
    category: "Setup",
    icon: Globe,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Discover",
    date: "Step 2",
    content: "The crawler fans out from the root URL, following links across pages and subdomains while respecting robots.txt rules.",
    category: "Crawling",
    icon: Search,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Map Links",
    date: "Step 3",
    content: "Every internal and external link is catalogued — status codes, anchor text, redirect chains, and broken references.",
    category: "Analysis",
    icon: Network,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Visualize",
    date: "Step 4",
    content: "Pages and their connections are rendered as an interactive graph. Zoom, filter, and explore the full site architecture.",
    category: "Visualization",
    icon: BarChart2,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 35,
  },
  {
    id: 5,
    title: "Export",
    date: "Step 5",
    content: "Download the full site map as JSON, CSV, or PNG. Share with your team or feed into other tooling.",
    category: "Export",
    icon: Download,
    relatedIds: [4],
    status: "pending" as const,
    energy: 15,
  },
];

export function CrawlJourneySection() {
  return (
    <section className="relative w-full">
      <div className="text-center pt-20 pb-4 px-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
          How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          The Crawl Journey
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto text-base">
          Click any node to explore each phase of SiteExplorer's crawling pipeline — from URL input to exportable site map.
        </p>
      </div>
      <RadialOrbitalTimeline timelineData={crawlTimelineData} />
    </section>
  );
}
