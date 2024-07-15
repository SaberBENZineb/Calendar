import { Component, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LogInComponent {
  constructor(private router: Router,public authService:AuthService, private msgService:MessageService) { }

  async onSubmit(loginForm: NgForm) {
      if (loginForm.valid) {
          const user={
            email:loginForm.value.email,
            password:loginForm.value.password,
          }
          console.log(user);
          await this.authService.login(user).subscribe({
            next: (response: any) => {
              console.log("response:",response);
              if (response && response.token) {
                this.authService.store(response.token,response.message);
                this.router.navigate(['/calendar']);
              } else {
                this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Email or password is wrong' });
              }
            },
            error: () => {
              this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Email or password is wrong' });
            }
          });
      }
  }
}
