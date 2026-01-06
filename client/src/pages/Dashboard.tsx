import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIssues, createIssue, reset } from '../features/issues/issueSlice';
import type { AppDispatch, RootState } from '../store';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Search, ArrowRight, Download } from 'lucide-react';

import { toast } from 'sonner';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    const { issues, isLoading, isError, message } = useSelector(
        (state: RootState) => state.issue
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [newIssue, setNewIssue] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        severity: 'Medium',
        status: 'Open',
    });
    const [errors, setErrors] = useState({ title: '', description: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (!user) {
            navigate('/login');
        } else {
            dispatch(getIssues());
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    const filteredIssues = issues.filter((issue) => {
        const matchesSearch = issue.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'All' || issue.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { title: '', description: '' };

        if (!newIssue.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }

        if (!newIssue.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreateIssue = () => {
        if (!validateForm()) return;

        dispatch(createIssue(newIssue)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setIsDialogOpen(false);
                setNewIssue({
                    title: '',
                    description: '',
                    priority: 'Medium',
                    severity: 'Medium',
                    status: 'Open',
                });
                setErrors({ title: '', description: '' });
                toast.success("Issue created successfully");
            }
        });
    };

    const handleExport = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(filteredIssues)
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'issues.json';

        link.click();
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Open':
                return 'info';
            case 'In Progress':
                return 'warning';
            case 'Resolved':
                return 'success';
            case 'Closed':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'destructive';
            case 'Medium':
                return 'warning';
            case 'Low':
                return 'success';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-neutral-50 via-white to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold">Issues</h1>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setErrors({ title: '', description: '' });
                    }}>
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" /> New Issue
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Issue</DialogTitle>
                                <DialogDescription>
                                    Add a new issue to the tracker. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="title"
                                            value={newIssue.title}
                                            onChange={(e) => {
                                                setNewIssue({ ...newIssue, title: e.target.value });
                                                if (errors.title) setErrors({ ...errors, title: '' });
                                            }}
                                            className={errors.title ? "border-red-500" : ""}
                                        />
                                        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <div className="col-span-3">
                                        <Textarea
                                            id="description"
                                            value={newIssue.description}
                                            onChange={(e) => {
                                                setNewIssue({ ...newIssue, description: e.target.value });
                                                if (errors.description) setErrors({ ...errors, description: '' });
                                            }}
                                            className={errors.description ? "border-red-500" : ""}
                                        />
                                        {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="priority" className="text-right">
                                        Priority
                                    </Label>
                                    <Select
                                        value={newIssue.priority}
                                        onValueChange={(val) =>
                                            setNewIssue({ ...newIssue, priority: val })
                                        }
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="severity" className="text-right">
                                        Severity
                                    </Label>
                                    <Select
                                        value={newIssue.severity}
                                        onValueChange={(val) =>
                                            setNewIssue({ ...newIssue, severity: val })
                                        }
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select severity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateIssue}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search issues..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="cursor-pointer" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead>Priority</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredIssues.length > 0 ? (
                                filteredIssues.map((issue) => (
                                    <TableRow key={issue._id}>
                                        <TableCell className="font-medium">{issue.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(issue.status) as any}>
                                                {issue.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {issue.description}
                                        </TableCell>
                                        <TableCell>{issue.createdBy?.name || 'Unknown'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getPriorityBadgeVariant(issue.priority) as any}>
                                                {issue.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                className="cursor-pointer"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/issues/${issue._id}`)}
                                            >
                                                View
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
