import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteIssue, updateIssue } from '../features/issues/issueSlice'; // Ensure getIssues fetches all so we can find it, or implement getIssueById
import type { AppDispatch } from '../store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';

const IssueDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { issues, isLoading, user } = useSelector((state: any) => ({
        issues: state.issue.issues,
        isLoading: state.issue.isLoading,
        user: state.auth.user,
    }));

    const [issue, setIssue] = useState<any>(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Find issue from store (assuming we already fetched them in dashboard OR we need to fetch specific one)
        // Ideally we should have a getIssueById thunk, but for now we look in state or fetch all if empty?
        const foundIssue = issues.find((i: any) => i._id === id);
        if (foundIssue) {
            setIssue(foundIssue);
            setStatus(foundIssue.status);
        } else {
            // Ideally dispatch getIssue(id)
            navigate('/');
        }
    }, [id, issues, user, navigate]);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        dispatch(updateIssue({ id: id!, issueData: { status: newStatus } }));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this issue?')) {
            dispatch(deleteIssue(id!)).then(() => {
                navigate('/');
            });
        }
    };

    if (!issue || isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <Button variant="outline" className="mb-4" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{issue.title}</CardTitle>
                            <CardDescription className="mt-2">
                                Created on {new Date(issue.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-lg">
                            {issue.priority} Priority
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{issue.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Status</h3>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Severity</h3>
                            <Badge variant="secondary">{issue.severity}</Badge>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Issue
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default IssueDetailsPage;
