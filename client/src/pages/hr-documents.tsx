import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function HRDocuments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Onboarding Documents</h1>
        <p className="text-muted-foreground mt-1">
          Manage document templates for employee onboarding
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Document Templates</h3>
          <p className="text-muted-foreground">
            Configure your onboarding document templates here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
