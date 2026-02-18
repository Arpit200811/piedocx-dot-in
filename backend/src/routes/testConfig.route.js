
import express from 'express';
import TestConfig from '../models/TestConfig.js';
import ExamStudent from '../models/ExamStudent.js';
import { adminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

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
            console.log(`[TimeCheck] No ACTIVE config found for ${yearGroup}/${branchGroup}. Checked at: ${now.toISOString()}`);
            return res.status(404).json({ message: 'No live or upcoming config found' });
        }
        
        const start = new Date(config.startDate);
        const end = new Date(config.endDate);
        
        const isLive = now >= start && now <= end && config.isActive;

        console.log(`[TimeCheck] Using Config ID: ${config._id}, Title: ${config.title}, Live: ${isLive}`);

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
    const { title, yearGroup, branchGroup, startDate, endDate, duration, questions, resultsPublished, testAccessKey } = req.body;
    let { targetCollege } = req.body;

    if (targetCollege) {
        targetCollege = targetCollege.trim().toLowerCase();
    }
    
    if (!yearGroup || !branchGroup) {
        return res.status(400).json({ message: 'Year Group and Branch Group are required.' });
    }

    try {
        console.log(`[TestConfig] POST Request Received. Body:`, JSON.stringify(req.body, null, 2));
        
        // Check if config exists for this SPECIFIC group combo - pick LATEST
        let config = await TestConfig.findOne({ yearGroup, branchGroup }).sort({ createdAt: -1 });
        let keyChanged = false;
        
        if (config) {
            console.log(`[TestConfig] Found existing config to update: ${config._id}`);
            if (config.testAccessKey !== testAccessKey) {
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
            
            console.log(`[TestConfig] Saving updated config. New Dates: ${config.startDate} to ${config.endDate}`);
            await config.save();
        } else {
            console.log(`[TestConfig] No existing config found for ${yearGroup}/${branchGroup}. Creating NEW.`);
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
            console.log(`[TestConfig] Saving NEW config. Dates: ${config.startDate} to ${config.endDate}`);
            await config.save();
            keyChanged = true; // New test count as key changed
        }

        // If Key is changed or newly created, reset student attempts for this group
        if (keyChanged) {
            console.log(`[TestConfig] Access Key changed for ${yearGroup}/${branchGroup}. Resetting student attempts...`);
            
            // Comprehensive branch list matching branchMapping.js
            const csItBranches = ['CSE', 'IT', 'Computer Science', 'Information Technology', 'CS', 'Software Engineering', 'AI', 'Data Science', 'DS'];
            const coreBranches = ['ECE', 'EE', 'ME', 'Civil', 'Auto', 'Automobile', 'Electronics', 'Electrical', 'Mechanical'];

            const branchFilter = branchGroup === 'CS-IT' 
                ? { $in: csItBranches.map(b => new RegExp(b, 'i')) }
                : { $in: coreBranches.map(b => new RegExp(b, 'i')) };

            const yearPrefixes = yearGroup.split('-'); // ['1', '2'] or ['3']

            await ExamStudent.updateMany(
                { 
                    $or: [
                        { year: { $in: yearPrefixes } },
                        { year: { $in: yearPrefixes.map(y => `${y}st`) } },
                        { year: { $in: yearPrefixes.map(y => `${y}nd`) } },
                        { year: { $in: yearPrefixes.map(y => `${y}rd`) } },
                        { year: { $in: yearPrefixes.map(y => `${y}th`) } }
                    ],
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
                        violationCount: 0
                    } 
                }
            );
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
        const { yearGroup, branchGroup } = req.body;
        // Default to finding the latest if not specified (legacy support) but prefer specific
        let query = {};
        if (yearGroup && branchGroup) {
            query = { yearGroup, branchGroup };
        }

        const config = await TestConfig.findOne(query).sort({ createdAt: -1 });
        if (!config) return res.status(404).json({ message: 'Test config not found.' });

        config.resultsPublished = !config.resultsPublished;
        await config.save();
        
        res.json({ message: `Results ${config.resultsPublished ? 'published' : 'hidden'}`, resultsPublished: config.resultsPublished });
    } catch (error) {
        console.error("toggleResults error:", error);
        res.status(500).json({ message: 'Error toggling results' });
    }
});

// Bulk Upload Questions
router.post('/bulk-upload-questions', adminAuth, async (req, res) => {
    try {
        const { yearGroup, branchGroup } = req.body;
        let { questions } = req.body;
        
        console.log(`[Bulk Upload] Request received for ${yearGroup}/${branchGroup}`);

        if (!yearGroup || !branchGroup) {
            return res.status(400).json({ message: 'Missing group identifiers (yearGroup/branchGroup)' });
        }

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
             console.log(`[Bulk Upload] Config not found. Creating new skeleton for ${yearGroup}/${branchGroup}`);
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
        
        console.log(`[Bulk Upload] Processed ${validatedQuestions.length} questions. Added: ${addedCount}, Duplicates ignored: ${validatedQuestions.length - addedCount}`);
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
