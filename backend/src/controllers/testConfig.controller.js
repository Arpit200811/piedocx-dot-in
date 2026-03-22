
import TestConfig from '../models/TestConfig.js';
import ExamStudent from '../models/ExamStudent.js';
import { getIO } from '../utils/socketService.js';
import { broadcastResultLink } from '../utils/whatsappService.js';

export const getConfig = async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.query;
        let config;

        if (yearGroup && branchGroup) {
            config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        } else {
            config = await TestConfig.findOne().sort({ createdAt: -1 });
        }
        
        res.json(config || {});
    } catch (error) {
        console.error("fetchConfig error:", error);
        res.status(500).json({ message: 'Error fetching config' });
    }
};

export const getActiveTests = async (req, res) => {
    try {
        const configs = await TestConfig.find({ isActive: true }, 'title yearGroup branchGroup testAccessKey');
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active tests' });
    }
};

export const timeCheck = async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.query;
        const now = new Date();
        const config = await TestConfig.findOne({ 
            yearGroup, 
            branchGroup,
            endDate: { $gt: now } 
        }).sort({ createdAt: -1 });
        
        if (!config) {
            return res.status(404).json({ message: 'No live or upcoming config found' });
        }
        
        const start = new Date(config.startDate);
        const end = new Date(config.endDate);
        const isLive = now >= start && now <= end && config.isActive;

        res.json({
            serverTime: now,
            startTime: config.startDate,
            endTime: config.endDate,
            isLive
        });
    } catch (error) {
        console.error("[TimeCheck] Error:", error);
        res.status(500).json({ message: 'Time Sync Error' });
    }
};

export const upsertConfig = async (req, res) => {
    const { title, yearGroup, branchGroup, startDate, endDate, duration, questions, resultsPublished, testAccessKey } = req.body;
    let { targetCollege } = req.body;

    if (targetCollege) targetCollege = targetCollege.trim().toLowerCase();
    
    if (!yearGroup || !branchGroup) {
        return res.status(400).json({ message: 'Year Group and Branch Group are required.' });
    }

    try {
        let config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        let keyChanged = false;
        
        if (config) {
            if (config.testAccessKey !== testAccessKey || req.body.resetProgress) keyChanged = true;
            config.title = title;
            config.startDate = new Date(startDate);
            config.endDate = new Date(endDate);
            config.duration = duration;
            config.questions = questions;
            config.targetCollege = targetCollege || 'all';
            config.testAccessKey = testAccessKey;
            config.isActive = true;
            if (resultsPublished !== undefined) config.resultsPublished = resultsPublished;
            await config.save();
        } else {
            config = new TestConfig({ 
                title, yearGroup, branchGroup,
                startDate: new Date(startDate), 
                endDate: new Date(endDate), 
                duration, questions,
                targetCollege: targetCollege || 'all',
                testAccessKey, isActive: true,
                resultsPublished: resultsPublished || false
            });
            await config.save();
            keyChanged = true;
        }

        if (keyChanged) {
            const csItRegex = /\b(CSE|IT|Computer Science|Information Technology|CS|Software Engineering|AI|Data Science|DS)\b/i;
            const branchFilter = branchGroup === 'CS-IT' 
                ? { $regex: csItRegex }
                : { $not: { $regex: csItRegex } };

            const yearFilter = yearGroup === '3-4'
                ? { year: { $regex: /3|4|3rd|4th|third|fourth|final|graduated/i } }
                : { year: { $not: { $regex: /3|4|3rd|4th|third|fourth|final|graduated/i } } };

            await ExamStudent.updateMany(
                { 
                    ...yearFilter,
                    branch: branchFilter 
                },  
                { 
                    $set: { 
                        testAttempted: false, score: 0, correctCount: 0, wrongCount: 0,
                        assignedQuestions: [], savedAnswers: {}, testStartTime: null,
                        testEndTime: null, violationCount: 0
                    } 
                }
            );
        }
        
        const io = getIO();
        if (io) {
            io.emit('test_config_updated', { yearGroup, branchGroup, title: config.title });
        }

        res.json({ message: `Test configuration saved successfully ${keyChanged ? '(Attempts Reset)' : ''}`, config });
    } catch (error) {
        console.error("saveConfig error:", error);
        res.status(500).json({ message: 'Error saving config' });
    }
};

