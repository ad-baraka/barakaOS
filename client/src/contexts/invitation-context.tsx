import { createContext, useContext, useState, ReactNode } from "react";

interface InvitationContextType {
  templateSelectorOpen: boolean;
  invitationDialogOpen: boolean;
  selectedTemplate: string;
  openTemplateSelector: () => void;
  openInvitationWith: (template: string) => void;
  closeDialogs: () => void;
  setInvitationDialogOpen: (open: boolean) => void;
  setTemplateSelectorOpen: (open: boolean) => void;
  setSelectedTemplate: (template: string) => void;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export function InvitationProvider({ children }: { children: ReactNode }) {
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const openTemplateSelector = () => {
    setInvitationDialogOpen(false);
    setSelectedTemplate("");
    setTemplateSelectorOpen(true);
  };

  const openInvitationWith = (template: string) => {
    setTemplateSelectorOpen(false);
    setSelectedTemplate(template);
    setInvitationDialogOpen(true);
  };

  const closeDialogs = () => {
    setTemplateSelectorOpen(false);
    setInvitationDialogOpen(false);
    setSelectedTemplate("");
  };

  return (
    <InvitationContext.Provider
      value={{
        templateSelectorOpen,
        invitationDialogOpen,
        selectedTemplate,
        openTemplateSelector,
        openInvitationWith,
        closeDialogs,
        setInvitationDialogOpen,
        setTemplateSelectorOpen,
        setSelectedTemplate,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const context = useContext(InvitationContext);
  if (context === undefined) {
    throw new Error("useInvitation must be used within an InvitationProvider");
  }
  return context;
}
