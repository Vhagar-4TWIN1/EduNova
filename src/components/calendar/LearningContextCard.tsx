import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import  {Button} from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Book, FileText, Clock, Brain, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import confetti from 'canvas-confetti';

interface LearningContextCardProps {
  eventId: string;
  onClose?: () => void;
}

interface LearningContext {
  summary: string;
  prerequisites: string[];
  studyTips: string[];
}

export default function LearningContextCard({ eventId, onClose }: LearningContextCardProps) {
  const [reflection, setReflection] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Fetch learning context for the event
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/learning/context', eventId],
    queryFn: async () => {
      return await apiRequest<{event: any, learningContext: LearningContext}>(`/api/learning/context/${eventId}`);
    },
    enabled: !!eventId
  });
  
  // Trigger confetti effect on first load when data is available
  useEffect(() => {
    if (data && !isLoading && !showConfetti) {
      setShowConfetti(true);
      
      // Light confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [data, isLoading, showConfetti]);
  
  // Handle adding a reflection note
  const handleAddReflection = () => {
    // In a real app, we would save this to the backend
    console.log("Saving reflection:", reflection);
    
    // Show success message using confetti
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 }
    });
    
    // Clear the input
    setReflection("");
  };
  
  // Loading skeleton UI
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (isError || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error Loading Learning Context</CardTitle>
          <CardDescription>We couldn't load the learning resources for this event.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There was an error connecting to the AI service. Please try again later.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} variant="outline">Close</Button>
        </CardFooter>
      </Card>
    );
  }
  
  const { event, learningContext } = data;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription>AI-assisted learning context</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground ml-7">
            {learningContext.summary}
          </p>
        </div>
        
        <Separator />
        
        {/* Prerequisites section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Prerequisites</h3>
          </div>
          <ul className="space-y-1 ml-7">
            {learningContext.prerequisites.map((prerequisite, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{prerequisite}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        {/* Study tips section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Study Tips</h3>
          </div>
          <ul className="space-y-1 ml-7">
            {learningContext.studyTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        {/* Resources section - You would populate this with actual resources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Resources</h3>
          </div>
          <div className="ml-7 grid gap-2">
            <Button variant="outline" className="justify-start" size="sm">
              <FileText className="mr-2 h-4 w-4" /> Lesson Slides
            </Button>
            <Button variant="outline" className="justify-start" size="sm">
              <FileText className="mr-2 h-4 w-4" /> Practice Exercises
            </Button>
            <Button variant="outline" className="justify-start" size="sm">
              <FileText className="mr-2 h-4 w-4" /> Additional Reading
            </Button>
          </div>
        </div>
        
        {/* Reflection input */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium">Add a reflection note</h3>
          <textarea
            className="w-full p-2 rounded-md border border-input bg-background text-sm min-h-[80px]"
            placeholder="What did you learn from this lesson? What questions do you still have?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAddReflection}
              disabled={!reflection.trim()}
            >
              Save Reflection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}