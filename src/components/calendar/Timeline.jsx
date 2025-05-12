"use client";

import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { format, parseISO, isAfter, isBefore, addMinutes } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Calendar as CalendarIcon,
  Video,
  BookOpen,
  FileText,
  Zap,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Timeline({ events, onJoin, refreshEvents }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lessonCache, setLessonCache] = useState({});
  const [selectedLessonData, setSelectedLessonData] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Sort events by start time
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      ),
    [events]
  );

  const openDialog = (evt) => {
    setSelectedEvent(evt);
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setSelectedLessonData(null);
  };

  // Preserve your original complete logic:
  const handleTaskComplete = async (evt, e) => {
    e.stopPropagation();
    const id = toast.loading("Marking as complete...");
    try {
      await apiRequest(`/api/progress/complete/event`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { userId: evt.userId, eventId: evt._id },
      });
      toast.update(id, {
        render: "Event marked as complete!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      refreshEvents();
    } catch {
      toast.update(id, {
        render: "Failed to mark event.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleLessonComplete = async (evt, e) => {
    e.stopPropagation();
    const id = toast.loading("Marking lesson complete...");
try {
  // extract a clean string ID whether lessonId was populated or is just a string
  const rawLessonId = evt.lessonId;
  const lessonId =
    typeof rawLessonId === "object" && rawLessonId?._id
      ? rawLessonId._id
      : rawLessonId;

  // directly call complete-lesson endpoint
  await apiRequest("/api/progress/complete/lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      userId: evt.userId,
      lessonId,
      eventId: evt._id,
    },
  });

  toast.update(id, {
    render: "Lesson marked as complete!",
    type: "success",
    isLoading: false,
    autoClose: 3000,
  });
  refreshEvents();
} catch (err) {
  console.error("Error marking lesson complete:", err);
  toast.update(id, {
    render: "Failed to mark lesson.",
    type: "error",
    isLoading: false,
    autoClose: 3000,
  });
}

  };

  // Join meeting
  const handleJoinClick = (evt, e) => {
    e.stopPropagation();
    if (onJoin) onJoin(evt);
    else if (evt.roomUrl) window.open(evt.roomUrl, "_blank");
  };

  // Time helpers
  const getTimeLabel = (s, e) => {
    try {
      const start = parseISO(s),
        end = parseISO(e);
      return `${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
    } catch {
      return "Invalid time";
    }
  };
  const isCurrent = (s, e) => {
    const now = new Date(),
      start = parseISO(s),
      end = parseISO(e);
    return isAfter(now, start) && isBefore(now, end);
  };
  const isUpcoming = (s) => {
    const now = new Date(),
      start = parseISO(s),
      soon = addMinutes(now, 30);
    return isAfter(start, now) && isBefore(start, soon);
  };
  const getIcon = (type) =>
    ({
      lesson: <BookOpen className="w-5 h-5 text-[#172746]" />,
      videoChat: <Video className="w-5 h-5 text-[#172746]" />,
      task: <FileText className="w-5 h-5 text-[#172746]" />,
      focus: <Zap className="w-5 h-5 text-[#172746]" />,
    }[type] || <CalendarIcon className="w-5 h-5 text-[#172746]" />);

  // Fetch lesson details when dialog opens
useEffect(() => {
  if (
    !isDialogOpen ||
    selectedEvent?.type !== "lesson" ||
    !selectedEvent.lessonId
  ) {
    return;
  }

  // Normalize lessonId (handle both string IDs and populated objects)
  const rawLessonId = selectedEvent.lessonId;
  const lessonId =
    typeof rawLessonId === "object" && rawLessonId?._id
      ? rawLessonId._id
      : rawLessonId;

  // If we’ve already cached this lesson, use it
  if (lessonCache[lessonId]) {
    setSelectedLessonData(lessonCache[lessonId]);
    return;
  }

  (async () => {
    try {
      const resp = await axios.get(`/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessonCache((c) => ({ ...c, [lessonId]: resp.data }));
      setSelectedLessonData(resp.data);
    } catch (err) {
      console.error("Failed to fetch lesson details:", err);
    }
  })();
}, [isDialogOpen, selectedEvent, lessonCache, token]);


  return (
    <>
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-10 top-0 bottom-0 w-[2px] bg-[#172746]/20" />

        <div className="space-y-12">
          {sortedEvents.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              No events scheduled today.
            </div>
          )}

          {sortedEvents.map((evt) => {
            const now = isCurrent(evt.start, evt.end);
            const soon = isUpcoming(evt.start);
            const joinable =
              evt.type === "videoChat" && (now || soon || evt.joinable);

            return (
              <div key={evt.id} className="relative flex group">
                <div
                  className={`
                    absolute left-6 top-2/4 -translate-y-2/4 
                    w-4 h-4 rounded-full border-2 
                    ${evt.completed
                      ? "bg-gray-300 border-gray-400"
                      : "bg-[#172746] border-white"}
                    transition-transform group-hover:scale-110
                  `}
                />
                <div className="w-20 text-right pr-4 text-sm text-gray-500 font-medium">
                  {format(parseISO(evt.start), "h:mm a")}
                </div>

                <Card
                  onClick={() => openDialog(evt)}
                  className={`
                    flex-1 p-4 bg-white rounded-2xl
                    border-t-4 border-[#172746]
                    shadow-[0_4px_6px_rgba(23,39,70,0.1)]
                    transition-transform duration-200
                    ${now ? "scale-105 ring-2 ring-[#172746]" : ""}
                    ${soon && !now ? "ring-1 ring-[#172746]/50" : ""}
                    hover:shadow-[0_8px_10px_rgba(23,39,70,0.15)]
                    hover:-translate-y-1
                  `}
                >
                  {now && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#172746]" />
                  )}

                  <CardHeader className="flex items-start justify-between pb-2">
                    <div className="flex items-center gap-3">
                      {getIcon(evt.type)}
                      <CardTitle className="text-lg font-semibold text-[#172746]">
                        {evt.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800 capitalize">
                        {evt.priority}
                      </Badge>
                      {now && <Badge className="bg-[#172746] text-white">Now</Badge>}
                      {soon && !now && (
                        <Badge className="bg-[#172746]/20 text-[#172746]">
                          Soon
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardDescription className="ml-8 text-gray-600">
                    {getTimeLabel(evt.start, evt.end)}
                  </CardDescription>

                  {evt.description && (
                    <CardContent className="pt-2 ml-8 text-gray-700">
                      {evt.description}
                    </CardContent>
                  )}

                  <CardFooter className="flex justify-end gap-2 pt-4 ml-8">
                    {!evt.completed && evt.type === "task" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleTaskComplete(evt, e)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {!evt.completed && evt.type === "lesson" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleLessonComplete(evt, e)}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {joinable && (
                      <Button
                        size="sm"
                        className="bg-[#172746] text-white"
                        onClick={(e) => handleJoinClick(evt, e)}
                      >
                        {now ? "Join Now" : "Join Early"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDialog(evt);
                      }}
                    >
                      Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Centered Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/20" />
          <DialogContent className="
            fixed top-1/2 left-1/2
            w-full max-w-2xl max-h-[90vh]
            overflow-y-auto
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-2xl shadow-2xl
            p-6
          ">
            <DialogHeader className="border-b border-gray-200 pb-4 mb-4">
              <DialogTitle className="text-2xl font-semibold text-[#172746]">
                Event Details
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="space-y-4 text-gray-700">
              {selectedEvent && (
                <>
                  <p><strong>Title:</strong> {selectedEvent.title}</p>
                  <p><strong>Time:</strong> {getTimeLabel(selectedEvent.start, selectedEvent.end)}</p>
                  <p>
                    <strong>Type:</strong>{" "}
                    <span className="capitalize">{selectedEvent.type}</span>
                  </p>
                  {selectedEvent.description && (
                    <>
                      <hr className="my-2" />
                      <p>{selectedEvent.description}</p>
                    </>
                  )}
                  {selectedEvent.type === "lesson" && !selectedLessonData && (
                    <p className="italic text-gray-500">Loading lesson details…</p>
                  )}
                  {selectedLessonData && (
                    <div>{/* render lessonData here */}</div>
                  )}
                </>
              )}
            </DialogDescription>

            <DialogFooter className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeDialog}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

Timeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["lesson", "videoChat", "task", "focus"])
        .isRequired,
      priority: PropTypes.oneOf(["low", "normal", "high"]).isRequired,
      description: PropTypes.string,
lessonId: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object
]),

      userId: PropTypes.string.isRequired,
      roomUrl: PropTypes.string,
      completed: PropTypes.bool,
      joinable: PropTypes.bool,
    })
  ).isRequired,
  onJoin: PropTypes.func,
  refreshEvents: PropTypes.func.isRequired,
};

Timeline.defaultProps = {
  onJoin: null,
};