export const toggleResults = async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.body;
        let query = (yearGroup && branchGroup) ? { yearGroup, branchGroup } : {};
        const config = await TestConfig.findOne(query).sort({ createdAt: -1 });
        if (!config) return res.status(404).json({ message: 'Test config not found.' });

        config.resultsPublished = !config.resultsPublished;
        await config.save();

        const io = getIO();
        if (io) {
            io.emit('test_config_updated', { 
                yearGroup: config.yearGroup, 
                branchGroup: config.branchGroup, 
                title: config.title,
                resultsPublished: config.resultsPublished 
            });
        }

        // FEATURE #5: Automated Result Dispatch (Triggered when published)
        let broadcastStats = null;
        if (config.resultsPublished) {
            try {
                const students = await ExamStudent.find({ 
                    testAttempted: true, 
                    // Filter based on config groupings logic from upsertConfig
                    branch: branchGroup === 'CS-IT' ? { $regex: /\b(CSE|IT|Computer Science|Information Technology|CS|Software Engineering|AI|Data Science|DS)\b/i } : { $not: { $regex: /\b(CSE|IT|Computer Science|Information Technology|CS|Software Engineering|AI|Data Science|DS)\b/i } }
                });
                
                // Fire and forget so controller returns fast
                broadcastResultLink(students, config.title).catch(e => console.error("Broadcast Fail:", e));
                broadcastStats = { targetCount: students.length };
            } catch (err) {
                console.error("Broadcast Prep Fail:", err);
            }
        }

        res.json({ 
            message: `Results ${config.resultsPublished ? 'published' : 'hidden'}`, 
            resultsPublished: config.resultsPublished,
            broadcast: broadcastStats 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling results' });
    }
};

export const bulkUploadQuestions = async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.body;
        let { questions } = req.body;
        
        if (!yearGroup || !branchGroup) return res.status(400).json({ message: 'Missing group identifiers' });
        if (!questions) return res.status(400).json({ message: 'No questions provided' });

        if (typeof questions === 'string') questions = JSON.parse(questions);
        
        const validatedQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const questionText = (q.questionText || q.question || q.text || '').trim();
            const rawOptions = q.options || q.Choices || [];
            let options = Array.isArray(rawOptions) ? rawOptions.slice(0, 4).map(o => String(o).trim()) : [];
            
            // Basic validation
            if (!questionText || options.length !== 4) continue;

            let finalCorrectAnswer = (q.correctAnswer || q.answer);
            const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
            if (letterMap[String(finalCorrectAnswer)] !== undefined) {
                finalCorrectAnswer = options[letterMap[String(finalCorrectAnswer)]];
            }

            validatedQuestions.push({
                questionText,
                options,
                correctAnswer: String(finalCorrectAnswer).trim()
            });
        }

        let config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        if (!config) {
            config = new TestConfig({
                title: `Assessment for ${yearGroup} - ${branchGroup}`,
                yearGroup, branchGroup,
                startDate: new Date(), endDate: new Date(Date.now() + 86400000),
                duration: 30, questions: [], isActive: true, targetCollege: 'all'
            });
        }

        const existingTexts = new Set(config.questions.map(q => q.questionText.trim().toLowerCase()));
        let addedCount = 0;
        for (const q of validatedQuestions) {
            if (!existingTexts.has(q.questionText.toLowerCase())) {
                config.questions.push(q);
                addedCount++;
            }
        }

        await config.save();
        res.json({ message: `${addedCount} new questions uploaded.`, totalQuestions: config.questions.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
