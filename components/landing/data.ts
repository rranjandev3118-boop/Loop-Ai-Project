import {
  BarChart3,
  Bot,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export const feedbackSources = [
  "Support tickets",
  "App reviews",
  "Survey responses",
  "Sales notes",
  "Community posts",
];

export const landingFeatures = [
  {
    icon: Layers,
    title: "One inbox for every voice",
    description:
      "Bring support conversations, app reviews, surveys, sales notes, and community feedback into one workspace.",
  },
  {
    icon: Sparkles,
    title: "Themes that emerge for you",
    description:
      "Automatically classify sentiment and group related feedback so recurring product friction is easier to spot.",
  },
  {
    icon: TrendingUp,
    title: "See what is changing",
    description:
      "Follow feedback volume, sentiment, and theme activity over time with workspace-scoped analytics.",
  },
  {
    icon: Bot,
    title: "Ask with evidence",
    description:
      "Get answers grounded in the feedback your team has collected, with source references for follow-up.",
  },
  {
    icon: BarChart3,
    title: "Turn insights into reports",
    description:
      "Create weekly or monthly voice-of-customer reports with the underlying feedback in view.",
  },
  {
    icon: ShieldCheck,
    title: "Keep teams in the loop",
    description:
      "Give admins, analysts, and viewers role-appropriate access in a shared workspace.",
  },
];

export const landingStats = [
  {
    value: 5,
    suffix: "",
    label: "feedback sources",
    detail: "Support, reviews, surveys, sales, and community",
  },
  {
    value: 3,
    suffix: "",
    label: "workspace roles",
    detail: "Admin, analyst, and viewer access",
  },
  {
    value: 1,
    suffix: "",
    label: "shared feedback loop",
    detail: "From collected signal to team action",
  },
];

export const workflowSteps = [
  {
    number: "01",
    icon: Users,
    title: "Bring feedback together",
    description:
      "Collect feedback from your team's channels or import a CSV into the right workspace.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Let LOOP find the signal",
    description:
      "Classify sentiment and surface themes, feature areas, and recurring patterns.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Explore what is changing",
    description:
      "Use your inbox, trends, and grounded questions to investigate the customer context.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Share a useful next step",
    description:
      "Review what matters and give the team a clear, evidence-backed summary.",
  },
];

export const illustrativeWorkflows = [
  {
    label: "Illustrative workflow",
    title: "Spot friction before it becomes a pattern",
    description:
      "Bring checkout feedback together, then follow the recurring billing and onboarding themes.",
    signal: "Checkout feedback",
    theme: "Billing clarity",
    bars: [34, 48, 40, 62, 77, 58, 88],
    tone: "from-indigo-500/20 via-violet-500/10 to-cyan-400/20",
  },
  {
    label: "Illustrative workflow",
    title: "Connect requests across channels",
    description:
      "See when a product request appears in support tickets, app reviews, and survey responses.",
    signal: "Feature requests",
    theme: "Repeated across sources",
    bars: [52, 38, 66, 48, 78, 64, 92],
    tone: "from-cyan-400/20 via-sky-500/10 to-indigo-500/20",
  },
  {
    label: "Illustrative workflow",
    title: "Give every team the same context",
    description:
      "Use grounded answers and a shareable report to bring customer evidence into planning.",
    signal: "Workspace insight",
    theme: "Ready to review",
    bars: [30, 46, 42, 70, 58, 84, 76],
    tone: "from-violet-500/20 via-indigo-500/10 to-fuchsia-400/20",
  },
];

export const technologyStack = [
  { shortName: "N", name: "Next.js", role: "Application framework" },
  { shortName: "TS", name: "TypeScript", role: "Typed application code" },
  { shortName: "PG", name: "PostgreSQL", role: "Workspace data" },
  { shortName: "Pr", name: "Prisma", role: "Database access" },
  { shortName: "AI", name: "Claude", role: "Grounded AI workflows" },
  { shortName: "TW", name: "Tailwind CSS", role: "Responsive interface" },
  { shortName: "Auth", name: "Auth.js", role: "Session authentication" },
];

export const teamPerspectives = [
  {
    audience: "For product teams",
    title: "See which themes deserve a closer look",
    description:
      "Bring recurring requests and product friction into view with sentiment, themes, and feedback trends in one workspace.",
    takeaway: "Explore patterns across feedback",
  },
  {
    audience: "For support teams",
    title: "Connect the dots beyond one conversation",
    description:
      "Recognize repeated customer issues across channels and give product partners the context behind each signal.",
    takeaway: "Share context with product",
  },
  {
    audience: "For team leads",
    title: "Give decisions a customer-grounded starting point",
    description:
      "Ask questions against collected feedback and build a report that keeps the evidence close to the summary.",
    takeaway: "Move from signal to summary",
  },
];

export const whyLoopItems = [
  {
    icon: Sparkles,
    title: "Grounded, not generic",
    description:
      "Ask LOOP works from retrieved workspace feedback, helping teams trace answers back to actual customer input.",
  },
  {
    icon: ShieldCheck,
    title: "Built for shared work",
    description:
      "Workspace-scoped data and role-based access support collaboration across admins, analysts, and viewers.",
  },
  {
    icon: TrendingUp,
    title: "Useful beyond collection",
    description:
      "Move from intake to classification, trends, reports, and review without losing the customer context.",
  },
];

export const landingFaqs = [
  {
    question: "What is LOOP?",
    answer:
      "LOOP is a customer-feedback intelligence platform. It helps teams bring feedback together, classify it, explore themes and trends, ask grounded questions, and create reports.",
  },
  {
    question: "What kinds of feedback can my team bring in?",
    answer:
      "The project supports feedback such as support tickets, app reviews, survey responses, sales notes, and community posts. Teams can also import feedback with the supported CSV fields.",
  },
  {
    question: "How does LOOP keep AI answers grounded?",
    answer:
      "The Ask LOOP workflow retrieves feedback from the current workspace before generating an answer and includes source references. If AI credentials are not configured, the project can show the retrieved records in demo grounding mode.",
  },
  {
    question: "Can different teams have different access?",
    answer:
      "Yes. LOOP includes ADMIN, ANALYST, and VIEWER roles, with server-side authorization for protected operations.",
  },
  {
    question: "Does this landing page show live customer metrics?",
    answer:
      "No. The numbers show platform capabilities such as supported feedback-source categories and workspace roles. Example workflow cards are illustrative and are not customer case studies or performance claims.",
  },
];

export const landingCopy = {
  sources: {
    eyebrow: "Where feedback lives",
    title: "Connect the conversations you already have",
    description:
      "LOOP brings the everyday signals from your customer-facing teams into one place, ready to be understood.",
    footer: "Connect signals from across your customer journey",
  },
  features: {
    eyebrow: "Customer intelligence",
    title: "From scattered comments to a clearer next step",
    description:
      "A practical workflow for teams that want to understand the why behind customer feedback, not just collect more of it.",
    cardLinkLabel: "Included in LOOP",
  },
  stats: {
    eyebrow: "Built around your feedback",
    title: "A shared signal, made useful.",
    description:
      "These are platform capabilities—not customer performance claims. LOOP keeps the feedback workflow grounded in your workspace.",
  },
  process: {
    eyebrow: "How LOOP works",
    title: "A simple path from feedback to follow-through",
    description:
      "Keep the evidence close at every step, from the first customer comment to the next team decision.",
    stepLabel: "STEP",
  },
  workflows: {
    eyebrow: "Example workflows",
    title: "Make the patterns easier to see",
    description:
      "These illustrative examples show the kinds of feedback workflows LOOP supports; they are not customer case studies or measured outcomes.",
    workspaceLabel: "Workspace view",
    themeLabel: "Example theme",
    previewLabel: "Illustrative preview",
    previewAlt: (signal: string) => `Illustrative interface preview: ${signal}`,
  },
  technology: {
    eyebrow: "The LOOP foundation",
    title: "A dependable stack for customer intelligence",
    description:
      "Built with the tools already powering this project, from secure workspaces to AI-assisted analysis.",
  },
  perspectives: {
    eyebrow: "A clearer view for every team",
    title: "Make customer context easier to share",
    description:
      "Explore how LOOP's product capabilities can support different teams. These are workflow examples, not customer quotes.",
    label: "Team workflow perspectives",
    slideLabel: (current: number, total: number) => `${current} of ${total}`,
    chooseLabel: "Choose a perspective",
    showLabel: (audience: string) => `Show ${audience.toLowerCase()}`,
    previousLabel: "Show previous perspective",
    nextLabel: "Show next perspective",
    disclosure: "Product capability examples, not customer testimonials.",
  },
  why: {
    eyebrow: "Why LOOP",
    title: "Customer evidence belongs in the everyday workflow",
    description:
      "LOOP connects collection, analysis, and sharing without turning customer feedback into another disconnected dashboard.",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "A few useful details about LOOP",
    description:
      "Learn what the platform does and what the examples on this page represent.",
  },
  cta: {
    eyebrow: "Make room for the customer signal",
    title: "Give your feedback a place to move the product.",
    description:
      "Start a workspace or sign in to explore LOOP's feedback intelligence tools.",
    signup: "Create a workspace",
    login: "Sign in",
  },
  footer: {
    brandName: "LOOP",
    tagline: "Customer feedback intelligence for product-minded teams.",
    navLabel: "Footer navigation",
    links: ["Features", "How it works", "FAQ", "Sign in"],
    copyright: "© LOOP. Built to help teams listen, understand, and act.",
  },
  controls: {
    backToTop: "Back to top",
  },
};
