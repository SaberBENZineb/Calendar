import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MessageService } from 'primeng/api';
import { CalendarModule as primengCalenadarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollabModalComponent } from './components/collab-modal/collab-modal.component';
import { ModalComponent } from './components/modal/modal.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { MwlComponent } from './pages/mwl/mwl.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthInterceptor } from './service/interceptor/auth-interceptor.service';
@NgModule({
  declarations: [
    AppComponent,
    MwlComponent,
    SignUpComponent,
    LogInComponent,
    ModalComponent,
    CollabModalComponent,
  ],
  imports: [
    TableModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    NgMultiSelectDropDownModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    FormsModule,
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    primengCalenadarModule,
    ToastModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    MessageService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
