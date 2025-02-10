import React from 'react'
import { TimelineItem } from './types'

interface ItemRendererProps {
  item: TimelineItem;
  itemContext: {
    selected: boolean;
    dragging: boolean;
    resizing: boolean;
    dimensions: { height: number };
    useResizeHandle: boolean;
    title: string;
  };
  getItemProps: (props: any) => any;
  getResizeProps: () => { left: any; right: any };
}

const itemRender: React.FC<ItemRendererProps> = ({item, itemContext, getItemProps, getResizeProps}) => {
  const {left: leftResizeProps, right: rightResizeProps} = getResizeProps()
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return '!bg-[#4897D8]'
      case 'in-progress': return '!bg-[#D88948]'
      case 'paused': return '!bg-[#FA6E59]'
      case 'completed': return '!bg-[#429970]'
      case 'general-info': return '!bg-[#59E5FA]'
      default: return '!bg-[#2196F3]'
    }
  }

  const baseClasses = 'rounded relative overflow-hidden shadow-md'
  const borderClasses = itemContext.selected 
    ? 'border border-dashed' 
    : 'border border-solid'
  const colorClasses = getStatusColor(item.group.toString())
  const resizingClasses = itemContext.resizing 
    ? 'border-red-500' 
    : 'border-[#1A6FB3]'

  const itemProps = getItemProps({
    className: `${baseClasses} ${borderClasses} ${colorClasses} ${resizingClasses}`,
    onMouseDown: () => {
      console.log('on item click', item)
    }
  })

  const { key, ...itemPropsWithoutKey } = itemProps

  return (
    <div key={item.id} {...itemPropsWithoutKey}>
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

      <div
        className="h-full overflow-hidden pl-3 truncate text-base ml-4 text-white relative z-10"
        style={{ height: itemContext.dimensions.height }}
      >
        {itemContext.title}
      </div>

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      
      <div className="absolute inset-0 pointer-events-none z-0 active:scale-0 active:opacity-20 active:transition-none" />
    </div>
  )
}

export default itemRender