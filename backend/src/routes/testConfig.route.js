
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

        if (!questions || !Array.isArray(questions)) {
             // Try parsing if it's a string (sometimes happens with form-data misconfiguration)
             if (typeof questions === 'string') {
                 try {
                     questions = JSON.parse(questions);
                 } catch (e) {
                    console.error("[Bulk Upload] Failed to parse questions string:", e.message);
                    return res.status(400).json({ message: 'Invalid questions format: Could not parse JSON string' });
                 }
             } else {
                console.error("[Bulk Upload] Questions is not an array. Type:", typeof questions);
                return res.status(400).json({ message: 'Invalid questions format: Must be an array' });
             }
        }
        
        if (questions.length === 0) {
            return res.status(400).json({ message: 'No questions provided' });
        }

        if (!yearGroup || !branchGroup) {
            return res.status(400).json({ message: 'Missing group identifiers (yearGroup/branchGroup)' });
        }

        // Validate structure of each question
        const validatedQuestions = questions.map((q, i) => {
            // Map incoming keys to expected keys (Support variations)
            const questionText = q.questionText || q.question;
            const rawOptions = q.options;
            const rawCorrectAnswer = q.correctAnswer || q.answer;

            // Detailed validation for debugging
            if (!questionText) {
                const msg = `Question index ${i + 1}: Missing 'questionText' (or 'question'). Received keys: ${Object.keys(q).join(', ')}`;
                console.error(`[Bulk Upload] ${msg}`);
                console.error(`[Bulk Upload] Failed Object:`, JSON.stringify(q, null, 2));
                throw new Error(msg);
            }
            if (!Array.isArray(rawOptions)) {
                const msg = `Question index ${i + 1}: 'options' must be an array.`;
                console.error(`[Bulk Upload] ${msg}`);
                console.error(`[Bulk Upload] Failed Object:`, JSON.stringify(q, null, 2));
                throw new Error(msg);
            }
            if (rawOptions.length !== 4) {
                 const msg = `Question index ${i + 1}: 'options' must have exactly 4 items. Found ${rawOptions.length}.`;
                 console.error(`[Bulk Upload] ${msg}`);
                 console.error(`[Bulk Upload] Failed Object:`, JSON.stringify(q, null, 2));
                 throw new Error(msg);
            }
            if (!rawCorrectAnswer) {
                const msg = `Question index ${i + 1}: Missing 'correctAnswer' (or 'answer').`;
                console.error(`[Bulk Upload] ${msg}`);
                console.error(`[Bulk Upload] Failed Object:`, JSON.stringify(q, null, 2));
                throw new Error(msg);
            }
            
            // Normalize to string and trim 
            const options = rawOptions.map(o => String(o).trim());
            const correctAnswer = String(rawCorrectAnswer).trim();

            if (!options.includes(correctAnswer)) {
                const msg = `Correct answer not found in options at question index ${i + 1}. Options: ${JSON.stringify(options)}, Answer: ${correctAnswer}`;
                console.error(`[Bulk Upload] ${msg}`);
                throw new Error(msg);
            }
            return {
                questionText: questionText,
                options: options,
                correctAnswer: correctAnswer
            };
        });

        let config = await TestConfig.findOne({ yearGroup, branchGroup });
        if (!config) {
             console.log(`[Bulk Upload] Config not found. Creating new skeleton for ${yearGroup}/${branchGroup}`);
             config = new TestConfig({
                 title: `Assessment for ${yearGroup} - ${branchGroup}`,
                 yearGroup,
                 branchGroup,
                 startDate: new Date(),
                 endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h window
                 questions: [],
                 isActive: true
             });
        }

        // Use loop to avoid stack overflow with spread operator on large arrays
        // config.questions.push(...validatedQuestions); 
        validatedQuestions.forEach(q => config.questions.push(q));

        await config.save();
        
        console.log(`[Bulk Upload] Successfully uploaded ${validatedQuestions.length} questions to ${yearGroup}/${branchGroup}`);
        res.json({ message: `${validatedQuestions.length} questions uploaded successfully`, totalQuestions: config.questions.length });
    } catch (error) {
        console.error("[Bulk Upload] Error:", error);
        
        // Return 400 for validation errors we explicitly threw
        if (error.message.startsWith('Invalid structure') || error.message.startsWith('Correct answer')) {
             return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: error.message || 'Bulk upload failed' });
    }
});

export default router;
