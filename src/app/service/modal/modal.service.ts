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
    console.log("modalData:"+JSON.stringify(data.event));
    this.modalRef = this.modal.open(content);
    if (this.modalRef.componentInstance) {
      this.modalRef.componentInstance.modalData = data;
    }
    return this.modalRef.result.then(
      (result) => {
        console.log('Modal closed with result:', result);
        return result;
      },
      (reason) => {
        if (!reason) {
          console.log('Modal dismissed with reason: clicked out of range');
        }else{
          console.log('Modal dismissed with reason:', reason);
        }
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
