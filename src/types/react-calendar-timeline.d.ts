declare module 'react-calendar-timeline' {
  import { ComponentType, ReactNode } from 'react';
  
  export const TimelineMarkers: ComponentType<{
    children: ReactNode;
  }>;
  
  export const CustomMarker: ComponentType<{
    date: number;
    children: (props: { styles: any }) => ReactNode;
  }>;
  
  // Add other components as needed
}
