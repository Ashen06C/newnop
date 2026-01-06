import { Request, Response } from 'express';
import { Issue } from '../models/Issue';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
export const getIssues = async (req: Request, res: Response) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword as string,
                    $options: 'i',
                },
            }
            : {};

        const count = await Issue.countDocuments({ ...keyword });
        const issues = await Issue.find({ ...keyword })
            .populate('createdBy', 'name email')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        // Calculate stats
        const openCount = await Issue.countDocuments({ status: 'Open' });
        const inProgressCount = await Issue.countDocuments({ status: 'In Progress' });
        const resolvedCount = await Issue.countDocuments({ status: 'Resolved' });
        const closedCount = await Issue.countDocuments({ status: 'Closed' });

        res.json({
            issues,
            page,
            pages: Math.ceil(count / pageSize),
            stats: {
                open: openCount,
                inProgress: inProgressCount,
                resolved: resolvedCount,
                closed: closedCount
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
export const getIssueById = async (req: Request, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('createdBy', 'name email');

        if (issue) {
            res.json(issue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private
export const createIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status, priority, severity } = req.body;

        const issue = new Issue({
            title,
            description,
            status,
            priority,
            severity,
            createdBy: req.user._id,
        });

        const createdIssue = await issue.save();
        res.status(201).json(createdIssue);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Update an issue
// @route   PUT /api/issues/:id
// @access  Private
export const updateIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, status, priority, severity } = req.body;

        const issue = await Issue.findById(req.params.id);

        if (issue) {
            issue.title = title || issue.title;
            issue.description = description || issue.description;
            issue.status = status || issue.status;
            issue.priority = priority || issue.priority;
            issue.severity = severity || issue.severity;

            const updatedIssue = await issue.save();
            res.json(updatedIssue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private
export const deleteIssue = async (req: Request, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (issue) {
            await issue.deleteOne();
            res.json({ message: 'Issue removed' });
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Export issues to JSON
// @route   GET /api/issues/export
// @access  Private
export const exportIssues = async (req: Request, res: Response) => {
    try {
        const issues = await Issue.find({}).populate('createdBy', 'name email');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=issues.json');
        res.json(issues);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};
