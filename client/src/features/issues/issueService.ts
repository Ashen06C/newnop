import axios from 'axios';

const API_URL = 'http://node-backend-ashen.c7edgde4fgcqdba5.southindia.azurecontainer.io:5000/api/issues/';

// Get user issues
const getIssues = async (token: string, pageNumber: number = 1) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}?pageNumber=${pageNumber}`, config);

    return response.data;
};

// Create new issue
const createIssue = async (issueData: any, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, issueData, config);

    return response.data;
};

// Update issue
const updateIssue = async (issueId: string, issueData: any, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + issueId, issueData, config);

    return response.data;
};

// Delete issue
const deleteIssue = async (issueId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL + issueId, config);

    return response.data;
};

const issueService = {
    getIssues,
    createIssue,
    updateIssue,
    deleteIssue,
};

export default issueService;
