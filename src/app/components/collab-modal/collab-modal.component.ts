import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollabModalService } from 'src/app/service/collabModal/collab-modal.service';
import { EventService } from 'src/app/service/event/event.service';

@Component({
  selector: 'app-collab-modal',
  templateUrl: './collab-modal.component.html',
  styleUrls: ['./collab-modal.component.css'],
})
export class CollabModalComponent {

  private usersSubject: BehaviorSubject<any[]> =
    new BehaviorSubject<any[]>([]);

  users: Observable<any[]> = this.usersSubject.asObservable();

  @Input() modalData: any;

  constructor(
    private eventService: EventService,
    public collab: CollabModalService
  ) {}

  ngOnInit() {
    this.eventService
      .getEventUsers(this.modalData.event.id)
      .subscribe((users) => {
        this.usersSubject.next(users ?? []);
      });
  }

  unassign(userId: number, eventId: number): void {
    this.eventService.unassign(userId, eventId).subscribe(() => {
      this.usersSubject.next(
        this.usersSubject.value.filter(user => user.id !== userId)
      );
    });
  }
}
