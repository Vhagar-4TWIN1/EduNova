import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, startOfWeek, addDays } from 'date-fns';

interface Event {
  id: string;
  start: string;
  end: string;
  type: string;
  title: string;
  durationMin: number;
}

interface HeatMapData {
  x: number; // Hour (0-23)
  y: number; // Day (0-6, Sunday-Saturday)
  z: number; // Duration in minutes
  events: Event[];
}

interface StudyHeatMapProps {
  events: Event[];
}

export default function StudyHeatMap({ events }: StudyHeatMapProps) {
  // Generate heat map data
  const heatMapData = React.useMemo(() => {
    const gridData: { [key: string]: HeatMapData } = {};
    
    // Initialize grid data (0-23 hours, 0-6 days)
    for (let hour = 0; hour < 24; hour++) {
      for (let day = 0; day < 7; day++) {
        const key = `${day}-${hour}`;
        gridData[key] = {
          x: hour,
          y: day,
          z: 0,
          events: [],
        };
      }
    }
    
    // Add events to grid data
    events.forEach(event => {
      try {
        const startDate = parseISO(event.start);
        const day = startDate.getDay(); // 0-6, Sunday-Saturday
        const hour = startDate.getHours(); // 0-23
        const key = `${day}-${hour}`;
        
        if (gridData[key]) {
          gridData[key].z += event.durationMin;
          gridData[key].events.push(event);
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    });
    
    return Object.values(gridData);
  }, [events]);
  
  // Get cell color based on duration
  const getCellColor = (duration: number) => {
    if (duration === 0) return 'bg-neutral-100';
    if (duration < 30) return 'bg-blue-100';
    if (duration < 60) return 'bg-blue-200';
    if (duration < 90) return 'bg-blue-300';
    if (duration < 120) return 'bg-blue-400';
    return 'bg-blue-500';
  };
  
  // Get text color based on background color
  const getTextColor = (duration: number) => {
    if (duration >= 90) return 'text-white';
    return 'text-neutral-800';
  };
  
  // Generate day labels (Monday, Tuesday, etc.)
  const dayLabels = React.useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return format(day, 'EEE');
    });
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Study Heat Map</CardTitle>
        <CardDescription>View your study patterns across the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_repeat(24,_minmax(0,_1fr))] gap-1">
          {/* Hour labels (column headers) */}
          <div className="col-span-1"></div>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={`hour-${i}`} className="text-center text-xs font-medium text-neutral-500">
              {i === 0 ? '12am' : i === 12 ? '12pm' : i > 12 ? `${i-12}pm` : `${i}am`}
            </div>
          ))}
          
          {/* Day rows with heat map cells */}
          {dayLabels.map((day, dayIndex) => (
            <React.Fragment key={`day-${dayIndex}`}>
              {/* Day label */}
              <div className="flex items-center justify-end pr-2 text-sm font-medium text-neutral-700">
                {day}
              </div>
              
              {/* Hour cells for this day */}
              {Array.from({ length: 24 }, (_, hourIndex) => {
                const cellData = heatMapData.find(d => d.x === hourIndex && d.y === dayIndex);
                const duration = cellData?.z || 0;
                
                return (
                  <div 
                    key={`cell-${dayIndex}-${hourIndex}`}
                    className={`
                      relative h-8 rounded-sm ${getCellColor(duration)} 
                      flex items-center justify-center transition-colors
                      hover:ring-2 hover:ring-primary hover:ring-opacity-50
                    `}
                    title={`${day} ${hourIndex}:00 - ${duration} minutes`}
                  >
                    {duration > 0 && (
                      <span className={`text-xs font-medium ${getTextColor(duration)}`}>
                        {duration}
                      </span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-sm bg-neutral-100"></div>
              <div className="h-4 w-4 rounded-sm bg-blue-100"></div>
              <div className="h-4 w-4 rounded-sm bg-blue-200"></div>
              <div className="h-4 w-4 rounded-sm bg-blue-300"></div>
              <div className="h-4 w-4 rounded-sm bg-blue-400"></div>
              <div className="h-4 w-4 rounded-sm bg-blue-500"></div>
            </div>
            <span>More</span>
          </div>
          
          <div className="flex gap-2">
            {['lesson', 'videoChat', 'task', 'focus'].map(type => (
              <Badge 
                key={type}
                className={`
                  ${type === 'lesson' ? 'bg-blue-100 text-blue-800' : 
                    type === 'videoChat' ? 'bg-purple-100 text-purple-800' : 
                    type === 'task' ? 'bg-amber-100 text-amber-800' : 
                    'bg-green-100 text-green-800'}
                `}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}