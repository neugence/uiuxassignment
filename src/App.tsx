import React from 'react';
import './App.css';
import TaskManager from "./components/TaskManager";
import MembersTimeline from "./components/Timeline/MembersTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import MaxWidthWrapper from './components/MaxWidthWrapper';

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const handleClearSearch = () => {
    setSearchTerm("")
    setFilterType("all")
  }

  return (
    <MaxWidthWrapper className="min-h-screen ">
    <main className="">
      <div className="border-b border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Task Management</h1>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 py-4">
            <TabsList className="h-10">
              <TabsTrigger value="board" className="data-[state=active]:bg-white/10 text-white">
                Board
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-white/10 text-white">
                Timeline
              </TabsTrigger>
            </TabsList>
            <div className="flex-1">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
                onClear={handleClearSearch}
              />
            </div>
          </div>
        </div>

        <TabsContent value="board" className="m-0">
          <TaskManager searchTerm={searchTerm} filterType={filterType} />
        </TabsContent>

        <TabsContent value="timeline" className="m-0">
          <MembersTimeline />
        </TabsContent>
      </Tabs>
    </main>
    </MaxWidthWrapper>
  );
}

export default App;
