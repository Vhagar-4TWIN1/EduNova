// Timeline.jsx
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

export default function Timeline({ events, onJoin, refreshEvents }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lessonCache, setLessonCache] = useState({});
  const [selectedLessonData, setSelectedLessonData] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

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
    setSelectedEvent(null);
    setSelectedLessonData(null);
    setIsDialogOpen(false);
  };

  const handleJoinClick = (evt, e) => {
    e.stopPropagation();
    if (onJoin) onJoin(evt);
    else if (evt.roomUrl) window.open(evt.roomUrl, "_blank");
  };

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
      const lesson = await apiRequest(`/api/lessons/${evt.lessonId}`, {
        withCredentials: true,
      });
      const moduleId = lesson.module;
      await apiRequest("/api/progress/complete/lesson", {
        method: "POST",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        body: {
          userId: evt.userId,
          moduleId,
          lessonId: evt.lessonId,
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
    } catch {
      toast.update(id, {
        render: "Failed to mark lesson.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Time helpers
  const getTimeLabel = (s, e) => {
    try {
      const start = parseISO(s),
        end = parseISO(e);
      return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
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
    ({ lesson: "📚", videoChat: "🎥", task: "📝", focus: "🧠" }[type] || "📅");

  // Fetch lesson details
  useEffect(() => {
    if (!isDialogOpen || selectedEvent?.type !== "lesson" || !selectedEvent.lessonId)
      return;
    const idKey = selectedEvent.lessonId;
    if (lessonCache[idKey]) {
      setSelectedLessonData(lessonCache[idKey]);
      return;
    }
    (async () => {
      try {
        const resp = await axios.get(`/api/lessons/${idKey}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessonCache((c) => ({ ...c, [idKey]: resp.data }));
        setSelectedLessonData(resp.data);
      } catch {
        /* ignore */
      }
    })();
  }, [isDialogOpen, selectedEvent, lessonCache, token]);

  return (
    <>
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Your daily schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative ml-5 pl-8 border-l-2 border-neutral-200">
            {sortedEvents.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-2">No events scheduled</p>
                <Button variant="outline" size="sm">Add New Event</Button>
              </div>
            ) : (
              sortedEvents.map((evt) => {
                const now = isCurrent(evt.start, evt.end);
                const soon = isUpcoming(evt.start);
                const joinable = evt.type === "videoChat" && (now || soon || evt.joinable);
                return (
                  <div
                    key={evt.id}
                    className={`mb-8 relative cursor-pointer hover:shadow-md ${
                      now ? "scale-[1.02]" : ""
                    } ${joinable && now ? "sticky top-4 z-10" : ""}`}
                  >
                    <div
                      className={`absolute -left-[calc(2rem+1px)] top-0 w-4 h-4 rounded-full ${
                        evt.completed ? "bg-gray-400" : "bg-primary"
                      }`}
                    />
                    <Card onClick={() => openDialog(evt)} className={`${now ? "ring-2 ring-primary" : ""} ${soon ? "ring-1 ring-primary/50" : ""}`}>
                      {now && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
                      <CardHeader className="pb-2 flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getIcon(evt.type)}</span>
                          <CardTitle>{evt.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-green-200 text-green-800">{evt.priority}</Badge>
                          {now && <Badge className="bg-primary text-primary-foreground">Now</Badge>}
                          {soon && !now && <Badge className="bg-blue-100 text-blue-800">Soon</Badge>}
                        </div>
                      </CardHeader>
                      <CardDescription className="mt-1">{getTimeLabel(evt.start, evt.end)}</CardDescription>
                      {evt.description && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">{evt.description}</p>
                        </CardContent>
                      )}
                      <CardFooter className="flex justify-end gap-2 pt-0">
                        {!evt.completed && evt.type === "task" && (
                          <Button variant="outline" size="sm" onClick={(e) => handleTaskComplete(evt, e)}>
                            Mark Complete
                          </Button>
                        )}
                        {!evt.completed && evt.type === "lesson" && (
                          <Button variant="outline" size="sm" onClick={(e) => handleLessonComplete(evt, e)}>
                            Mark Completed
                          </Button>
                        )}
                        {joinable && (
                          <Button size="sm" className={now ? "" : "bg-primary/80"} onClick={(e) => handleJoinClick(evt, e)}>
                            {now ? "Join Now" : "Join Early"}
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openDialog(evt); }}>
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="fixed w-screen h-[80vh] mt-16 mb-16 overflow-y-auto bg-white p-6 shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription asChild>
              <div>
                {selectedEvent && (
                  <>
                    <p><strong>Title:</strong> {selectedEvent.title}</p>
                    <p><strong>Description:</strong> {selectedEvent.description || "—"}</p>
                    <p><strong>Type:</strong> {selectedEvent.type}</p>
                    <hr className="my-3" />
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedEvent?.type === "lesson" && (
            selectedLessonData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* …lesson details rendering… */}
              </div>
            ) : (
              <p>Loading lesson details…</p>
            )
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
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
      type: PropTypes.oneOf(["lesson","videoChat","task","focus"]).isRequired,
      priority: PropTypes.oneOf(["low","normal","high"]).isRequired,
      description: PropTypes.string,
      lessonId: PropTypes.string,
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
