"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router";
import Header from "./Header";

export default function TaskDashboard() {
  const tasks = useSelector((state) => state.Tasks.tasks);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Get unique users (handling array of assignees)
  const users = [...new Set(tasks.flatMap((task) => task.assignee || ['No Assignee']))];
  
  // Get unique dates
  const dates = [...new Set(tasks.map((task) => new Date(task.startDate).toISOString().split("T")[0]))];
  console.log(tasks)
  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedUser ? (Array.isArray(task.assignee) ? task.assignee.some(user => user === selectedUser) : task.assignee === selectedUser) : true) &&
      (selectedDate ? new Date(task.startDate).toISOString().split("T")[0] === selectedDate : true) &&
      (selectedStatus ? task.status === selectedStatus : true)
    );
  });
 

  return (
    <div className="container mx-auto p-4">
      <Header page='Dashboard'/>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
       

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Date</InputLabel>
          <Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <MenuItem value="">All Dates</MenuItem>
            {dates.map((date) => (
              <MenuItem key={date} value={date}>{date}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="In_Progress">In Progress</MenuItem>
            <MenuItem value="Ready_for_Launch">Ready for Launch</MenuItem>
            <MenuItem value="Paused">Paused</MenuItem>
            <MenuItem value="General_Information">General Information</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>User</TableCell>
                {dates.map((date) => (
                  <TableCell key={date} className="whitespace-nowrap">{date}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user}>
                  <TableCell sx={{ fontWeight: "bold" }}>{user}</TableCell>
                  {dates.map((date) => {
                    const userTasks = filteredTasks.filter(
                      (task) => (Array.isArray(task.assignee) ? task.assignee.includes(user) : task.assignee === user) &&
                      new Date(task.startDate).toISOString().split("T")[0] === date
                    );
                    return (
                      <TableCell key={date} className="whitespace-nowrap">
                        {userTasks.length > 0 ? (
                          userTasks.map((task,index) => (
                            <div
                              key={index}
                              style={{
                                backgroundColor: getStatusColor(task.status),
                                color: "black",
                                padding: "6px",
                                borderRadius: "4px",
                                marginBottom: "4px",
                                textAlign: "center",
                              }}
                            >
                              {task.title}
                            </div>
                          ))
                        ) : (
                          <span style={{ color: "red" }}>-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

// Function to apply status-based colors
function getStatusColor(status) {
  const statusColors = {
    Backlog: "#FFEB99",
    In_Progress: "#A7F3D0",
    Ready_for_Launch: "#93C5FD",
    Paused: "#FCD34D",
    General_Information:'#D1D5DB'
  };
  return statusColors[status] || "#9e9e9e";
}
