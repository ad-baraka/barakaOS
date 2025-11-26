import { InvitationDialog } from "@/components/invitation-dialog";
import { TemplateSelector } from "@/components/template-selector";
import { useInvitation } from "@/contexts/invitation-context";

export function GlobalInvitationDialogs() {
  const {
    templateSelectorOpen,
    setTemplateSelectorOpen,
    invitationDialogOpen,
    setInvitationDialogOpen,
    selectedTemplate,
    setSelectedTemplate,
  } = useInvitation();

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
    setInvitationDialogOpen(true);
  };

  const handleInvitationDialogChange = (open: boolean) => {
    setInvitationDialogOpen(open);
    if (!open) {
      setSelectedTemplate("");
    }
  };

  return (
    <>
      <TemplateSelector
        open={templateSelectorOpen}
        onOpenChange={setTemplateSelectorOpen}
        onSelectTemplate={handleSelectTemplate}
      />

      <InvitationDialog
        open={invitationDialogOpen}
        onOpenChange={handleInvitationDialogChange}
        template={selectedTemplate}
      />
    </>
  );
}
