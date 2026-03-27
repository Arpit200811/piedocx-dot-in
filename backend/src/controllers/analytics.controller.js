
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

        const matchStageResults = testId ? { testConfig: new mongoose.Types.ObjectId(testId) } : {};
        const matchStageSessions = testId ? { testId: new mongoose.Types.ObjectId(testId) } : {};
        // Note: ExamStudent doesn't have a direct test link, so we approximate or skip test-specific filtering for it.
        const matchStageStudents = {}; 

        // 1. Concurrent Fetching (Total, Completed, Sessions, Risk, Scores, Metrics)
        const [
            totalStudents,
            completedTests,
            startedSessionsIds,
            riskDistribution,
            scoreDistribution,
            opsMetrics
        ] = await Promise.all([
            ExamStudent.countDocuments(matchStageStudents),
            TestResult.countDocuments(matchStageResults),
            ExamSession.distinct('studentId', matchStageSessions),
            ExamSession.aggregate([
                { $match: matchStageSessions },
                { 
                    $bucket: {
                        groupBy: "$riskScore",
                        boundaries: [0, 40, 80, 1000],
                        default: "Unknown",
                        output: { count: { $sum: 1 } }
                    }
                }
            ]),
            TestResult.aggregate([
                { $match: matchStageResults },
                { 
                    $bucket: {
                        groupBy: "$score",
                        boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 101],
                        default: "Unknown",
                        output: { count: { $sum: 1 } }
                    }
                }
            ]),
            ExamSession.aggregate([
                { $match: { ...matchStageSessions, status: 'completed', endTime: { $exists: true } } },
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
            ])
        ]);

        const startedSessions = startedSessionsIds.length;
        const completionRate = totalStudents ? ((completedTests / totalStudents) * 100).toFixed(1) : 0;
        const dropOffRate = startedSessions ? (((startedSessions - completedTests) / startedSessions) * 100).toFixed(1) : 0;

        const riskStats = {
            low: riskDistribution.find(r => r._id === 0)?.count || 0,     // 0-39
            medium: riskDistribution.find(r => r._id === 40)?.count || 0, // 40-79
            high: riskDistribution.find(r => r._id === 80)?.count || 0    // 80+
        };
        
        const analyticsData = {
            overview: {
                totalStudents,
                startedSessions,
                completedTests,
                completionRate: `${completionRate}%`,
                dropOffRate: `${dropOffRate}%`
            },
            risk: riskStats,
            scores: scoreDistribution.map(s => ({ range: `${s._id}-${s._id+10}`, count: s.count })),
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
