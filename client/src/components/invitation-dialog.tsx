import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInvitationSchema } from "@shared/schema";
import { Send, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplate, getTemplateDisplayName } from "@shared/templates";

interface InvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: string;
}

const formSchema = insertInvitationSchema.extend({
  email: z.string().email("Invalid email address"),
});

export function InvitationDialog({ open, onOpenChange, template }: InvitationDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      position: "",
      department: "",
      probationMonths: undefined,
      noticeMonths: undefined,
      startDate: undefined,
      salary: "",
      equityShares: undefined,
      vestingYears: undefined,
      cliffYears: undefined,
      vacationDays: undefined,
      remoteVacationDays: undefined,
      message: "Hey there, Welcome to Baraka. We're excited to get you onboarded. We need a little bit of information from you to get things rolling. Please fill in the questionnaire and feel free to reach out if you have any questions.",
    },
  });

  const firstName = form.watch("firstName");
  const salary = form.watch("salary");

  useEffect(() => {
    const currentMessage = form.getValues("message");
    if (firstName && currentMessage) {
      const updatedMessage = currentMessage.replace(/Hey [^,]*,/, `Hey ${firstName},`);
      if (updatedMessage !== currentMessage) {
        form.setValue("message", updatedMessage);
      }
    } else if (firstName) {
      form.setValue("message", `Hey ${firstName}, Welcome to Baraka. We're excited to get you onboarded. We need a little bit of information from you to get things rolling. Please fill in the questionnaire and feel free to reach out if you have any questions.`);
    }
  }, [firstName, form]);

  const templateMetadata = template ? getTemplate(template) : undefined;
  const isFullTimeDifc = templateMetadata?.showSalaryBreakdown || false;

  const calculateSalaryBreakdown = (totalSalary: string) => {
    const total = parseFloat(totalSalary) || 0;
    return {
      basic: (total * 0.6).toFixed(2),
      housing: (total * 0.3).toFixed(2),
      transport: (total * 0.1).toFixed(2),
    };
  };

  const salaryBreakdown = calculateSalaryBreakdown(salary || "0");

  const sendInvitation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/invitations", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent!",
        description: "The new joiner will receive an email with the onboarding link.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/joiners"] });
      form.reset({
        email: "",
        firstName: "",
        lastName: "",
        position: "",
        department: "",
        probationMonths: undefined,
        noticeMonths: undefined,
        startDate: undefined,
        salary: "",
        equityShares: undefined,
        vestingYears: undefined,
        cliffYears: undefined,
        vacationDays: undefined,
        remoteVacationDays: undefined,
        message: "Hey there, Welcome to Baraka. We're excited to get you onboarded. We need a little bit of information from you to get things rolling. Please fill in the questionnaire and feel free to reach out if you have any questions.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send invitation",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    sendInvitation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto" data-testid="dialog-invitation">
        <DialogHeader>
          <DialogTitle>Send Onboarding Invitation</DialogTitle>
          <DialogDescription>
            {template && (
              <span className="block mb-2 text-sm font-medium text-primary" data-testid="text-selected-template">
                Template: {templateMetadata?.displayName || getTemplateDisplayName(template)}
              </span>
            )}
            Send an email invitation to a new joiner. They'll fill out their personal details
            via a secure link.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Personal message to the new joiner..."
                      className="min-h-24"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="textarea-invitation-message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        data-testid="input-invitation-first-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        data-testid="input-invitation-last-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="newjoiner@company.com"
                      {...field}
                      data-testid="input-invitation-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Software Engineer"
                        {...field}
                        data-testid="input-invitation-position"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Engineering"
                        {...field}
                        data-testid="input-invitation-department"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="probationMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probation Period (Months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-probation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noticeMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period (Months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-notice"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          data-testid="button-invitation-start-date"
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : undefined);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isFullTimeDifc ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Annual Salary ({templateMetadata?.currency || "USD"}) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="300000"
                          {...field}
                          data-testid="input-invitation-salary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3 pl-4 border-l-2 border-muted">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-muted-foreground">Basic Salary (60%)</label>
                    <div className="text-sm font-medium" data-testid="text-basic-salary">
                      {templateMetadata?.currency || "USD"} {salaryBreakdown.basic}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-muted-foreground">Housing Allowance (30%)</label>
                    <div className="text-sm font-medium" data-testid="text-housing-allowance">
                      {templateMetadata?.currency || "USD"} {salaryBreakdown.housing}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-muted-foreground">Transport Allowance (10%)</label>
                    <div className="text-sm font-medium" data-testid="text-transport-allowance">
                      {templateMetadata?.currency || "USD"} {salaryBreakdown.transport}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Salary ({templateMetadata?.currency || "USD"}) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                        data-testid="input-invitation-salary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="equityShares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Shares</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10000"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-equity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vestingYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vesting (Years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="4"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-vesting"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cliffYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliff (Years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-cliff"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vacationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vacation Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-vacation-days"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remoteVacationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remote Vacation Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-invitation-remote-vacation-days"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-invitation"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={sendInvitation.isPending}
                data-testid="button-send-invitation"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendInvitation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
