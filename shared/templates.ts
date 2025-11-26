export interface TemplateMetadata {
  id: string;
  displayName: string;
  currency: "AED" | "USD";
  showSalaryBreakdown: boolean;
}

export const TEMPLATES: Record<string, TemplateMetadata> = {
  "full-time-difc": {
    id: "full-time-difc",
    displayName: "Full Time Employee - DIFC",
    currency: "AED",
    showSalaryBreakdown: true,
  },
  "contractor-difc": {
    id: "contractor-difc",
    displayName: "Contractor - DIFC",
    currency: "USD",
    showSalaryBreakdown: false,
  },
  "contractor": {
    id: "contractor",
    displayName: "Contractor",
    currency: "USD",
    showSalaryBreakdown: false,
  },
  "contractor-marketing": {
    id: "contractor-marketing",
    displayName: "Contractor - Marketing",
    currency: "USD",
    showSalaryBreakdown: false,
  },
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);

export function getTemplate(id: string): TemplateMetadata | undefined {
  return TEMPLATES[id];
}

export function getTemplateDisplayName(id: string): string {
  return TEMPLATES[id]?.displayName || id;
}
