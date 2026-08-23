import express from 'express';
import { upload, uploadToCloudinary } from '../middlewares/upload.js';
import Report from '../models/Report.js';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import tesseract from 'tesseract.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure OpenAI for summarization
async function generateAISummaryAndTags(text) {
    if (!process.env.OPENAI_API_KEY) {
        return { summary: "AI summarization disabled (Missing API Key)", tags: ["auto-tagging-disabled"] };
    }
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `Analyze the following disaster report segment. Provide a 2-sentence summary and a JSON array of up to 5 relevant tags (e.g., ["flood", "medical-shortage", "ngo-success"]). Return strictly JSON format: {"summary": "...", "tags": [...]}. Text: ${text.substring(0, 3000)}`
            }],
            response_format: { type: "json_object" }
        });
        const result = JSON.parse(response.choices[0].message.content);
        return { summary: result.summary, tags: result.tags || [] };
    } catch (error) {
        console.error("OpenAI Error:", error);
        return { summary: "Error generating summary", tags: [] };
    }
}

// Upload Report with OCR
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { title, disasterType, state, district, date, ngoName, ngoType, volunteerCount } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const requiredFields = { title, disasterType, state, district, date };
        const missingFields = Object.entries(requiredFields)
            .filter(([, value]) => !value || !String(value).trim())
            .map(([field]) => field);

        if (missingFields.length > 0) {
            if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`,
                fields: missingFields,
            });
        }

        if (Number.isNaN(new Date(date).getTime())) {
            if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'Report date must be valid.', fields: ['date'] });
        }

        // Upload to Cloudinary
        const fileUrl = await uploadToCloudinary(file.path);

        // OCR Processing
        let extractedText = "";
        if (file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        } else if (file.mimetype.startsWith('image/')) {
            const result = await tesseract.recognize(file.path, 'eng');
            extractedText = result.data.text;
        }

        // Clean up local file
        fs.unlinkSync(file.path);

        // AI Processing
        const { summary, tags } = await generateAISummaryAndTags(extractedText || title);

        const newReport = new Report({
            title,
            disasterType,
            location: { state, district },
            date: new Date(date),
            originalFileUrl: fileUrl,
            extractedText,
            aiSummary: summary,
            tags,
            ngoDetails: { name: ngoName, type: ngoType },
            volunteerDetails: { count: volunteerCount ? parseInt(volunteerCount) : 0 }
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process report upload' });
    }
});

// Smart Search
router.get('/', async (req, res) => {
    try {
        const { q, state, disasterType, year } = req.query;
        let query = {};
        
        if (q) {
            query.$text = { $search: q };
        }
        if (state) query['location.state'] = state;
        if (disasterType) query.disasterType = disasterType;
        if (year) {
            query.date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        const reports = await Report.find(query).limit(50).sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Compare Multiple Reports
router.get('/compare', async (req, res) => {
    try {
        const { ids } = req.query; // expects comma separated ids
        if (!ids) return res.status(400).json({ error: "Missing report IDs" });

        const idArray = ids.split(',');
        const reports = await Report.find({ _id: { $in: idArray } });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Compare failed' });
    }
});

// Get Single Report details
router.get('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: "Not found" });
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Recommendations (Similar Cases)
router.get('/recommendations/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: "Not found" });

        // Basic matching based on same type & state, excluding self
        const recommendations = await Report.find({
            _id: { $ne: report._id },
            disasterType: report.disasterType,
            'location.state': report.location.state
        }).limit(3);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

export default router;
