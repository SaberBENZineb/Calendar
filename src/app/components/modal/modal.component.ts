import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserService } from 'src/app/service/user/user.service';
import { ModalService } from '../../service/modal/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() modalData: any;
  @Input() action?: string;
  @Input() refresh: Subject<void> = new Subject<void>();

  @Output() selectedItemsChange = new EventEmitter<any[]>();
  selectedItems: any[] = [];

  constructor(
    public authService: AuthService,
    private userService: UserService,
    public modalService: ModalService
  ) {}

  endDateInvalid(): boolean | undefined {
    const { start, end } = this.modalData.event;
    return start && end && start >= end;
  }

  isEmtyTitle(): boolean | undefined{
    return this.modalData.event.title.length < 0;
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onSelectAll(items: any) {
    this.selectedItems = items;
    this.selectedItemsChange.emit(this.selectedItems);
  }

  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {};

  ngOnInit() {
    if (this.authService.getRole() == 'ADMIN') {
      this.userService.getUsers().subscribe((users) => {
        this.dropdownList = users.map((user: any) => ({
          item_id: user.email,
          item_text: user.name,
        }));
      });

      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 2,
        allowSearchFilter: true,
      };
    }
  }
  verifyAndClose():any{
    if (!this.isEmtyTitle() && !this.endDateInvalid()){
      this.modalService.close(this.modalData.event);
    }
  }
}
