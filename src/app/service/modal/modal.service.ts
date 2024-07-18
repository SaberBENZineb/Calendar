import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef: NgbModalRef | undefined;
  constructor(private modal: NgbModal) {}

  open(content: TemplateRef<any>, data: { event: CalendarEvent }): any {
    this.modalRef = this.modal.open(content);
    if (this.modalRef.componentInstance) {
      this.modalRef.componentInstance.modalData = data;
      this.modalRef.componentInstance.action = data.event ? 'Update' : 'Add';
    }

    return this.modalRef.result.then(
      (result) => {
        return result;
      }
    );
  }

  close(result?: any): void {
    if (this.modalRef) {
      this.modalRef.close(result);
    }
  }

  dismiss(reason?: any): void {
    if (this.modalRef) {
      this.modalRef.dismiss(reason);
    }
  }
}
