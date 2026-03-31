
import express from 'express';
import TestConfig from '../models/TestConfig.js';
import ExamStudent from '../models/ExamStudent.js';
import { adminAuth } from '../middlewares/auth.middleware.js';
import { getIO } from '../utils/socketService.js';
import { delCache } from '../utils/cacheService.js';
import { z } from 'zod';

const router = express.Router();
const yearGroupSchema = z.enum(['1-2', '3-4', 'unknown']);
const branchGroupSchema = z.enum(['CS-IT', 'CORE', 'unknown']);
const configPayloadSchema = z.object({
    title: z.string().trim().min(1),
    yearGroup: yearGroupSchema,
    branchGroup: branchGroupSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    duration: z.number().int().positive(),
    questions: z.array(z.any()),
    resultsPublished: z.boolean().optional(),
    testAccessKey: z.string().trim().min(1).optional(),
    resetProgress: z.boolean().optional(),
    targetCollege: z.string().trim().optional()
}).refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate']
});
const toggleResultsSchema = z.object({
    yearGroup: yearGroupSchema.optional(),
    branchGroup: branchGroupSchema.optional()
});
const bulkUploadSchema = z.object({
    yearGroup: yearGroupSchema,
    branchGroup: branchGroupSchema,
    questions: z.union([z.array(z.any()), z.string()])
});

// Get Current Test Config (Specific or Latest)
router.get('/', adminAuth, async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.query;
        let config;

        if (yearGroup && branchGroup) {
            // Pick the LATEST one created for this group
            config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        } else {
            // Fallback: Get the most recently created one
            config = await TestConfig.findOne().sort({ createdAt: -1 });
        }
        
        // Return active config, or empty object if specific request not found (to let frontend know to init)
        res.json(config || {});
    } catch (error) {
        console.error("fetchConfig error:", error);
        res.status(500).json({ message: 'Error fetching config' });
    }
});

// Get List of Active Tests (For Broadcasters/Selectors)
router.get('/active', adminAuth, async (req, res) => {
    try {
        const configs = await TestConfig.find({ isActive: true }, 'title yearGroup branchGroup testAccessKey');
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active tests' });
    }
});

// Check Server Time & Exam Status
router.get('/time-check', async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.query;
        const now = new Date();
        // CRITICAL: Filter for tests that haven't ended yet and sort by latest created
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
});

// Create or Update Test Config (Group Specific)
router.post('/', adminAuth, async (req, res) => {
    const parsed = configPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid payload' });
    }
    const { title, yearGroup, branchGroup, startDate, endDate, duration, questions, resultsPublished, testAccessKey, resetProgress } = parsed.data;
    let { targetCollege } = parsed.data;

    if (targetCollege) {
        targetCollege = targetCollege.trim().toLowerCase();
    }
    
    try {
        let config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        let keyChanged = false;
        
        if (config) {
            if (config.testAccessKey !== testAccessKey || resetProgress) {
                keyChanged = true;
            }
            config.title = title;
            config.startDate = new Date(startDate);
            config.endDate = new Date(endDate);
            config.duration = duration;
            config.questions = questions;
            config.targetCollege = targetCollege || 'all';
            config.testAccessKey = testAccessKey;
            config.isActive = true; // Force active
            if (resultsPublished !== undefined) config.resultsPublished = resultsPublished;
            
            await config.save();
        } else {
            config = new TestConfig({ 
                title, 
                yearGroup,
                branchGroup,
                startDate: new Date(startDate), 
                endDate: new Date(endDate), 
                duration, 
                questions,
                targetCollege: targetCollege || 'all',
                testAccessKey,
                isActive: true,
                resultsPublished: resultsPublished || false
            });
            await config.save();
            keyChanged = true; // New test count as key changed
        }

        if (keyChanged) {
            const csItRegex = /\b(CSE|IT|Computer Science|Information Technology|CS|Software Engineering|AI|Data Science|DS|BCA|MCA|Computer Applications|BSCIT|MSCIT|PGDCA)\b/i;
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
                        testAttempted: false,
                        score: 0,
                        correctCount: 0,
                        wrongCount: 0,
                        assignedQuestions: [],
                        savedAnswers: {},
                        testStartTime: null,
                        testEndTime: null,
                        violationCount: 0,
                        testId: null
                    } 
                }
            );
        }

        // Cache Clearing to ensure students can see the new test immediately
        try {
            const cacheKeyBase = `test_info_${yearGroup}_${branchGroup}_`;
            await delCache(`${cacheKeyBase}all`);
        } catch (err) {
             console.error("Cache Clear Error:", err);
        }
        
        const io = getIO();
        if (io) {
            io.emit('test_config_updated', { 
                yearGroup, 
                branchGroup, 
                title: config.title 
            });
        }

        res.json({ message: `Test configuration for ${yearGroup} / ${branchGroup} saved successfully ${keyChanged ? '(Attempts Reset)' : ''}`, config });
    } catch (error) {
        console.error("saveConfig error:", error);
        res.status(500).json({ message: 'Error saving config' });
    }
});

