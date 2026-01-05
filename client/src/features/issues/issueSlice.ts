import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import issueService from './issueService';

interface Issue {
    _id: string;
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    priority: 'Low' | 'Medium' | 'High';
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    createdAt: string;
    updatedAt: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
}

interface IssueState {
    issues: Issue[];
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: IssueState = {
    issues: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new issue
export const createIssue = createAsyncThunk(
    'issues/create',
    async (issueData: any, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as any;
            const token = state.auth.user.token;
            return await issueService.createIssue(issueData, token);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get user issues
export const getIssues = createAsyncThunk(
    'issues/getAll',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as any;
            const token = state.auth.user.token;
            return await issueService.getIssues(token);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update issue
export const updateIssue = createAsyncThunk(
    'issues/update',
    async ({ id, issueData }: { id: string; issueData: any }, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as any;
            const token = state.auth.user.token;
            return await issueService.updateIssue(id, issueData, token);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete issue
export const deleteIssue = createAsyncThunk(
    'issues/delete',
    async (id: string, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as any;
            const token = state.auth.user.token;
            return await issueService.deleteIssue(id, token);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const issueSlice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createIssue.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createIssue.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.issues.push(action.payload);
            })
            .addCase(createIssue.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(getIssues.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getIssues.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.issues = action.payload.issues;
            })
            .addCase(getIssues.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(updateIssue.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateIssue.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.issues = state.issues.map((issue) =>
                    issue._id === action.payload._id ? action.payload : issue
                );
            })
            .addCase(updateIssue.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(deleteIssue.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteIssue.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.issues = state.issues.filter(
                    (issue) => issue._id !== action.payload.id
                );
            })
            .addCase(deleteIssue.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });
    },
});

export const { reset } = issueSlice.actions;
export default issueSlice.reducer;
