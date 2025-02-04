import { format } from 'date-fns';

const mockUsers = [
  { id: 1, name: 'Karen Smith', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jake Wilson', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Brad Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Molly Brown', avatar: 'https://i.pravatar.cc/150?img=4' },
];

const mockTitles = [
  'Project overview', 'Company Roadmap', 'Metrics and KPI',
  'UI kit update', 'Blog post', 'Communication plan',
  'Custom emoji', 'API documentation', 'Notifications',
  'Analytics Dashboard', 'User Testing', 'Performance Optimization'
];

export const generateMockTasks = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `task-${index + 1}`,
    title: mockTitles[index % mockTitles.length],
    status: ['General Information', 'Backlog', 'In progress', 'Paused', 'Ready for launch'][
      Math.floor(Math.random() * 5)
    ],
    assignees: [
      mockUsers[Math.floor(Math.random() * mockUsers.length)],
      mockUsers[Math.floor(Math.random() * mockUsers.length)],
    ].filter((v, i, a) => a.indexOf(v) === i),
    startDate: format(new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)), 'yyyy-MM-dd'),
    endDate: format(new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)), 'yyyy-MM-dd'),
    comments: Math.floor(Math.random() * 5),
    views: Math.floor(Math.random() * 10),
    order: index,
  }));
};