import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/marketing/StatusBadge";
import { PlatformIcon } from "@/components/marketing/PlatformIcon";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TODO: Remove mock data
const mockInfluencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    country: "UAE",
    platform: "instagram" as const,
    followers: "125K",
    tier: "mid",
    status: "active" as const,
    niche: "Finance",
  },
  {
    id: 2,
    name: "Ahmed Al-Rashid",
    email: "ahmed.r@email.com",
    country: "Saudi Arabia",
    platform: "tiktok" as const,
    followers: "450K",
    tier: "macro",
    status: "active" as const,
    niche: "Lifestyle",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.g@email.com",
    country: "Spain",
    platform: "youtube" as const,
    followers: "80K",
    tier: "micro",
    status: "prospect" as const,
    niche: "Tech",
  },
  {
    id: 4,
    name: "John Smith",
    email: "john.s@email.com",
    country: "UK",
    platform: "instagram" as const,
    followers: "920K",
    tier: "vip",
    status: "active" as const,
    niche: "Finance",
  },
  {
    id: 5,
    name: "Fatima Hassan",
    email: "fatima.h@email.com",
    country: "Egypt",
    platform: "tiktok" as const,
    followers: "65K",
    tier: "micro",
    status: "paused" as const,
    niche: "Lifestyle",
  },
];

export default function MarketingInfluencers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Influencers</h1>
          <p className="text-muted-foreground mt-1">Manage your influencer relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-influencer">
              <Plus className="h-4 w-4 mr-2" />
              Add Influencer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Influencer</DialogTitle>
              <DialogDescription>
                Create a new influencer profile in your CRM
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Influencer name" data-testid="input-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" data-testid="input-email" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger id="country" data-testid="select-country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="egypt">Egypt</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier">Tier</Label>
                  <Select>
                    <SelectTrigger id="tier" data-testid="select-tier">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="macro">Macro</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Primary Platform</Label>
                <Select>
                  <SelectTrigger id="platform" data-testid="select-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Add influencer triggered');
                setIsAddDialogOpen(false);
              }} data-testid="button-save">
                Add Influencer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search influencers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" data-testid="button-filter">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInfluencers.map((influencer) => (
                <TableRow key={influencer.id} data-testid={`row-influencer-${influencer.id}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{influencer.name}</p>
                      <p className="text-sm text-muted-foreground">{influencer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={influencer.platform} />
                      <span className="capitalize">{influencer.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>{influencer.followers}</TableCell>
                  <TableCell>
                    <span className="capitalize">{influencer.tier}</span>
                  </TableCell>
                  <TableCell>{influencer.country}</TableCell>
                  <TableCell>
                    <StatusBadge status={influencer.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-${influencer.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('View details')}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Edit')}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Add to campaign')}>
                          Add to Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => console.log('Archive')}>
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
