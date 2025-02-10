// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react'
import moment from 'moment'
import Timeline, { TimelineMarkers, TodayMarker } from 'react-calendar-timeline'
import 'react-calendar-timeline/dist/style.css'
import './timeline.css'
import './style.css'
import { useTaskStore } from '../../lib/store'
import SundaysMarker from './SundaysMarker'
import itemRender from './itemRender'

const formatDate = (date: moment.Moment) => {
  return date.format('MMM D'); // Format as "Feb 5" instead of full date
};

export default function MembersTimeline() {
  const tasks = useTaskStore((state) => state.tasks)
  const columns = useTaskStore((state) => state.columns)
  const updateTask = useTaskStore((state) => state.updateTask)

  // Convert columns to timeline groups
  const timelineGroups = useMemo(() => {
    return columns.map(column => ({
      id: column.id,
      title: column.title
    }))
  }, [columns])

  // Convert tasks to timeline items
  const timelineItems = useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      group: task.status,
      title: task.title,
      start: moment(task.startDate || new Date()),
      end: moment(task.endDate || moment().add(1, 'day')),
      className: task.status,
      bgColor: getColorForStatus(task.status),
      selectedBgColor: getColorForStatus(task.status),
      canMove: true,
      canResize: true,
      canChangeGroup: true
    }))
  }, [tasks])

  const handleItemMove = (itemId: string, dragTime: number, newGroupOrder: number) => {
    const task = tasks.find(t => t.id === itemId)
    if (!task) return

    const newStatus = timelineGroups[newGroupOrder].id
    const timeDiff = moment(task.endDate).diff(moment(task.startDate))
    
    updateTask(itemId, {
      ...task,
      status: newStatus,
      startDate: moment(dragTime).format('YYYY-MM-DD'),
      endDate: moment(dragTime).add(timeDiff, 'milliseconds').format('YYYY-MM-DD')
    })
  }

  const handleItemResize = (itemId: string, time: number, edge: string) => {
    const task = tasks.find(t => t.id === itemId)
    if (!task) return

    updateTask(itemId, {
      ...task,
      startDate: edge === 'left' ? moment(time).format('YYYY-MM-DD') : task.startDate,
      endDate: edge === 'left' ? task.endDate : moment(time).format('YYYY-MM-DD')
    })
  }

  // Add responsive sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(150);

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setSidebarWidth(80);
      } else if (window.innerWidth < 768) { // md breakpoint
        setSidebarWidth(100);
      } else {
        setSidebarWidth(150);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container mx-auto py-4 overflow-x-auto">
      <div className="rounded-lg bg-white min-w-[320px]">
        <Timeline
          groups={timelineGroups}
          items={timelineItems}
          keys={{
            groupIdKey: 'id',
            groupTitleKey: 'title',
            itemIdKey: 'id',
            itemTitleKey: 'title',
            itemDivTitleKey: 'title',
            itemGroupKey: 'group',
            itemTimeStartKey: 'start',
            itemTimeEndKey: 'end'
          }}
          defaultTimeStart={moment().add(-15, 'day')}
          defaultTimeEnd={moment().add(45, 'day')}
          minZoom={24 * 60 * 60 * 1000}
          maxZoom={365.24 * 86400 * 1000}
          timeSteps={{
            second: 0,
            minute: 0,
            hour: 0,
            day: 1,
            month: 1,
            year: 1
          }}
          formatLabel={formatDate}
          sidebarWidth={sidebarWidth}
          sidebarContent={window.innerWidth >= 640 ? "Categories" : ""}
          lineHeight={window.innerWidth < 640 ? 40 : 50}
          itemRenderer={itemRender}
          canMove={true}
          canResize={'both'}
          onItemMove={handleItemMove}
          onItemResize={handleItemResize}
          stackItems
          itemHeightRatio={window.innerWidth < 640 ? 0.85 : 0.75}
          showCursorLine
          className="timeline-component"
        >
          <TimelineMarkers>
            <TodayMarker>
              {({styles}) => (
                <div className="w-0.5 bg-red-500" style={styles} />
              )}
            </TodayMarker>
            <SundaysMarker />
          </TimelineMarkers>
        </Timeline>
      </div>
    </div>
  )
}

// Update color function to handle dynamic columns
function getColorForStatus(status: string): string {
  const baseColors = {
    'backlog': '#4897D8',
    'in-progress': '#D88948',
    'paused': '#FA6E59',
    'completed': '#429970',
    'general-info': '#59E5FA'
  }
  
  // If status doesn't have a predefined color, generate one based on the status string
  if (!baseColors[status]) {
    // Simple hash function to generate consistent colors for new columns
    let hash = 0;
    for (let i = 0; i < status.length; i++) {
      hash = status.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert hash to RGB color
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    
    return `rgb(${Math.abs(r)}, ${Math.abs(g)}, ${Math.abs(b)})`;
  }
  
  return baseColors[status];
}
