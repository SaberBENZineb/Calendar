import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';
import { LogInComponent } from './pages/log-in/log-in.component';
import { MwlComponent } from './pages/mwl/mwl.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'calendar', component: MwlComponent,canActivate:[authGuard]},
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '**', redirectTo: 'login' }
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0]
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
