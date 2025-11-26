import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Plus, Search, Calendar } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

// TODO: Remove mock data
const mockTasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson on Q3 campaign",
    description: "Discuss deliverables and timeline for upcoming campaign",
    influencer: "Sarah Johnson",
    dueDate: "2024-06-28",
    priority: "high",
    status: "open" as const,
    assignedTo: "John Doe",
  },
  {
    id: 2,
    title: "Review Ahmed's content before posting",
    description: "Check TikTok videos for brand compliance",
    influencer: "Ahmed Al-Rashid",
    dueDate: "2024-06-26",
    priority: "high",
    status: "in_progress" as const,
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    title: "Send payment details to Maria",
    description: "Q2 campaign payout information needed",
    influencer: "Maria Garcia",
    dueDate: "2024-06-30",
    priority: "medium",
    status: "open" as const,
    assignedTo: "Finance Team",
  },
  {
    id: 4,
    title: "Schedule call with John for VIP program",
    description: "Discuss exclusive opportunities and benefits",
    influencer: "John Smith",
    dueDate: "2024-07-05",
    priority: "low",
    status: "open" as const,
    assignedTo: "John Doe",
  },
  {
    id: 5,
    title: "Update Fatima's channel statistics",
    description: "Refresh follower count and engagement metrics",
    influencer: "Fatima Hassan",
    dueDate: "2024-06-25",
    priority: "low",
    status: "completed" as const,
    assignedTo: "Data Team",
  },
];

const priorityColors = {
  high: "text-destructive",
  medium: "text-chart-4",
  low: "text-muted-foreground",
};

export default function MarketingTasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([5]);

  const toggleTaskComplete = (taskId: number) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
    console.log(`Task ${taskId} toggled`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Tasks</h1>
          <p className="text-muted-foreground mt-1">Track and manage influencer-related tasks</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-task">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a task related to an influencer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input id="task-title" placeholder="Task title" data-testid="input-title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea id="task-description" placeholder="Task details..." rows={3} data-testid="input-description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="influencer">Influencer</Label>
                <Select>
                  <SelectTrigger id="influencer" data-testid="select-influencer">
                    <SelectValue placeholder="Select influencer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="ahmed">Ahmed Al-Rashid</SelectItem>
                    <SelectItem value="maria">Maria Garcia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority" data-testid="select-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" data-testid="input-due-date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Create task triggered');
                setIsAddDialogOpen(false);
              }} data-testid="button-create">
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      <div className="space-y-3">
        {mockTasks.map((task) => (
          <Card key={task.id} className="hover-elevate" data-testid={`card-task-${task.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={completedTasks.includes(task.id)}
                  onCheckedChange={() => toggleTaskComplete(task.id)}
                  className="mt-1"
                  data-testid={`checkbox-task-${task.id}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`font-medium ${completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                    <span className="font-medium">{task.influencer}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <span>Assigned to: {task.assignedTo}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
