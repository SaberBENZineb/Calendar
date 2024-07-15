import { EventColor } from 'calendar-utils';
import { endOfDay } from 'date-fns';

export interface MyCalendarEvent {
  id:number,
  start: Date,
  end: Date,
  title: string,
  color: EventColor,
  draggable: boolean,
  resizable: {
    beforeStart: boolean,
    afterEnd: boolean,
  },
  allDay:boolean
}

export function mapServerResponseToAngularFormat(serverResponse: any): MyCalendarEvent {
  return {
    id: serverResponse.id,
    start: new Date(serverResponse.start),
    end: new Date(serverResponse.end),
    title: serverResponse.title,
    color: {
      primary: serverResponse.primaryColor ?? '#ad2121',
      secondary: serverResponse.secondaryColor ?? '#FAE3E3',
      secondaryText:serverResponse.textColor ?? '#1e90ff',
    },
    allDay:false,
    draggable: true,
    resizable: {
      beforeStart: true,
      afterEnd: true
    }
  };
}

export function transformEventForServer(event: MyCalendarEvent): any {
  return {
    id: event.id,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    title: event.title,
    primaryColor: event.color.primary,
    secondaryColor: event.color.secondary,
    textColor: event.color.secondaryText
  };
}

export const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
    secondaryText: '#1e90ff'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
    secondaryText: '#1e90ff'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
    secondaryText: '#1e90ff'
  },
};
export const defaultEvent={
  id: 0,
  title: 'New event',
  start: new Date(),
  end: endOfDay(new Date()),
  color: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
    secondaryText: '#1e90ff'
  },
  draggable: true,
  resizable: {
    beforeStart: true,
    afterEnd: true,
  },
  allDay:false,
};
export const basicDefaultEvent={
  id: 0,
  title: 'New event',
  start: new Date(),
  end: endOfDay(new Date()),
  color: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
    secondaryText: '#1e90ff'
  }
}