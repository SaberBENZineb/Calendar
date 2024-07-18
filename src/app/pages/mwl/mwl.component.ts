import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { CollabModalService } from 'src/app/service/collabModal/collab-modal.service';
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
  encapsulation: ViewEncapsulation.None
})
export class MwlComponent {
  @ViewChild('modalContent', { static: true }) modalContent:
    | TemplateRef<any>
    | undefined;

  @ViewChild('collabContent', { static: true }) collabContent:
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

  actions:any[]=[];

  constructor(
    public modalService: ModalService,
    private eventService: EventService,
    public authService: AuthService,
    private userService: UserService,
    private collab:CollabModalService,
    private sanitizer: DomSanitizer,
  ) {
    this.initializeActions();
  }
  ngOnInit() {
    this.loadEvents();
    this.modalData = { event: defaultEvent };
  }


  initializeActions(): void {
    this.actions = [
      {
        label: this.sanitizer.bypassSecurityTrustHtml('<img src="assets/edit-1.svg" alt="edit" width="30" height="20">') as SafeHtml,
        a11yLabel: 'Edit',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.openModal(event);
        },
      },
      {
        label: this.sanitizer.bypassSecurityTrustHtml('<img src="assets/delete.svg" alt="delete" width="30" height="20">') as SafeHtml,
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: MyCalendarEvent }): void => {
          this.events.pipe(
            map(events => events.filter(iEvent => iEvent.id !== event.id))
          ).subscribe();
          this.deleteEvent(event.id);
        },
      }
    ];

    if (this.authService.getRole() === 'ADMIN') {
      this.actions.push({
        label: this.sanitizer.bypassSecurityTrustHtml('<img src="assets/collaborating.png" alt="collaborating-in-circle" width="30" height="30">') as SafeHtml,
        a11yLabel: 'Collaborating',
        onClick: ({ event }: { event: MyCalendarEvent }): void => {
          this.openCollabModal(event);
        },
      });
    }
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
            user.assignedEvents.forEach((event: any) => {
              if (
                !eventsArray.some(
                  (existingEvent) => existingEvent.id === event.id
                )
              ) {
                let Myevent:MyCalendarEvent=mapServerResponseToAngularFormat(event);
                Myevent.actions=this.actions
                eventsArray.push(Myevent);
              }
            });
          });
          this.eventsSubject.next(eventsArray);
        });
      } else {
        this.eventService.getUserEvents().subscribe((events: any) => {
          let eventsArray: MyCalendarEvent[] = events.map((event: any) => {
            let Myevent:MyCalendarEvent=mapServerResponseToAngularFormat(event);
            Myevent.actions=this.actions
            return Myevent
          });
          this.eventsSubject.next(eventsArray);
        });
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }

  onUserSelectionChange(selectedUser: { name: string; code: string }): void {
    try {
      let eventsArray: MyCalendarEvent[] = [];
      if (selectedUser.code === 'All') {
        this.userService.getUsers().subscribe((users: any) => {
          users.forEach((user: any) => {
            user.assignedEvents.forEach((event: any) => {
              if (
                !eventsArray.some(
                  (existingEvent) => existingEvent.id === event.id
                )
              ) {
                let Myevent:MyCalendarEvent=mapServerResponseToAngularFormat(event);
                Myevent.actions=this.actions
                eventsArray.push(Myevent);
              }
            });
          });
          this.eventsSubject.next(eventsArray);
        });
      } else {
        this.userService
          .getUserEventsByEmail(selectedUser.code)
          .subscribe((events: any) => {
            eventsArray = events.map((event: any) => {
              let Myevent:MyCalendarEvent=mapServerResponseToAngularFormat(event);
              Myevent.actions=this.actions
              return Myevent;
            });
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

        newEvent.actions = this.actions;
        this.eventsSubject.next([...this.eventsSubject.value, newEvent]);

        if (this.authService.getRole()=="ADMIN" && this.selectedItems.length>0) {
          let emails: string[] = this.selectedItems.map((item: any) => item.item_id);

          this.userService.assignEventToUsers(emails, newEvent?.id).subscribe();
        }
      });
    }
  }

  async deleteEvent(eventId: number): Promise<void> {
    try {
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
        this.eventService.deleteEvent(eventId).subscribe(async ()=>{
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
        if (this.authService.getRole()=="ADMIN" && this.selectedItems.length>0) {
          let emails: string[] = this.selectedItems.map((item: any) => item.item_id);
          this.userService.assignEventToUsers(emails, event?.id).subscribe((res:any)=>{
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

  async openCollabModal(event: CalendarEvent) {
    this.modalData = { event };
    await this.collab.open(
      this.collabContent as TemplateRef<any>,
      this.modalData
    );
  }
}
