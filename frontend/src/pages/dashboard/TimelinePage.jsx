import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, CheckCircle, ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from 'axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, startOfYear, endOfYear, eachMonthOfInterval, differenceInDays } from 'date-fns';

const statusColors = {
  'General Information': 'bg-gray-200',
  'Backlog': 'bg-red-200',
  'In progress': 'bg-yellow-200',
  'Paused': 'bg-orange-200',
  'Ready for launch': 'bg-green-200'
};

const url = "https://task-manager-xnd1.onrender.com";  

export default function TimelinePage() {
  const [groupBy, setGroupBy] = useState('Member');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [timelineData, setTimelineData] = useState({ members: [] });

  // Calculate the total days in the current month
  const daysInMonth = differenceInDays(
    endOfMonth(new Date(year, month)),
    startOfMonth(new Date(year, month))
  ) + 1;

  const findRowPosition = (existingTasks, newTask) => {
    let row = 0;
    while (existingTasks.some(task => {
      const taskStart = (task.startPosition / task.totalDays) * 100;
      const taskEnd = ((task.startPosition + task.width) / task.totalDays) * 100;
      const newTaskStart = (newTask.startPosition / newTask.totalDays) * 100;
      const newTaskEnd = ((newTask.startPosition + newTask.width) / newTask.totalDays) * 100;
      return task.row === row && 
             !(taskEnd <= newTaskStart || taskStart >= newTaskEnd);
    })) {
      row++;
    }
    return row;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [tasksResponse, usersResponse] = await Promise.all([
          axios.get(`${url}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${url}/api/users/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const tasks = tasksResponse.data.tasks;
        const users = usersResponse.data;

        const monthStart = startOfMonth(new Date(year, month));
        const monthEnd = endOfMonth(new Date(year, month));

        const members = users.map(user => {
          const userTasks = tasks.filter(task => 
            Array.isArray(task.assignees) &&
            task.assignees.some(assignee => assignee._id?.toString() === user._id?.toString())
          );
          
          const processedTasks = [];
          
          userTasks.forEach(task => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            
            const startPosition = Math.max(0, differenceInDays(taskStart, monthStart));
            const endPosition = Math.min(daysInMonth, differenceInDays(taskEnd, monthStart) + 1);
            
            const processedTask = {
              title: task.title,
              parent: task.parent,
              status: task.status || 'Backlog',
              startPosition,
              width: endPosition - startPosition,
              totalDays: daysInMonth
            };
            
            // Find appropriate row position
            processedTask.row = findRowPosition(processedTasks, processedTask);
            processedTasks.push(processedTask);
          });
  
          return {
            name: user.name,
            avatar: user.avatar,
            tasks: processedTasks.filter(task => task.width > 0),
            maxRows: Math.max(1, Math.max(...processedTasks.map(t => t.row)) + 1)
          };
        });
  
        setTimelineData({ members });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [year, month, daysInMonth]);

  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year)),
    end: endOfYear(new Date(year))
  });

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-4 md:mt-20">
      {/* Header - Made responsive */}
      <div className="border-b">        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4">
            <Menu className="h-5 w-5 text-gray-500"/>
            <h1 className="text-xl font-semibold">Timeline</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Year:</span>
              <select
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - 5 + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Group by:</span>
              <button className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm">
                {groupBy}
                <ChevronDown className="h-4 w-4"/>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-gray-500"/>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector - Made scrollable on mobile */}
      <div className="overflow-x-auto">
        <div className="flex justify-start sm:justify-center gap-2 p-4 min-w-max">
          {months.map((monthDate, index) => (
            <button
              key={index}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${
                month === index ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setMonth(index)}
            >
              {format(monthDate, 'MMM')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Grid - Made scrollable */}
      <div className="p-4 overflow-x-auto">
        <div className="grid grid-cols-11 gap-4 min-w-[768px]">
          {/* Left column for names */}
          <div className="col-span-1">
            {timelineData.members.map((member, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2"
                style={{ height: `${Math.max(64, member.maxRows * 40)}px` }}
              >
                <div className="hidden sm:block">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 truncate">
                  {member.name}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline bars */}
          <div className="col-span-10">
            <div className="relative">
              {timelineData.members.map((member, memberIndex) => (
                <div 
                  key={memberIndex} 
                  className="relative"
                  style={{ height: `${Math.max(64, member.maxRows * 40)}px` }}
                >
                  {member.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`absolute ${statusColors[task.status]} rounded p-1 sm:p-2`}
                      style={{
                        left: `${(task.startPosition / daysInMonth) * 100}%`,
                        width: `${(task.width / daysInMonth) * 100}%`,
                        top: `${8 + task.row * 40}px`,
                        height: '32px',
                        minWidth: '20px'
                      }}
                    >
                      <div className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap overflow-hidden">
                        {task.status === 'review' || task.status === 'spec' || task.status === 'images' ? (
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"/>
                        ) : null}
                        <span className="truncate">{task.title}</span>
                        {task.parent && (
                          <>
                            <span className="text-gray-500 mx-1 hidden sm:inline">←</span>
                            <span className="text-gray-500 truncate hidden sm:inline">{task.parent}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}