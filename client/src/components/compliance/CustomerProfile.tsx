import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Shield, Building, User, Calendar, MapPin, Phone, Mail } from "lucide-react";

interface CustomerProfileProps {
  customer: {
    id: string;
    name: string;
    type: "retail" | "high_net_worth" | "institutional";
    riskRating: "low" | "medium" | "high";
    isPEP: boolean;
    isSanctioned: boolean;
    accountOpenDate: string;
    country: string;
    phone?: string;
    email?: string;
    beneficialOwner?: string;
  };
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const typeLabels = {
    retail: "Retail",
    high_net_worth: "High Net Worth",
    institutional: "Institutional",
  };

  const riskColors = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg">{customer.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">{customer.id}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">
                <Building className="h-3 w-3 mr-1" />
                {typeLabels[customer.type]}
              </Badge>
              <Badge className={riskColors[customer.riskRating]}>
                <Shield className="h-3 w-3 mr-1" />
                {customer.riskRating.toUpperCase()} Risk
              </Badge>
            </div>
          </div>
        </div>

        {(customer.isPEP || customer.isSanctioned) && (
          <div className="flex flex-wrap gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            {customer.isPEP && (
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Politically Exposed Person (PEP)</span>
              </div>
            )}
            {customer.isSanctioned && (
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Sanctions Match</span>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Account Opened:</span>
            <span>{customer.accountOpenDate}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Country:</span>
            <span>{customer.country}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Phone:</span>
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span>{customer.email}</span>
            </div>
          )}
          {customer.beneficialOwner && (
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Beneficial Owner:</span>
              <span>{customer.beneficialOwner}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
