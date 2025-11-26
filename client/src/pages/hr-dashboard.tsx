import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinerCard } from "@/components/joiner-card";
import { InvitationDialog } from "@/components/invitation-dialog";
import { TemplateSelector } from "@/components/template-selector";
import { Users, FileText, CheckCircle, Clock, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { NewJoiner, Invitation } from "@shared/schema";
import { useInvitation } from "@/contexts/invitation-context";

export default function HRDashboard() {
  const {
    templateSelectorOpen,
    setTemplateSelectorOpen,
    invitationDialogOpen,
    setInvitationDialogOpen,
    selectedTemplate,
    setSelectedTemplate,
    openTemplateSelector,
  } = useInvitation();

  const { data: joiners = [], isLoading } = useQuery<NewJoiner[]>({
    queryKey: ["/api/joiners"],
  });

  const { data: invitations = [], isLoading: invitationsLoading } = useQuery<Invitation[]>({
    queryKey: ["/api/invitations"],
  });

  const stats = {
    totalJoiners: joiners.length,
    pendingDocuments: joiners.filter(j => j.offerLetterStatus === "pending").length,
    signedOffers: joiners.filter(j => j.offerLetterStatus === "signed").length,
    startingThisMonth: joiners.length,
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for joiner:', id);
  };

  const handleSendDocuments = (id: string) => {
    console.log('Send documents for joiner:', id);
  };

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">HR Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee onboarding and document workflows
          </p>
        </div>
        <Button
          onClick={openTemplateSelector}
          data-testid="button-send-invitation"
          className="border-2 border-white"
        >
          <Send className="w-4 h-4 mr-2" />
          Add New Joiner
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium whitespace-nowrap">Total Joiners</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-joiners">{stats.totalJoiners}</div>
            <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium whitespace-nowrap">Pending Documents</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-docs">{stats.pendingDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium whitespace-nowrap">Signed Offers</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-signed-offers">{stats.signedOffers}</div>
            <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium whitespace-nowrap">Starting Soon</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-starting-soon">{stats.startingThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Invitations Sent</h2>
        {invitationsLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : invitations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No invitations sent yet</h3>
              <p className="text-muted-foreground mb-4">
                Send your first invitation to get started
              </p>
              <Button onClick={openTemplateSelector} className="border-2 border-white" data-testid="button-send-invitation-invitations">
                <Send className="w-4 h-4 mr-2" />
                Add New Joiner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    data-testid={`invitation-${invitation.id}`}
                    className="flex items-center justify-between p-4 rounded-md border border-card-border hover-elevate"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium" data-testid={`invitation-name-${invitation.id}`}>
                          {invitation.firstName} {invitation.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`invitation-email-${invitation.id}`}>
                          {invitation.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{invitation.position}</p>
                      <p className="text-xs text-muted-foreground">{invitation.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent New Joiners</h2>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : joiners.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No new joiners yet</h3>
              <p className="text-muted-foreground mb-4">
                Send your first invitation to get started
              </p>
              <Button onClick={openTemplateSelector} className="border-2 border-white" data-testid="button-send-invitation-joiners">
                <Send className="w-4 h-4 mr-2" />
                Add New Joiner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joiners.map((joiner) => (
              <JoinerCard
                key={joiner.id}
                joiner={joiner}
                onViewDetails={handleViewDetails}
                onSendDocuments={handleSendDocuments}
              />
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
