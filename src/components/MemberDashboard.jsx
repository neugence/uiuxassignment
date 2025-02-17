import React, { useState, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';
import { UserCircle, Calendar, Clock, CheckCircle2, AlertCircle, Timer } from 'lucide-react';

export const MemberDashboard = () => {
  const { tasks } = useTaskStore();

  const getDueStatus = (endDate) => {
    if (!endDate) return { color: 'text-gray-400', icon: Timer, text: 'No due date' };
    
    const today = new Date();
    const dueDate = new Date(endDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: 'text-red-400', icon: AlertCircle, text: 'Overdue' };
    if (diffDays === 0) return { color: 'text-orange-400', icon: Clock, text: 'Due today' };
    if (diffDays <= 3) return { color: 'text-yellow-400', icon: Timer, text: `Due in ${diffDays} days` };
    return { color: 'text-emerald-400', icon: CheckCircle2, text: `Due in ${diffDays} days` };
  };

  const memberTasks = tasks.reduce((acc, task) => {
    const assignee = task.assignee || 'Unassigned';
    if (!acc[assignee]) acc[assignee] = [];
    acc[assignee].push(task);
    return acc;
  }, {});

  // Sort tasks by priority and due date
  Object.keys(memberTasks).forEach(member => {
    memberTasks[member].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(a.endDate) - new Date(b.endDate);
    });
  });

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gray-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Member Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Track tasks and deadlines by team member</p>
            </div>
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-gray-300">Total Tasks: </span>
              <span className="text-purple-400 font-semibold">{tasks.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(memberTasks).map(([member, tasks]) => (
              <div key={member} 
                className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="p-5 bg-gradient-to-r from-gray-800 to-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <UserCircle className="w-6 h-6 text-purple-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-200">{member}</h2>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                      {tasks.length} tasks
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {tasks.map(task => {
                    const dueStatus = getDueStatus(task.endDate);
                    const StatusIcon = dueStatus.icon;
                    
                    return (
                      <div key={task.id} 
                        className="group/task bg-gray-900/50 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-medium text-gray-300 line-clamp-2 group-hover/task:text-gray-200">
                            {task.title}
                          </h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <StatusIcon className={`w-4 h-4 ${dueStatus.color}`} />
                            <span className={`${dueStatus.color}`}>{dueStatus.text}</span>
                          </div>
                          {task.endDate && (
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(task.endDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};