import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Users } from "lucide-react";
import { TEMPLATES } from "@shared/templates";
import type { LucideIcon } from "lucide-react";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: string) => void;
}

const templateIcons: Record<string, LucideIcon> = {
  "full-time-difc": Users,
  "contractor-difc": Briefcase,
  "contractor": FileText,
  "contractor-marketing": Briefcase,
};

const templateDescriptions: Record<string, string> = {
  "full-time-difc": "Standard full-time employment contract for DIFC employees",
  "contractor-difc": "Independent contractor agreement for DIFC-based contractors",
  "contractor": "Standard independent contractor agreement",
  "contractor-marketing": "Independent contractor agreement for marketing contractors",
};

const templates = Object.values(TEMPLATES).map((template) => ({
  ...template,
  icon: templateIcons[template.id] || FileText,
  description: templateDescriptions[template.id] || "",
}));

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" data-testid="dialog-template-selector">
        <DialogHeader>
          <DialogTitle>Choose Invitation Template</DialogTitle>
          <DialogDescription>
            Select the type of employment contract for this new joiner
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover-elevate active-elevate-2 transition-colors"
                onClick={() => handleSelectTemplate(template.id)}
                data-testid={`card-template-${template.id}`}
              >
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.displayName}</CardTitle>
                    <CardDescription className="mt-1.5">
                      {template.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