// Toggle Results Publication (Group Specific)
router.patch('/toggle-results', adminAuth, async (req, res) => {
    try {
        const parsed = toggleResultsSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid payload' });
        }
        const { yearGroup, branchGroup } = parsed.data;
        let query = {};
        if (yearGroup && branchGroup) {
            query = { yearGroup, branchGroup };
        }

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
        res.json({ message: `Results ${config.resultsPublished ? 'published' : 'hidden'}`, resultsPublished: config.resultsPublished });
    } catch (error) {
        console.error("toggleResults error:", error);
        res.status(500).json({ message: 'Error toggling results' });
    }
});

// Bulk Upload Questions
router.post('/bulk-upload-questions', adminAuth, async (req, res) => {
    try {
        const parsed = bulkUploadSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid payload' });
        }
        const { yearGroup, branchGroup } = parsed.data;
        let { questions } = parsed.data;

        if (!questions || !Array.isArray(questions)) {
             if (typeof questions === 'string') {
                 try {
                     questions = JSON.parse(questions);
                 } catch (e) {
                    return res.status(400).json({ message: 'Invalid JSON format in questions string' });
                 }
             } else {
                return res.status(400).json({ message: 'Invalid questions format: Must be an array' });
             }
        }
        
        if (questions.length === 0) {
            return res.status(400).json({ message: 'No questions provided' });
        }
        const validatedQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            // Flexible key mapping
            const questionText = (q.questionText || q.question || q.Question || q.text || '').trim();
            const rawCorrectAnswer = q.correctAnswer || q.correct_answer || q.answer || q.Answer;

            // INTELLIGENT Option Detection
            let options = [];
            const rawOptions = q.options || q.Options || q.choices || q.Choices;

            if (Array.isArray(rawOptions)) {
                options = rawOptions.slice(0, 4).map(o => String(o ?? '').trim());
            } else if (rawOptions && typeof rawOptions === 'object') {
                // Handle nested object { "A": "...", "B": "..." } or { "1": "...", "2": "..." }
                const optA = rawOptions.A ?? rawOptions.a ?? rawOptions.option1 ?? rawOptions.opt1 ?? rawOptions[1] ?? rawOptions["1"];
                const optB = rawOptions.B ?? rawOptions.b ?? rawOptions.option2 ?? rawOptions.opt2 ?? rawOptions[2] ?? rawOptions["2"];
                const optC = rawOptions.C ?? rawOptions.c ?? rawOptions.option3 ?? rawOptions.opt3 ?? rawOptions[3] ?? rawOptions["3"];
                const optD = rawOptions.D ?? rawOptions.d ?? rawOptions.option4 ?? rawOptions.opt4 ?? rawOptions[4] ?? rawOptions["4"];
                
                if (optA !== undefined && optB !== undefined && optC !== undefined && optD !== undefined) {
                    options = [optA, optB, optC, optD].map(o => String(o ?? '').trim());
                } else {
                    // Final fallback for objects: just take the first 4 values regardless of keys
                    const values = Object.values(rawOptions).filter(v => v !== null && v !== undefined);
                    if (values.length >= 4) {
                        options = values.slice(0, 4).map(v => String(v).trim());
                    }
                }
            }

            // Fallback to top-level keys if object search failed
            if (options.length !== 4) {
                const optA = q.option1 ?? q.Option1 ?? q.a ?? q.A ?? q.opt1 ?? q.opt_1;
                const optB = q.option2 ?? q.Option2 ?? q.b ?? q.B ?? q.opt2 ?? q.opt_2;
                const optC = q.option3 ?? q.Option3 ?? q.c ?? q.C ?? q.opt3 ?? q.opt_3;
                const optD = q.option4 ?? q.Option4 ?? q.d ?? q.D ?? q.opt4 ?? q.opt_4;
                if (optA !== undefined && optB !== undefined && optC !== undefined && optD !== undefined) {
                    options = [optA, optB, optC, optD].map(o => String(o ?? '').trim());
                }
            }

            if (!questionText) {
                return res.status(400).json({ message: `[LOCAL-FIX] Question ${i + 1}: Text is missing.` });
            }
            
            if (options.length !== 4) {
                let debugInfo = `Found ${options.length}`;
                if (rawOptions && typeof rawOptions === 'object' && !Array.isArray(rawOptions)) {
                    debugInfo += `. Available keys: [${Object.keys(rawOptions).join(', ')}]`;
                }
                return res.status(400).json({ 
                    message: `[LOCAL-FIX] Question ${i + 1}: Must have exactly 4 options. ${debugInfo}.` 
                });
            }
            
            if (options.some(opt => !opt)) {
                return res.status(400).json({ message: `[LOCAL-FIX] Question ${i + 1}: All 4 options must contain text.` });
            }

            // HANDLE LETTER ANSWERS (A, B, C, D) OR NUMERIC POSITIONS (1, 2, 3, 4)
            const letterMap = { 
                'A': 0, 'B': 1, 'C': 2, 'D': 3, 
                'a': 0, 'b': 1, 'c': 2, 'd': 3,
                '1': 0, '2': 1, '3': 2, '4': 3
            };
            let finalCorrectAnswer = (q.correctAnswer || q.correct_answer || q.answer || q.Answer);
            
            if ((typeof finalCorrectAnswer === 'string' || typeof finalCorrectAnswer === 'number') && letterMap[String(finalCorrectAnswer)] !== undefined) {
                finalCorrectAnswer = options[letterMap[String(finalCorrectAnswer)]];
            }

            const correctAnswer = String(finalCorrectAnswer || '').trim();
            if (!correctAnswer) {
                return res.status(400).json({ message: `[LOCAL-FIX] Question ${i + 1}: Correct answer is missing.` });
            }
            
            if (!options.includes(correctAnswer)) {
                return res.status(400).json({ message: `[LOCAL-FIX] Question ${i + 1}: Correct answer "${correctAnswer}" not found in options: [${options.join(', ')}]` });
            }

            validatedQuestions.push({
                questionText,
                options,
                correctAnswer
            });
        }

        // Find the LATEST config for this group
        let config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        
        if (!config) {
             config = new TestConfig({
                 title: `Assessment for ${yearGroup} - ${branchGroup}`,
                 yearGroup,
                 branchGroup,
                 startDate: new Date(),
                 endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h window
                 duration: 30, // Explicitly set required field
                 questions: [],
                 isActive: true,
                 targetCollege: 'all'
             });
        }

        // SMART APPEND: Only add questions that don't already exist (by text check)
        const existingTexts = new Set(config.questions.map(q => q.questionText.trim().toLowerCase()));
        let addedCount = 0;
        let duplicateInFileCount = 0;
        const finalUniqueToUpload = [];
        const seenInFile = new Set();

        for (const q of validatedQuestions) {
            const text = q.questionText.trim().toLowerCase();
            if (seenInFile.has(text)) {
                duplicateInFileCount++;
                continue;
            }
            seenInFile.add(text);

            if (!existingTexts.has(text)) {
                config.questions.push(q);
                addedCount++;
            }
        }

        await config.save();
        res.json({ 
            message: `${addedCount} new questions uploaded. ${validatedQuestions.length - addedCount} duplicates were skipped.`, 
            totalQuestions: config.questions.length 
        });
    } catch (error) {
        console.error("[Bulk Upload] Error:", error);
        res.status(500).json({ message: error.message || 'Internal server error during bulk upload' });
    }
});

export default router;
