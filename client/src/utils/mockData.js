import { format } from "date-fns";

export const mockUsers = [
  { id: 1, name: "Karen Smith", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jake Wilson", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Brad Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Molly Brown", avatar: "https://i.pravatar.cc/150?img=4" },
];

const mockTitles = [
  "Project overview",
  "Company Roadmap",
  "Metrics and KPI",
  "UI kit update",
  "Blog post",
  "Communication plan",
  "Custom emoji",
  "API documentation",
  "Notifications",
  "Analytics Dashboard",
  "User Testing",
  "Performance Optimization",
];

const mockDescriptions = [
  "This task involves setting up a high-level overview of the project.",
  "Define short-term and long-term company goals and strategy.",
  "Analyze and improve key performance indicators.",
  "Ensure all UI components are updated to match the new brand identity.",
  "Prepare a detailed article covering our latest product release.",
  "Establish an effective communication strategy for the team.",
  "Introduce new custom emojis for better engagement in chat.",
  "Write and maintain clear API documentation for developers.",
  "Improve notifications to ensure better user engagement.",
  "Enhance the analytics dashboard with more insights.",
  "Conduct user testing to gather feedback on UI/UX.",
  "Optimize application performance for better efficiency.",
];

const mockTags = ["High", "Low", "Medium"];

export const generateMockTasks = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `task-${index + 1}`,
    title: mockTitles[index % mockTitles.length],
    description: mockDescriptions[index % mockDescriptions.length],
    status: [
      "General Information",
      "Backlog",
      "In progress",
      "Paused",
      "Ready for launch",
    ][Math.floor(Math.random() * 5)],
    assignees: [
      mockUsers[Math.floor(Math.random() * mockUsers.length)],
      mockUsers[Math.floor(Math.random() * mockUsers.length)],
    ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
    startDate: format(
      new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      ),
      "yyyy-MM-dd"
    ),
    endDate: format(
      new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      ),
      "yyyy-MM-dd"
    ),
    tags: Array.from(
      new Set(
        new Array(Math.floor(Math.random() * 3) + 1)
          .fill(null)
          .map(() => mockTags[Math.floor(Math.random() * mockTags.length)])
      )
    ), // Ensure unique tags
    comments: Math.floor(Math.random() * 5),
    views: Math.floor(Math.random() * 10),
    order: index,
  }));
};
