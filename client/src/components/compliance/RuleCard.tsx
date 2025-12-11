import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Edit2, Save, X, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RuleCardProps {
  rule: {
    id: string;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    threshold?: number;
    thresholdUnit?: string;
    riskWeight: number;
    alertsTriggered: number;
    lastUpdated: string;
  };
  onToggle: (id: string, active: boolean) => void;
  onUpdate: (id: string, updates: Partial<RuleCardProps["rule"]>) => void;
}

export function RuleCard({ rule, onToggle, onUpdate }: RuleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(rule);
  const [showTestDialog, setShowTestDialog] = useState(false);

  const handleSave = () => {
    onUpdate(rule.id, editedRule);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRule(rule);
    setIsEditing(false);
  };

  return (
    <Card className={`${!rule.isActive ? "opacity-60" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{rule.name}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {rule.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
          </div>
          <Switch
            checked={rule.isActive}
            onCheckedChange={(checked) => onToggle(rule.id, checked)}
            data-testid={`switch-rule-${rule.id}`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            {rule.threshold !== undefined && (
              <div className="space-y-2">
                <Label>Threshold ({rule.thresholdUnit})</Label>
                <Input
                  type="number"
                  value={editedRule.threshold}
                  onChange={(e) => setEditedRule({ ...editedRule, threshold: Number(e.target.value) })}
                  data-testid={`input-threshold-${rule.id}`}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Risk Weight: {editedRule.riskWeight}</Label>
              <Slider
                value={[editedRule.riskWeight]}
                onValueChange={([value]) => setEditedRule({ ...editedRule, riskWeight: value })}
                max={100}
                step={5}
                data-testid={`slider-risk-weight-${rule.id}`}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} data-testid={`button-save-rule-${rule.id}`}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} data-testid={`button-cancel-edit-${rule.id}`}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {rule.threshold !== undefined && (
                <div>
                  <span className="text-muted-foreground">Threshold</span>
                  <p className="font-medium">{rule.threshold.toLocaleString()} {rule.thresholdUnit}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Risk Weight</span>
                <p className="font-medium">{rule.riskWeight}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Alerts Triggered</span>
                <p className="font-medium">{rule.alertsTriggered}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated</span>
                <p className="font-medium text-xs">{rule.lastUpdated}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                data-testid={`button-edit-rule-${rule.id}`}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowTestDialog(true)}
                data-testid={`button-test-rule-${rule.id}`}
              >
                <Play className="h-4 w-4 mr-2" />
                Test Rule
              </Button>
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Rule: {rule.name}</DialogTitle>
            <DialogDescription>
              Run this rule against historical data to preview potential alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Test mode - no actual alerts will be generated</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Test Period</Label>
              <Input type="date" defaultValue="2024-11-01" data-testid="input-test-start-date" />
              <Input type="date" defaultValue="2024-11-27" data-testid="input-test-end-date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Testing rule:", rule.id);
              setShowTestDialog(false);
            }} data-testid="button-run-test">
              <Play className="h-4 w-4 mr-2" />
              Run Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
