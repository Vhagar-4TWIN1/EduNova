import { useState, useEffect, useMemo, use } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { setupWebSocket, onMessage } from "@/lib/websocket";
import { format, parseISO, addHours } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import axios from 'axios';
  import { toast } from "react-toastify";

import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar as CalendarIcon, RefreshCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import LanguageSelector from "./LanguageSelector.jsx";
import Timeline from "@/components/calendar/Timeline";
import StudyHeatMap from "@/components/calendar/StudyHeatMap";
import ProgressRings from "@/components/calendar/ProgressRings";
import SkillTree from "@/components/calendar/SkillTree";
import AutoPlanningForm from "./AutoPlanningForm.jsx";

// --- validation schema ---
const eventFormSchema = z.object({
  type: z.enum(["lesson", "videoChat", "task", "focus"]),
  title: z.string().min(3),
  description: z.string().optional(),
  start: z.string(),
  end: z.string(),
  priority: z.enum(["low", "normal", "high"]),
  lessonId: z.string().optional().nullable(),
});

export default function CalendarPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [lessonFilter, setLessonFilter] = useState('');

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      type: "lesson",
      title: "",
      description: "",
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
      priority: "normal",
      lessonId: "",
    },
  });

  useEffect(()=>{
      document.title = "Calendar"
    },[])
 
  const userId = localStorage.getItem("userId");

  const eventsQuery = useQuery({
    queryKey: ["events"],
    
    queryFn: () => apiRequest(`/api/events/user/${userId}`),
    staleTime: 300_000,
    retry: false,
  });

  const lessonsQuery = useQuery({
    queryKey: ["lessons"],
    queryFn: () => apiRequest("/api/lessons"),
    staleTime: 300_000,
    retry: false,
  });
  
  const createEventMutation = useMutation({
    mutationFn: async (data) => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No userId in localStorage; please log in");
      
      if (data.type === "lesson" && data.lessonId) {
        const lesson = await apiRequest(`/api/lessons/${data.lessonId}`);
  
        const lessonId = lesson._id;
        console.log("Lesson ID:", lessonId);
        if (!lessonId) {
          throw new Error("Lesson is not linked to a valid module.");
        }
  
        const enrollment = await apiRequest(`/api/progress/enrollment/${userId}/${lessonId}`);
  
        if (!enrollment.enrolled) {
          const enrollRes = await apiRequest(`/api/progress/enroll`, {  method: "POST",

            body: {
              userId: String(userId),
              lessonId: String(lessonId),
            },});
          console.log("✅ Enrollment result:", enrollRes);
        } else {
          console.log("✅ User already enrolled.");
        }
      }
      const response = await axios.post(
        "http://localhost:3000/api/events",
        {
          type:        data.type,
          title:       data.title,
          description: data.description,
          start:       data.start,
          end:         data.end,
          priority:    data.priority,
          lessonId:    data.lessonId,
          userId,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data;
    },
  
    onSuccess: () => {
      form.reset();
      toast({ title: "Event Created" });
      setOpenDialog(false);
      queryClient.invalidateQueries(["events"]);
    },
  
    onError: (err) => {
      console.error("❌ Error in createEventMutation:", err);
      toast({
        title: "Error creating event",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  
  
  
  

  // Live updates
  useEffect(() => {
    const cleanup = setupWebSocket();
    const unsub1 = onMessage("pong", () => {});
    const unsub2 = onMessage("events:update", () => {
      queryClient.invalidateQueries(["events"]);
      toast({ title: "Calendar Updated" });
    });
    return () => {
      cleanup();
      unsub1();
      unsub2();
    };
  }, [toast]);

  const events = eventsQuery.data || [];
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) => parseISO(e.start).toDateString() === selectedDate.toDateString()
      ),
    [events, selectedDate]
  );

  const getEventTypeColor = (type) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 text-blue-800";
      case "videoChat":
        return "bg-purple-100 text-purple-800";
      case "task":
        return "bg-amber-100 text-amber-800";
      case "focus":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPriorityColor = (p) => {
    switch (p) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreate = (values) => {
    const id = toast.loading('Creating event...');
    createEventMutation.mutate(values, {
      onSuccess: () => {
        toast.update(id, { render: 'Event created!', type: 'success', isLoading: false, autoClose: 3000 });
        form.reset();
        handleDialogChange(false);
      },
      onError: (err) => {
        toast.update(id, { render: err.message, type: 'error', isLoading: false, autoClose: 3000 });
      },
    });
  };
    const handleDialogChange = (open) => {
    setOpenDialog(open);
    if (!open) {
      form.reset();
      eventsQuery.refetch();
      setLessonFilter('');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">{t("navigation.calendar")}</h1>
          <LanguageSelector />
        </header>

<Tabs defaultValue="calendar" className="w-full">
  <TabsList className="flex bg-[#172746]/10 rounded-xl p-1 mb-6">
    {["calendar", "timeline", "heatmap", "progress", "autoplan"].map((v) => (
      <TabsTrigger
        key={v}
        value={v}
        className={`
          flex-1 text-center px-4 py-2 text-sm font-medium
          text-[#172746]
          hover:bg-[#172746] hover:text-white
          transition-colors duration-200
          rounded-lg
          data-[state=active]:bg-[#172746]
          data-[state=active]:text-white
        `}
      >
        {t(`navigation.${v}`)}
      </TabsTrigger>
    ))}
  </TabsList>

  {/* ─── Calendar Content ──────────────────────────────────────────────── */}
  <TabsContent value="calendar" className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Date Picker */}
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <CardHeader className="flex items-center justify-between bg-[#172746] p-4">
          <div>
            <CardTitle className="flex items-center text-xl font-bold text-white">
              <CalendarIcon className="w-6 h-6 mr-2" />
              Select Date
            </CardTitle>
            <CardDescription className="text-sm text-[#E3E8F2]">
              Pick a day to view your events
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-white text-white hover:bg-white hover:text-[#172746] transition"
              onClick={() => setSelectedDate(new Date())}
            >
              <RefreshCw size={14} /> Today
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-1 bg-white text-[#172746] hover:bg-[#F0F4FF] transition"
              onClick={() => setOpenDialog(true)}
            >
              <Plus size={14} /> Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-[#F7F9FB]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={selectedDate}
            onMonthChange={setSelectedDate}
            className="rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Events List */}
      <Card className="bg-white rounded-2xl shadow-lg flex flex-col">
        <CardHeader className="border-b pb-2 mb-4 px-6">
          <CardTitle className="text-xl font-semibold text-[#172746]">
            Events on {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 flex-1 overflow-y-auto space-y-4">
          {filteredEvents.length === 0 ? (
            <p className="text-[#9CA3AF] italic text-center">
              No events for this day.
            </p>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="
                  flex items-start justify-between
                  p-4 bg-[#F0F4FF] rounded-lg
                  hover:shadow-md transition
                "
              >
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-[#172746]">
                    {evt.title}
                    {evt.lessonId?.title && ` — ${evt.lessonId.title}`}
                  </h3>
                  <p className="text-sm text-[#4B5563] mt-1">
                    {format(parseISO(evt.start), "h:mm a")} –{" "}
                    {format(parseISO(evt.end), "h:mm a")}
                  </p>
                  {evt.description && (
                    <p className="mt-2 text-sm text-[#6B7280]">
                      {evt.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1 ml-4">
                  <Badge className={`${getEventTypeColor(evt.type)} capitalize`}>
                    {evt.type}
                  </Badge>
                  <Badge className={`${getPriorityColor(evt.priority)} capitalize`}>
                    {evt.priority}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  </TabsContent>
          <TabsContent value="timeline">
          <Timeline events={events} refreshEvents={() => eventsQuery.refetch()} />
          </TabsContent>

          <TabsContent value="heatmap">
            <StudyHeatMap events={events} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressRings />
          </TabsContent>

          {/* FIX: match the tab trigger value with "autoplan" */}
          <TabsContent value="autoplan">
            <AutoPlanningForm onSuccess={() => eventsQuery.refetch()} />
          </TabsContent>

       
        </Tabs>
        <Dialog open={openDialog} onOpenChange={handleDialogChange}>
          <DialogContent className="fixed w-screen h-[90vh] mt-14 overflow-y-auto bg-white p-6 shadow-lg rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Create a New Event
              </DialogTitle>
              <DialogDescription>
                Fill the form to schedule your activity.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  (values) => createEventMutation.mutate(values),
                  (errors) => console.warn('Validation errors:', errors)
                )}
                className="mt-6 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Event Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-12 rounded-md border px-4">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-50 max-h-60 overflow-y-auto bg-white">
                              <SelectItem value="lesson" className="hover:bg-green-100">
                                Lesson
                              </SelectItem>
                              <SelectItem value="videoChat" className="hover:bg-green-100">
                                Video Chat
                              </SelectItem>
                              <SelectItem value="task" className="hover:bg-green-100">
                                Task
                              </SelectItem>
                              <SelectItem value="focus" className="hover:bg-green-100">
                                Focus Session
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
                            <SelectTrigger className="h-12 rounded-md border px-4">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-50 max-h-60 overflow-y-auto bg-white">
                              <SelectItem value="low" className="hover:bg-green-100">
                                Low
                              </SelectItem>
                              <SelectItem value="normal" className="hover:bg-green-100">
                                Normal
                              </SelectItem>
                              <SelectItem value="high" className="hover:bg-green-100">
                                High
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('type') === 'lesson' && (
                  <FormField
                    control={form.control}
                    name="lessonId"
                    render={({ field }) => {
                      const lessons = lessonsQuery.data || [];
                      const filtered = lessons.filter((lsn) =>
                        lsn.title.toLowerCase().includes(lessonFilter.toLowerCase())
                      );
                      return (
                        <FormItem>
                          <FormLabel>Select Lesson</FormLabel>
                          <FormControl>
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                              <SelectTrigger className="h-12 rounded-md border px-4">
                                <SelectValue placeholder="Search lessons..." />
                              </SelectTrigger>
                              <SelectContent position="popper" className="z-50 bg-white">
                                <div className="p-2">
                                  <Input
                                    placeholder="Search lessons..."
                                    value={lessonFilter}
                                    onChange={(e) => setLessonFilter(e.target.value)}
                                    autoFocus 
                                  />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {filtered.map((lsn) => (
                                    <SelectItem key={lsn._id} value={lsn._id} className="hover:bg-green-100">
                                      {lsn.title}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  {['start', 'end'].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full h-12 text-lg" disabled={createEventMutation.isLoading}>
                    {createEventMutation.isLoading ? 'Saving…' : 'Create Event'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
