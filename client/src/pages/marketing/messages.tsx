import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// TODO: Remove mock data
const mockTemplates = [
  {
    id: 1,
    name: "Campaign Announcement",
    subject: "New Campaign Opportunity: {{campaign_name}}",
    preview: "We're excited to announce a new campaign opportunity...",
    type: "campaign_announcement",
  },
  {
    id: 2,
    name: "Payment Reminder",
    subject: "Your Payment is Ready",
    preview: "Hi {{influencer_name}}, your payment for {{campaign_name}} is ready...",
    type: "general_update",
  },
  {
    id: 3,
    name: "Application Deadline Reminder",
    subject: "Last Chance to Apply: {{campaign_name}}",
    preview: "The application deadline for {{campaign_name}} is approaching...",
    type: "reminder",
  },
];

const mockNotifications = [
  {
    id: 1,
    campaign: "Summer Trading Challenge 2024",
    subject: "New Campaign Open for Applications",
    sentAt: "2024-06-20",
    recipients: 45,
    opened: 32,
  },
  {
    id: 2,
    campaign: "Q2 Brand Awareness",
    subject: "Campaign Performance Update",
    sentAt: "2024-06-15",
    recipients: 18,
    opened: 16,
  },
];

export default function MarketingMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Messages & Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage templates and broadcast messages to influencers</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-new-template">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Message Template</DialogTitle>
                <DialogDescription>
                  Create a reusable template for campaign notifications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input id="template-name" placeholder="e.g., Campaign Launch" data-testid="input-template-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">Type</Label>
                  <Select>
                    <SelectTrigger id="template-type" data-testid="select-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaign_announcement">Campaign Announcement</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="general_update">General Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Use {{campaign_name}}, {{influencer_name}}" data-testid="input-subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message Body</Label>
                  <Textarea id="body" placeholder="Template content..." rows={6} data-testid="input-body" />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {"{{ campaign_name }}"}, {"{{ influencer_name }}"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Save template triggered');
                  setIsTemplateDialogOpen(false);
                }} data-testid="button-save">
                  Save Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isBroadcastDialogOpen} onOpenChange={setIsBroadcastDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-broadcast">
                <Send className="h-4 w-4 mr-2" />
                Broadcast Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Send Broadcast Notification</DialogTitle>
                <DialogDescription>
                  Send a message to filtered influencers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign">Campaign</Label>
                  <Select>
                    <SelectTrigger id="campaign" data-testid="select-campaign">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaign1">Summer Trading Challenge 2024</SelectItem>
                      <SelectItem value="campaign2">Q2 Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Filter Recipients</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger data-testid="select-tier-filter">
                        <SelectValue placeholder="Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="micro">Micro</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="macro">Macro</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="select-platform-filter">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-subject">Subject</Label>
                  <Input id="broadcast-subject" placeholder="Message subject" data-testid="input-broadcast-subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-body">Message</Label>
                  <Textarea id="broadcast-body" placeholder="Message content..." rows={5} data-testid="input-broadcast-body" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="open-applications" data-testid="checkbox-open-applications" />
                  <Label htmlFor="open-applications" className="text-sm font-normal cursor-pointer">
                    Open campaign for applications
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">~45 recipients will receive this message</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsBroadcastDialogOpen(false)} data-testid="button-cancel-broadcast">
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      console.log('Send broadcast triggered');
                      setIsBroadcastDialogOpen(false);
                    }} data-testid="button-send">
                      Send Message
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Message Templates</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-templates"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="hover-elevate" data-testid={`card-template-${template.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium mb-1">{template.name}</h4>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{template.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.preview}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => console.log('Edit template')} data-testid={`button-edit-${template.id}`}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => console.log('Use template')} data-testid={`button-use-${template.id}`}>
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div key={notification.id} className="pb-4 border-b last:border-0 last:pb-0" data-testid={`notification-${notification.id}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1">{notification.subject}</p>
                        <p className="text-sm text-muted-foreground mb-2">{notification.campaign}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(notification.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Sent to {notification.recipients} influencers
                      </span>
                      <span className="text-muted-foreground">
                        {notification.opened} opened ({Math.round((notification.opened / notification.recipients) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
