import { Moment } from 'moment';

export interface TimelineItem {
  id: number;
  group: number;
  title: string;
  className: string;
  start: Moment;
  end: Moment;
  canMove?: boolean;
  canResize?: boolean;
  canChangeGroup?: boolean;
  tip?: string;
  selectedBgColor?: string;
  bgColor?: string;
  color?: string;
}

export interface TimelineGroup {
  id: number;
  title: string;
  rightTitle: string;
}

export interface FormData {
  mentor: string;
  status: string;
  start: string;
  end: string;
} 