import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        
        const disasterCounts = await Report.aggregate([
            { $group: { _id: "$disasterType", count: { $sum: 1 } } }
        ]);

        const stateWise = await Report.aggregate([
            { $group: { _id: "$location.state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            totalReports,
            disasterCounts,
            stateWise
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;
