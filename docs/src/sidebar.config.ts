export const SECTION_CATEGORIES = [
  { label: "", ids: ["home"] },
  { label: "Overview", ids: ["challenge", "architecture"] },
  { label: "Develop", ids: ["getting-started", "performance", "ci-cd-pipeline"] },
] as const;

export const SECTION_ORDER = SECTION_CATEGORIES.flatMap(({ ids }) => ids);
