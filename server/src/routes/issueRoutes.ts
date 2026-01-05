import express from 'express';
import {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
    exportIssues,
} from '../controllers/issueController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/export', protect, exportIssues);
router.route('/').get(protect, getIssues).post(protect, createIssue);
router
    .route('/:id')
    .get(protect, getIssueById)
    .put(protect, updateIssue)
    .delete(protect, deleteIssue);

export default router;
