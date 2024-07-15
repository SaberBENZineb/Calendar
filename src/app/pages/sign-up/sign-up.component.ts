import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/common/user';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private msgService: MessageService
  ) {}

  registerForm!: FormGroup;
  user: User = new User();
  clicked: boolean = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(4),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required],
        },
        { validator: this.passwordMatcher } as AbstractControlOptions
      ),
      number: '',
    });
  }

  onSubmit() {
    this.clicked = true;
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      const user = {
        name: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.passwordGroup.password,
        conformPassword: this.registerForm.value.passwordGroup.confirmPassword,
        number: this.registerForm.value.number,
      };
      console.log('user', user);
      this.authService.saveUser(user).subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response && response.token) {
            this.authService.store(response.token, response.message);
            this.router.navigate(['/calendar']);
          } else {
            this.msgService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Used Email',
            });
          }
        },
      });
    }
  }

  passwordMatcher(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }
}
