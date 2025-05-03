import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import confetti from "canvas-confetti";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, RotateCw, CheckIcon } from "lucide-react";
import { format, addDays, addHours } from "date-fns";

// —— Zod schema ——
const autoPlanFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["module", "videoChat", "task", "focus"]),
  description: z.string().optional(),
  durationMin: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration must be less than 8 hours"),
  priority: z.enum(["low", "normal", "high"]),
  moduleId: z.string().optional(),
  userId: z.string(),
  sessionLengthPreference: z.enum(["short", "long"]),
  breakRhythm: z.object({
    workMin: z.number().min(5, "Work must be at least 5 minutes"),
    breakMin: z.number().min(2, "Break must be at least 2 minutes"),
  }),
  dueDate: z.date().optional(),
  preferredTimeRange: z
    .object({ start: z.date(), end: z.date() })
    .optional(),
}).refine(
  (vals) => vals.type !== "module" || !!vals.moduleId,
  { message: "Please select a module", path: ["moduleId"] }
).refine(
  (vals) => vals.type !== "module" || !!vals.dueDate,
  { message: "Please pick a deadline for modules", path: ["dueDate"] }
);

export default function AutoPlanningForm({ onSuccess }) {
  const [showTimePreference, setShowTimePreference] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId") || "";

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(autoPlanFormSchema),
    defaultValues: {
      title: "",
      type: "module",
      description: "",
      durationMin: 60,
      priority: "normal",
      moduleId: "",
      userId,
      dueDate: undefined,
      preferredTimeRange: undefined,
    },
  });

  // fetch modules
  const modulesQuery = useQuery({
    queryKey: ["module"],
    queryFn: () => apiRequest("/module"),
    staleTime: 300_000,
    retry: false,
  });
  const modules = modulesQuery.data || [];
  const modulesLoading = modulesQuery.isLoading;

  // watchers
  const selectedType = form.watch("type");
  const moduleIdValue = form.watch("moduleId");
  const selectedModule = modules.find((m) => m._id === moduleIdValue);
  const filteredModules = useMemo(
    () =>
      modules.filter((m) =>
        m.title.toLowerCase().includes(moduleFilter.toLowerCase())
      ),
    [modules, moduleFilter]
  );

  // mutation
  const autoSchedule = useMutation({
    mutationFn: (data) =>
      apiRequest("/api/scheduler/auto-schedule", {
        method: "POST",
        body: data,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Auto-Scheduled",
        description: data.message || "Your event has been intelligently scheduled.",
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      form.reset();
      setShowTimePreference(false);
      onSuccess?.();
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Scheduling Failed",
        description: err.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => autoSchedule.mutate(data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <RotateCw className="mr-2 h-5 w-5 text-primary" />
          AI-Assisted Planning
        </CardTitle>
        <CardDescription>
          Let EduNova intelligently schedule your learning activities
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title of Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. React Hooks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type + Priority */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Activity Type</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50 shadow-lg">
                          <SelectItem value="module" className="hover:bg-muted/20">
                            Module
                          </SelectItem>
                          <SelectItem value="videoChat" className="hover:bg-muted/20">
                            Video Chat
                          </SelectItem>
                          <SelectItem value="task" className="hover:bg-muted/20">
                            Task
                          </SelectItem>
                          <SelectItem value="focus" className="hover:bg-muted/20">
                            Focus
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50 shadow-lg">
                          <SelectItem value="high" className="hover:bg-muted/20">
                            High
                          </SelectItem>
                          <SelectItem value="normal" className="hover:bg-muted/20">
                            Normal
                          </SelectItem>
                          <SelectItem value="low" className="hover:bg-muted/20">
                            Low
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Module picker */}
            {selectedType === "module" && (
              <FormField
                control={form.control}
                name="moduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Module</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12 rounded-md border px-4">
                          <SelectValue placeholder="Search modules..." />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
                          <div className="p-2">
                            <Input
                              placeholder="Filter modules..."
                              value={moduleFilter}
                              onChange={e => setModuleFilter(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {modulesLoading ? (
                              <div className="p-2">Loading…</div>
                            ) : filteredModules.length ? (
                              filteredModules.map(m => (
                                <SelectItem key={m._id} value={m._id} className="hover:bg-muted/20">
                                  {m.title}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-muted-foreground">
                                No modules found.
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Duration + Deadline */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="durationMin"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={15} max={480} step={15} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Deadline (opt.)</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
                        onChange={e => field.onChange(new Date(e.target.value))}
                        className="w-full rounded-md border px-4 py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (opt.)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

      

            {/* Toggle Time Preferences */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTimePreference(v => !v)}
              className="flex items-center"
            >
              <Clock className="mr-2 h-4 w-4" />
              {showTimePreference ? "Hide Time Preferences" : "Add Time Preferences"}
            </Button>

            {/* Preferred Time Range */}
            {showTimePreference && (
              <div className="p-4 border rounded space-y-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="preferredTimeRange.start"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Earliest Start</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={format(field.value || new Date(), "yyyy-MM-dd'T'HH:mm")}
                            onChange={e => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTimeRange.end"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Latest End</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={format(field.value || addHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm")}
                            onChange={e => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const now = new Date();
                    form.setValue("preferredTimeRange.start", now);
                    form.setValue("preferredTimeRange.end", addHours(now, 3));
                  }}>Today</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const t = addDays(new Date(), 1);
                    t.setHours(9,0,0,0);
                    form.setValue("preferredTimeRange.start", t);
                    form.setValue("preferredTimeRange.end", addHours(t, 6));
                  }}>Tomorrow</Button>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={autoSchedule.isLoading}>
                {autoSchedule.isLoading ? (
                  <><RotateCw className="mr-2 h-4 w-4 animate-spin" />Scheduling…</>
                ) : (
                  <><CheckIcon className="mr-2 h-4 w-4" />Schedule It For Me</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
