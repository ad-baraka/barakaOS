import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/marketing/StatusBadge";
import { Plus, Search, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

// TODO: Remove mock data
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Trading Challenge 2024",
    objective: "Signups",
    status: "active" as const,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    influencerCount: 24,
    applicationsOpen: true,
    performance: {
      clicks: 45200,
      signups: 3400,
      funded: 1200,
    },
  },
  {
    id: 2,
    name: "Q2 Brand Awareness",
    objective: "Awareness",
    status: "active" as const,
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    influencerCount: 18,
    applicationsOpen: false,
    performance: {
      clicks: 89000,
      signups: 5200,
      funded: 2100,
    },
  },
  {
    id: 3,
    name: "Ramadan Special Offer",
    objective: "Funded Accounts",
    status: "completed" as const,
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    influencerCount: 32,
    applicationsOpen: false,
    performance: {
      clicks: 120000,
      signups: 8900,
      funded: 4200,
    },
  },
  {
    id: 4,
    name: "New Platform Launch",
    objective: "Installs",
    status: "draft" as const,
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    influencerCount: 0,
    applicationsOpen: false,
    performance: {
      clicks: 0,
      signups: 0,
      funded: 0,
    },
  },
];

export default function MarketingCampaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage influencer campaigns</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-campaign">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new influencer marketing campaign
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input id="campaign-name" placeholder="e.g., Summer Trading Challenge 2024" data-testid="input-campaign-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">Objective</Label>
                <Select>
                  <SelectTrigger id="objective" data-testid="select-objective">
                    <SelectValue placeholder="Select campaign objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness</SelectItem>
                    <SelectItem value="installs">Installs</SelectItem>
                    <SelectItem value="signups">Signups</SelectItem>
                    <SelectItem value="funded">Funded Accounts</SelectItem>
                    <SelectItem value="trades">Trades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" data-testid="input-start-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" data-testid="input-end-date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Campaign details and goals..." rows={3} data-testid="input-description" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Create campaign triggered');
                setIsAddDialogOpen(false);
              }} data-testid="button-create">
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover-elevate" data-testid={`card-campaign-${campaign.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-2">{campaign.name}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={campaign.status} />
                    <Badge variant="outline" className="text-xs">
                      {campaign.objective}
                    </Badge>
                    {campaign.applicationsOpen && (
                      <Badge variant="default" className="text-xs">
                        Applications Open
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{campaign.influencerCount} influencers</span>
              </div>
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Performance</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Clicks</p>
                    <p className="font-semibold">{campaign.performance.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Signups</p>
                    <p className="font-semibold">{campaign.performance.signups.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Funded</p>
                    <p className="font-semibold">{campaign.performance.funded.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => console.log('View campaign details')} data-testid={`button-view-${campaign.id}`}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
