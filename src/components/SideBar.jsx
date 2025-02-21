import React, { useState, useCallback, useMemo } from "react";
import {
  AlarmClockCheck,
  CalendarFold,
  CheckCheck,
  ChevronsUp,
  LandPlot,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";

const iconColors = {
  Backlog: "text-black",
  Completed: "text-green-500",
  ToDo: "text-red-500",
  InProgress: "text-blue-500",
  All: "text-yellow-500",
};

export function AppSidebar({ onSectionSelect }) {
  const [activeSection, setActiveSection] = useState(null);

  const items = useMemo(
    () => [
      {
        title: "All",
        url: "#",
        icon: LandPlot,
        color: iconColors.All,
      },
      {
        title: "To Do",
        url: "#",
        icon: AlarmClockCheck,
        color: iconColors.ToDo,
      },
      {
        title: "In Progress",
        url: "#",
        icon: ChevronsUp,
        color: iconColors.InProgress,
      },
      {
        title: "Completed",
        url: "#",
        icon: CheckCheck,
        color: iconColors.Completed,
      },
      {
        title: "Backlog",
        url: "#",
        icon: CalendarFold,
        color: iconColors.Backlog,
      },
    ],
    []
  );

  const handleSectionClick = useCallback(
    (section) => {
      setActiveSection(section);
      onSectionSelect(section);
      console.log(section);
    },
    [onSectionSelect]
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  onClick={() => handleSectionClick(item.title)}
                  className={`${
                    activeSection === item.title ? "bg-gray-200" : ""
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
