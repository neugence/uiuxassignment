// taskConstants.js

// Task Status Options
export const TASK_STATUS = {
    BACKLOG: 'Backlog',
    IN_PROGRESS: 'In Progress',
    PAUSED: 'Paused',
    READY_FOR_LAUNCH: 'Ready for Launch',
  };
  
  // Task Priority Levels
  export const TASK_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
  };
  
  // Task Priority Colors for UI
  export const PRIORITY_COLORS = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  
  // Status Colors for UI
  export const STATUS_COLORS = {
    [TASK_STATUS.BACKLOG]: 'bg-gray-100 text-gray-800',
    [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TASK_STATUS.PAUSED]: 'bg-yellow-100 text-yellow-800',
    [TASK_STATUS.READY_FOR_LAUNCH]: 'bg-green-100 text-green-800',
  };
  
  // Task Categories
  export const TASK_CATEGORIES = {
    FEATURE: 'Feature',
    BUG: 'Bug',
    IMPROVEMENT: 'Improvement',
    MAINTENANCE: 'Maintenance',
    DOCUMENTATION: 'Documentation',
  };
  
  // Task Type Icons (using Lucide icon names)
  export const TASK_TYPE_ICONS = {
    [TASK_CATEGORIES.FEATURE]: 'PlusCircle',
    [TASK_CATEGORIES.BUG]: 'Bug',
    [TASK_CATEGORIES.IMPROVEMENT]: 'ArrowUp',
    [TASK_CATEGORIES.MAINTENANCE]: 'Tool',
    [TASK_CATEGORIES.DOCUMENTATION]: 'FileText',
  };
  
  // Default Task Template
  export const DEFAULT_TASK = {
    title: '',
    description: '',
    status: TASK_STATUS.BACKLOG,
    priority: TASK_PRIORITY.MEDIUM,
    category: TASK_CATEGORIES.FEATURE,
    assignee: [],
    startDate: null,
    endDate: null,
    comments: [],
    attachments: [],
    tags: [],
    subtasks: [],
  };
  
  // Pagination Options
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  };
  
  // Sort Options
  export const SORT_OPTIONS = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'priority-desc', label: 'Highest Priority' },
    { value: 'priority-asc', label: 'Lowest Priority' },
    { value: 'dueDate-asc', label: 'Due Date (Earliest)' },
    { value: 'dueDate-desc', label: 'Due Date (Latest)' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
  ];
  
  // Filter Options
  export const FILTER_OPTIONS = {
    status: Object.values(TASK_STATUS).map(status => ({
      value: status,
      label: status,
    })),
    priority: Object.entries(TASK_PRIORITY).map(([key, value]) => ({
      value: value,
      label: key.charAt(0) + key.slice(1).toLowerCase(),
    })),
    category: Object.values(TASK_CATEGORIES).map(category => ({
      value: category,
      label: category,
    })),
  };
  
  // Task Validation Rules
  export const TASK_VALIDATION = {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000,
    MAX_TAGS: 5,
    MAX_ASSIGNEES: 5,
    MAX_ATTACHMENTS: 10,
    ALLOWED_ATTACHMENT_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    MAX_ATTACHMENT_SIZE: 5 * 1024 * 1024, // 5MB
  };
  
  // Time Intervals
  export const TIME_INTERVALS = {
    AUTO_SAVE_DELAY: 1000, // 1 second
    REFRESH_INTERVAL: 30000, // 30 seconds
    STATUS_UPDATE_INTERVAL: 60000, // 1 minute
  };
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    TASKS: 'tasks',
    USER_PREFERENCES: 'userPreferences',
    FILTERS: 'taskFilters',
    DRAFT_TASK: 'draftTask',
    AUTH_TOKEN: 'authToken',
  };
  
  // Task Board Columns
  export const BOARD_COLUMNS = Object.values(TASK_STATUS).map(status => ({
    id: status.toLowerCase().replace(/\s+/g, '-'),
    title: status,
    color: STATUS_COLORS[status],
  }));
  
  // Default Task Views
  export const VIEW_TYPES = {
    BOARD: 'board',
    LIST: 'list',
    CALENDAR: 'calendar',
    TIMELINE: 'timeline',
    GANTT: 'gantt',
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_DATE: 'Please enter a valid date',
    INVALID_DATE_RANGE: 'End date must be after start date',
    MAX_LENGTH_EXCEEDED: (field, max) => `${field} cannot exceed ${max} characters`,
    MAX_ITEMS_EXCEEDED: (field, max) => `Cannot add more than ${max} ${field}`,
    INVALID_FILE_TYPE: 'This file type is not supported',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  };
  
  // Success Messages
  export const SUCCESS_MESSAGES = {
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    CHANGES_SAVED: 'All changes have been saved',
  };
  
  // Task Metrics
  export const TASK_METRICS = {
    COMPLETION_THRESHOLD: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    WARNING_THRESHOLD: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    OVERDUE_COLOR: '#ef4444',
    WARNING_COLOR: '#f59e0b',
    NORMAL_COLOR: '#10b981',
  };