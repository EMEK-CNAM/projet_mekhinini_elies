import { Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form';
import { RegisterFormComponent } from './register-form/register-form';
import { PollutionList } from './pollution-list/pollution-list';
import { PollutionDetail } from './pollution-detail/pollution-detail';
import { PollutionForm } from './pollution-form/pollution-form';
import { UserList } from './user-list/user-list';
import { Favorites } from './favorites/favorites';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'pollutions', component: PollutionList, canActivate: [authGuard] },
  { path: 'pollutions/new', component: PollutionForm, canActivate: [authGuard] },
  { path: 'pollutions/:id/edit', component: PollutionForm, canActivate: [authGuard] },
  { path: 'pollutions/:id', component: PollutionDetail, canActivate: [authGuard] },
  { path: 'users', component: UserList, canActivate: [authGuard] },
  { path: 'favorites', component: Favorites, canActivate: [authGuard] },
  { path: '', redirectTo: '/pollutions', pathMatch: 'full' },
  { path: '**', redirectTo: '/pollutions' },
];
