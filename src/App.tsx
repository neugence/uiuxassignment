import React from 'react';
import './App.css';
import TaskManager from "./components/TaskManager";
import MembersTimeline from "./components/Timeline/MembersTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";


function App() {
  return (
    <main className="min-h-screen">
      <Tabs defaultValue="board" className="w-full">
        <div className="border-b">
          <div className="px-4">
            <TabsList className="h-10">
              <TabsTrigger value="board" className="data-[state=active]:bg-background">
                Board
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-background">
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="board" className="m-0">
          <TaskManager />
        </TabsContent>

        <TabsContent value="timeline" className="m-0">
              <MembersTimeline />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default App;
