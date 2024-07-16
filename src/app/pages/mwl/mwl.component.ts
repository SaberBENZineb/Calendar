import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ModalService } from 'src/app/service/modal/modal.service';
import {
  defaultEvent,
  mapServerResponseToAngularFormat,
  MyCalendarEvent,
  transformEventForServer,
} from '../../common/event';
import { EventService } from '../../service/event/event.service';
import { UserService } from '../../service/user/user.service';
@Component({
  selector: 'app-mwl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls:["./mwl.component.css"],
  templateUrl: './mwl.component.html',
  providers: [NgbActiveModal],
})
export class MwlComponent {
  @ViewChild('modalContent', { static: true }) modalContent:
    | TemplateRef<any>
    | undefined;

  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  modalData: { event: CalendarEvent } = { event: defaultEvent };

  refresh = new Subject<void>();

  private eventsSubject: BehaviorSubject<MyCalendarEvent[]> =
    new BehaviorSubject<MyCalendarEvent[]>([]);

  events: Observable<MyCalendarEvent[]> = this.eventsSubject.asObservable();

  activeDayIsOpen: boolean = false;
  action: string = '';

  constructor(
    public modalService: ModalService,
    private eventService: EventService,
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.modalData = { event: defaultEvent };
  }

  selectedUser: string = 'All';
  usersArray: { name: string; code: string }[] = [{ name: 'All', code: 'All' }];

  async loadEvents(): Promise<void> {
    try {
      if (this.authService.getRole() === 'ADMIN') {
        this.userService.getUsers().subscribe((users: any) => {
          users.forEach((user: any) => {
            this.usersArray.push({ name: user.name, code: user.email });
          });
          let eventsArray: MyCalendarEvent[] = [];
          users.forEach((user: any) => {
            console.log(user.assignedEvents);
            user.assignedEvents.forEach((event: any) => {
              if (
                !eventsArray.some(
                  (existingEvent) => existingEvent.id === event.id
                )
              ) {
                eventsArray.push(mapServerResponseToAngularFormat(event));
              }
            });
          });
          console.log('events:', eventsArray);
          this.eventsSubject.next(eventsArray);
        });
      } else {
        this.eventService.getUserEvents().subscribe((events: any) => {
          let eventsArray: MyCalendarEvent[] = events.map((event: any) => {
            return mapServerResponseToAngularFormat(event);
          });
          console.log('events:', eventsArray);
          this.eventsSubject.next(eventsArray);
        });
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }

  onUserSelectionChange(selectedUser: { name: string; code: string }): void {
    try {
      console.log('selected User: ', selectedUser);
      let eventsArray: MyCalendarEvent[] = [];
      if (selectedUser.code === 'All') {
        this.userService.getUsers().subscribe((users: any) => {
          console.log('getUsers: ', users);
          users.forEach((user: any) => {
            user.assignedEvents.forEach((event: any) => {
              if (
                !eventsArray.some(
                  (existingEvent) => existingEvent.id === event.id
                )
              ) {
                eventsArray.push(mapServerResponseToAngularFormat(event));
              }
            });
          });
          console.log('eventsArray: ', eventsArray);
          this.eventsSubject.next(eventsArray);
        });
      } else {
        this.userService
          .getUserEventsByEmail(selectedUser.code)
          .subscribe((events: any) => {
            console.log('getUserEvents: ', events);
            eventsArray = events.map((event: any) => {
              return mapServerResponseToAngularFormat(event);
            });
            console.log('events:', eventsArray);
            this.eventsSubject.next(eventsArray);
          });
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.pipe(
      map((events) =>
        events.map((iEvent) => {
          if (iEvent === event) {
            return {
              ...event,
              start: newStart,
              end: newEnd,
            } as MyCalendarEvent;
          }
          return iEvent;
        })
      )
    );
    const updatedEvent = { ...event, start: newStart, end: newEnd };
    this.openModal(updatedEvent);
    console.log('dragging: ' + JSON.stringify(updatedEvent));
  }

  async openModal(event: CalendarEvent) {
    this.action = 'Update';
    this.modalData = { event };
    const result = await this.modalService.open(
      this.modalContent as TemplateRef<any>,
      this.modalData
    );
    this.handleClose(result);
  }

  handleClose(event: any) {
    if (this.isCalendarEvent(event)) {
      this.update(event);
    } else if (typeof event === 'number') {
      this.deleteEvent(event);
    }
  }

  isCalendarEvent(obj: any): obj is CalendarEvent {
    return obj && typeof obj.title === 'string';
  }

  async openAddModal(event: CalendarEvent) {
    this.action = 'Add';
    this.modalData = { event };
    const result = await this.modalService.open(
      this.modalContent as TemplateRef<any>,
      this.modalData
    );
    return result ? result : null;
  }

  selectedItems:any=[];
  
  receiveData(data: any) {
    this.selectedItems = data;
  }

  async addEvent() {
    const newEvent: MyCalendarEvent = { ...defaultEvent };
    const result = await this.openAddModal(newEvent);
    if (result) {
      let ServerEvent = transformEventForServer(result);
      this.eventService.saveEvent(ServerEvent).subscribe((response: any) => {
        newEvent.id = response.id;
        console.log('add:' + JSON.stringify(ServerEvent));
        if (this.authService.getRole()=="ADMIN" && this.selectedItems.length>0) {
          let emails: string[] = this.selectedItems.map((item: any) => item.item_id);
          console.log('emails ' + emails.toString());

          this.userService.assignEventToUsers(emails, newEvent?.id).subscribe((res:any)=>{
            console.log('Event assigned to users successfully ',res);
          });
          this.selectedItems=[];
        }
        
        this.eventsSubject.next([...this.eventsSubject.value, newEvent]);
      });
    }
    
  }

  async deleteEvent(eventId: number): Promise<void> {
    try {
      console.log('eventId: ' + eventId);
      if (this.authService.getRole()=="ADMIN") {
        this.eventService.deleteEventForAll(eventId).subscribe(async ()=>{
          this.events = this.events.pipe(
            map((events) => {
              return events.filter((e) => e.id !== eventId);
            })
          );
          this.eventsSubject.next(await firstValueFrom(this.events));
          this.refresh.next();
        });
      } else {
        this.eventService.deleteEvent(eventId).subscribe(async (res:any)=>{
          console.log("res "+JSON.stringify(res));
          this.events = this.events.pipe(
            map((events) => {
              return events.filter((e) => e.id !== eventId);
            })
          );
          this.refresh.next();
          this.eventsSubject.next(await firstValueFrom(this.events));
        });
      }
    } catch (error) {
      console.error('Error delete event:', error);
    }
  }

  async update(event: CalendarEvent) {
    this.events = this.events.pipe(
      map((events) => {
        return events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              start: event.start,
              end: event.end,
              title: event.title,
              color: event.color,
            } as MyCalendarEvent;
          }
          return e;
        });
      })
    );

    const updatedEvent = await firstValueFrom(this.events.pipe(
      map(events => events.find(e => e.id === event.id)),
    ));

    if (updatedEvent) {
      const serverEventData = transformEventForServer(updatedEvent);
      this.eventService.updateEvent(serverEventData).subscribe((response:any)=>{
        console.log("updated successfully: ",response);
        if (this.authService.getRole()=="ADMIN" && this.selectedItems.length>0) {
          let emails: string[] = this.selectedItems.map((item: any) => item.item_id);
          console.log('emails ' + emails.toString());
          this.userService.assignEventToUsers(emails, event?.id).subscribe((res:any)=>{
            console.log('Event assigned to users successfully ',res);
          });
        }
        this.events.subscribe();
      });
    }
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
