import  { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label
} from 'recharts';
import { apiRequest } from '@/lib/queryClient';

export default function UserProgressRings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let result;
      
          // overall summary endpoint
          const  data  = await apiRequest(
            `/api/progress/user/${userId}`,
            { withCredentials: true }
          );
          result = data;
        
        const {
          totalLessons,
          completedLessons,
          totalTasks,
          completedTasks,
          streak
        } = result;

        const attendancePct = totalLessons
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;
        const tasksPct = totalTasks
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

        setData({
          attendancePercentage: attendancePct,
          tasksCompletedPercentage: tasksPct,
          currentStreak:streak,              // mock streak
          totalAttended: completedLessons,
          totalScheduled: totalLessons,
          totalTasks,
          completedTasks
        });
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const chartConfig = data && [
    {
      name: "Lessons Completed",
      percentage: data.attendancePercentage,
      color: "#4f46e5",
      description: `${data.totalAttended}/${data.totalScheduled} lessons completed`
    },
    {
      name: "Tasks Completed",
      percentage: data.tasksCompletedPercentage,
      color: "#059669",
      description: `${data.completedTasks}/${data.totalTasks} tasks completed`
    },
    {
      name: "Current Streak",
      percentage: Math.min(100, data.currentStreak * 10),
      color: "#db2777",
      description: `${data.currentStreak} day streak`
    }
  ];
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <div className="animate-pulse flex space-x-8">
            <div className="h-32 w-32 bg-neutral-200 rounded-full" />
            <div className="h-32 w-32 bg-neutral-200 rounded-full" />
            <div className="h-32 w-32 bg-neutral-200 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>No progress data found.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please complete some lessons or tasks to see your progress.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your learning progress and streaks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center md:flex-row md:justify-around">
          {chartConfig.map((config, idx) => (
            <div
              key={idx}
              className="mb-8 md:mb-0 flex flex-col items-center"
            >
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: config.percentage },
                        { name: 'Remaining', value: 100 - config.percentage }
                      ]}
                      cx="50%"
                      cy="50%"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius="70%"
                      outerRadius="90%"
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill={config.color} />
                      <Cell fill="#e5e7eb" />
                      <Label
                        value={`${config.percentage}%`}
                        position="center"
                        fill="#374151"
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          fontFamily: 'system-ui'
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <h3 className="text-lg font-medium mt-1">{config.name}</h3>
              <p className="text-sm text-neutral-500">{config.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
