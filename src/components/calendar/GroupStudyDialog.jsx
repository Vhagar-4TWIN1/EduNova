import { useState } from "react";
import PropTypes from "prop-types"; // <-- Add this line
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const USERS = [
  { id: "1", name: "Alex Johnson", avatar: "👨‍🎓" },
  { id: "2", name: "Maria Garcia", avatar: "👩‍🎓" },
  { id: "3", name: "James Smith", avatar: "👨‍🎓" },
  { id: "4", name: "Sophia Martinez", avatar: "👩‍🎓" },
];

function GroupStudyDialog({ open, onOpenChange, lessonId, matchedSlot }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  const createGroupStudyMutation = useMutation({
    mutationFn: async (slot) => {
      return await apiRequest("/api/availability/group-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          userIds: slot.userIds,
          slotIds: slot.slotIds,
          start: slot.start,
          end: slot.end,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Group Study Scheduled",
        description: "Your group study session has been scheduled successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error Scheduling Group Study",
        description: error instanceof Error ? error.message : "Failed to schedule group study.",
        variant: "destructive",
      });
    },
  });

  const handleScheduleGroupStudy = (slot) => {
    createGroupStudyMutation.mutate(slot);
  };

  const formatTimeSlot = (slot) => {
    try {
      const start = parseISO(slot.start);
      const end = parseISO(slot.end);
      return `${format(start, "MMM d, yyyy h:mm a")} - ${format(end, "h:mm a")}`;
    } catch {
      return "Invalid time slot";
    }
  };

  const findUser = (userId) => {
    const user = USERS.find((u) => u.id === userId);
    return user || { id: userId, name: `User ${userId.slice(0, 4)}`, avatar: "👤" };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Group Study</DialogTitle>
          <DialogDescription>
            Match your availability with fellow students and create a study group
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Select a date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Available slots</h3>
              {matchedSlot ? (
                <Card className="border-primary/30 hover:border-primary cursor-pointer transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className="bg-green-100 text-green-800">
                        {matchedSlot.durationMinutes} minutes
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {matchedSlot.userIds.length} participants
                      </Badge>
                    </div>

                    <p className="text-sm font-medium">{formatTimeSlot(matchedSlot)}</p>

                    <div className="mt-3 flex items-center gap-1">
                      {matchedSlot.userIds.map((userId) => {
                        const user = findUser(userId);
                        return (
                          <div key={userId} className="group relative flex-none" title={user.name}>
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-lg">
                              {user.avatar}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    No matching availability found for this date
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Toggle your availability</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Morning
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Afternoon
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Evening
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => matchedSlot && handleScheduleGroupStudy(matchedSlot)}
            disabled={!matchedSlot || createGroupStudyMutation.isPending}
          >
            {createGroupStudyMutation.isPending ? "Scheduling..." : "Schedule Group Study"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 🛡️ PropTypes added here:
GroupStudyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  lessonId: PropTypes.string.isRequired,
  matchedSlot: PropTypes.shape({
    userIds: PropTypes.arrayOf(PropTypes.string),
    slotIds: PropTypes.arrayOf(PropTypes.string),
    start: PropTypes.string,
    end: PropTypes.string,
    durationMinutes: PropTypes.number,
  }),
};
