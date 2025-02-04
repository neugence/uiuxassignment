export interface Task {
    id: string;
    title: string;
    status: string;
    subtitle?: string;
    tags?: string[];
    views?: number;
    comments?: number;
    date?: string;
    badge?: string;
    assignee?: string;
    assignees?: string[];
    startDate?: string;
    endDate?: string;
    dateCreated?: any;
}