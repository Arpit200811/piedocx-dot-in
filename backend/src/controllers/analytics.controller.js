
import mongoose from 'mongoose';
import ExamStudent from '../models/ExamStudent.js';
import TestResult from '../models/TestResult.js';
import ExamSession from '../models/ExamSession.js';
import { getCache, setCache } from '../utils/cacheService.js';

export const getDeepAnalytics = async (req, res) => {
    try {
        const { testId } = req.query; // Optional: Filter by specific test
        
        const cacheKey = `analytics_${testId || 'global'}`;
        const cachedData = await getCache(cacheKey);
        
        if (cachedData) {
            return res.json({ ...cachedData, source: 'cache' });
        }

        const matchStage = testId ? { testId: new mongoose.Types.ObjectId(testId) } : {};

        // 1. Completion & Drop-off Stats
        const totalStudents = await ExamStudent.countDocuments(matchStage);
        const completedTests = await TestResult.countDocuments(matchStage);
        const startedSessions = await ExamSession.distinct('studentId', matchStage).then(ids => ids.length);
        
        const completionRate = totalStudents ? ((completedTests / totalStudents) * 100).toFixed(1) : 0;
        const dropOffRate = startedSessions ? (((startedSessions - completedTests) / startedSessions) * 100).toFixed(1) : 0;

        // 2. Risk Distribution (Aggregation)
        const riskDistribution = await ExamSession.aggregate([
            { $match: matchStage },
            { 
                $bucket: {
                    groupBy: "$riskScore",
                    boundaries: [0, 40, 80, 1000],
                    default: "Unknown",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        const riskStats = {
            low: riskDistribution.find(r => r._id === 0)?.count || 0,     // 0-39
            medium: riskDistribution.find(r => r._id === 40)?.count || 0, // 40-79
            high: riskDistribution.find(r => r._id === 80)?.count || 0    // 80+
        };

        // 3. Operational Metrics (Avg Time, Reconnects)
        // Note: For avgTime, we use endTime - startTime from sessions that are 'completed'
        const opsMetrics = await ExamSession.aggregate([
            { $match: { ...matchStage, status: 'completed', endTime: { $exists: true } } },
            {
                $project: {
                    durationMinutes: { 
                        $divide: [{ $subtract: ["$endTime", "$startTime"] }, 60000] 
                    },
                    disconnectCount: 1
                }
            },
            {
                $group: {
                    _id: null,
                    avgTimePerExam: { $avg: "$durationMinutes" },
                    avgReconnects: { $avg: "$disconnectCount" }
                }
            }
        ]);

        const analyticsData = {
            overview: {
                totalStudents,
                startedSessions,
                completedTests,
                completionRate: `${completionRate}%`,
                dropOffRate: `${dropOffRate}%`
            },
            risk: riskStats,
            performance: {
                avgTimeMinutes: opsMetrics[0]?.avgTimePerExam?.toFixed(1) || 0,
                avgReconnects: opsMetrics[0]?.avgReconnects?.toFixed(1) || 0
            },
            lastUpdated: new Date()
        };

        // Cache for 5 minutes
        await setCache(cacheKey, analyticsData, 300);

        res.json({ ...analyticsData, source: 'db' });

    } catch (error) {
        console.error("Deep Analytics Error:", error);
        res.status(500).json({ message: 'Analytics Engine Failed' });
    }
};
