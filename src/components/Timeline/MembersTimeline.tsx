import React, { useMemo } from 'react'
import moment from 'moment'
import Timeline, { TimelineMarkers, TodayMarker } from 'react-calendar-timeline'
import 'react-calendar-timeline/dist/style.css'
import './style.css'
import { useTaskStore } from '../../lib/store'
import SundaysMarker from './SundaysMarker'
import itemRender from './itemRender'

export default function MembersTimeline() {
  const tasks = useTaskStore((state) => state.tasks)
  const columns = useTaskStore((state) => state.columns)
  const updateTask = useTaskStore((state) => state.updateTask)

  // Convert columns to timeline groups
  const timelineGroups = useMemo(() => {
    return columns.map(column => ({
      id: column.id,
      title: column.title,
      rightTitle: column.title
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

  return (
    <div className="h-screen bg-white">
      <Timeline
        groups={timelineGroups}
        items={timelineItems}
        keys={{
          groupIdKey: 'id',
          groupTitleKey: 'title',
          groupRightTitleKey: 'rightTitle',
          itemIdKey: 'id',
          itemTitleKey: 'title',
          itemDivTitleKey: 'title',
          itemGroupKey: 'group',
          itemTimeStartKey: 'start',
          itemTimeEndKey: 'end'
        }}
        defaultTimeStart={moment().add(-15, 'day')}
        defaultTimeEnd={moment().add(45, 'day')}
        rightSidebarWidth={150}
        rightSidebarContent="Status"
        sidebarContent="Categories"
        lineHeight={50}
        itemRenderer={itemRender}
        canMove={true}
        canResize={'both'}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        stackItems
        itemHeightRatio={0.75}
        showCursorLine
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
