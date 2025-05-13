"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, parseISO, startOfWeek, addDays } from "date-fns";

interface Event {
  id: string;
  start: string;
  end: string;
  type: string;
  title: string;
  durationMin: number;
}

interface HeatMapData {
  x: number; // Hour 0–23
  y: number; // Day 0–6
  z: number; // Minutes
  events: Event[];
}

interface StudyHeatMapProps {
  events: Event[];
}

export default function StudyHeatMap({ events }: StudyHeatMapProps) {
  // build grid
  const heatMapData = React.useMemo<HeatMapData[]>(() => {
    const grid: Record<string, HeatMapData> = {};
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        grid[`${d}-${h}`] = { x: h, y: d, z: 0, events: [] };
      }
    }
    events.forEach((e) => {
      try {
        const dt = parseISO(e.start);
        const key = `${dt.getDay()}-${dt.getHours()}`;
        const cell = grid[key];
        if (cell) {
          cell.z += e.durationMin;
          cell.events.push(e);
        }
      } catch {}
    });
    return Object.values(grid);
  }, [events]);

  // cell styling
  const getCellColor = (mins: number) => {
    if (mins === 0) return "bg-neutral-100";
    if (mins < 30) return "bg-blue-100";
    if (mins < 60) return "bg-blue-200";
    if (mins < 90) return "bg-blue-300";
    if (mins < 120) return "bg-blue-400";
    return "bg-blue-500";
  };
  const getTextColor = (mins: number) =>
    mins >= 90 ? "text-white" : "text-neutral-800";

  // day labels
  const days = React.useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(start, i), "EEE")
    );
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Study Heat Map</CardTitle>
        <CardDescription>
          Your weekly study intensity by hour
        </CardDescription>
      </CardHeader>

      <CardContent className="overflow-auto">
        <div
          className="
            grid 
            grid-cols-[80px_repeat(24,minmax(0,1fr))] 
            auto-rows-[40px] 
            gap-1
          "
        >
          {/* empty top-left */}
          <div className="sticky top-0 left-0 z-20 bg-white" />

          {/* hour headers */}
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className="
                sticky top-0 z-10 bg-white
                text-center text-xs font-medium text-neutral-500
              "
            >
              {h === 0
                ? "12am"
                : h === 12
                ? "12pm"
                : h > 12
                ? `${h - 12}pm`
                : `${h}am`}
            </div>
          ))}

          {/* rows */}
          {days.map((day, d) => (
            <React.Fragment key={d}>
              {/* day label */}
              <div
                className="
                  sticky left-0 z-10 bg-white flex 
                  items-center justify-end pr-2 
                  text-sm font-medium text-neutral-700
                "
              >
                {day}
              </div>

              {/* cells */}
              {Array.from({ length: 24 }, (_, h) => {
                const cell = heatMapData.find(
                  (c) => c.x === h && c.y === d
                )!;
                return (
                  <Popover key={`${d}-${h}`}>
                    <PopoverTrigger asChild>
                      <div
                        className={`
                          relative h-full
                          flex items-center justify-center
                          ${getCellColor(cell.z)}
                          rounded-sm transition
                          hover:ring-2 hover:ring-[#172746]
                        `}
                      >
                        {cell.z > 0 && (
                          <span
                            className={`
                              text-xs font-medium 
                              ${getTextColor(cell.z)}
                            `}
                          >
                            {cell.z}
                          </span>
                        )}
                      </div>
                    </PopoverTrigger>

                    {cell.events.length > 0 && (
                      <PopoverContent 
                        align="start" 
                        className="w-64 p-4"
                      >
                        <h6 className="mb-2 font-semibold text-[#172746]">
                          {day} — {h}:00
                        </h6>
                        <ul className="space-y-1 max-h-48 overflow-auto">
                          {cell.events.map((e) => (
                            <li key={e.id}>
                              <span className="font-medium">{e.title}</span>
                              <span className="ml-1 text-xs text-neutral-500">
                                ({e.durationMin}m)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>
                    )}
                  </Popover>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* legend + type badges */}
        <div className="mt-4 flex justify-between items-center">
          {/* legend */}
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 20, 40, 60, 80, 100].map((_, i) => (
                <div
                  key={i}
                  className={`
                    h-4 w-4 rounded-sm
                    ${getCellColor(i * 30)}
                  `}
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* type badges */}
          <div className="flex gap-2">
            {(
              [
                ["lesson", "blue"],
                ["videoChat", "purple"],
                ["task", "amber"],
                ["focus", "green"],
              ] as const
            ).map(([type, color]) => (
              <Badge
                key={type}
                className={`
                  bg-${color}-100 text-${color}-800 capitalize
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
