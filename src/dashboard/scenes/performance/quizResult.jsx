import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const QuizResult = () => {
    const [studentsData, setStudentsData] = useState([]);
    const [globalStats, setGlobalStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetching both student performance and global statistics
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, globalStatsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/quiz/all-students-performance'),
                    axios.get('http://localhost:3000/api/quiz/global-stats')
                ]);

                setStudentsData(studentsResponse.data);
                setGlobalStats(globalStatsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    // Level distribution data for the global stats pie chart
    const levelDistributionData = globalStats.levelDistribution.map(item => ({
        name: item.level,
        value: item.count
    }));

    // Pie chart color scheme
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={3}>
                {/* Student Performance Table */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <Typography variant="h6" style={{ padding: '16px' }}>Student Performance</Typography>
                        <div style={{ padding: '16px' }}>
                            {studentsData.length === 0 ? (
                                <Typography variant="body1">No data available</Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {studentsData.map((student) => (
                                        <Grid item xs={12} sm={6} md={4} key={student._id}>
                                            <Card style={{ padding: '16px' }}>
                                                <Typography variant="h6">{student.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">{student.email}</Typography>
                                                <Typography variant="body1" style={{ marginTop: '8px' }}>
                                                    Score: {student.averageScore} - Level: {student.currentLevel}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </div>
                    </Card>
                </Grid>

                {/* Global Stats Section */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <Typography variant="h6" style={{ padding: '16px' }}>Global Stats</Typography>
                        <div style={{ padding: '16px' }}>
                            <Typography variant="body1">Total Students: {globalStats.totalStudents}</Typography>
                            <Typography variant="body1">Total Attempts: {globalStats.totalAttempts}</Typography>
                            <Typography variant="body1">Global Average Score: {globalStats.globalAvgScore}</Typography>

                            <div style={{ marginTop: '16px', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={levelDistributionData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            label
                                        >
                                            {levelDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default QuizResult;
