import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { Store } from '@ngxs/store';
import { Login } from '../store/auth.state';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css'],
})
export class LoginFormComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private favoritesService: FavoritesService,
    private store: Store,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.store.dispatch(new Login(this.email, this.password)).subscribe({
      next: () => {
        const username = this.email.split('@')[0];
        this.favoritesService.setCurrentUser(username);
        this.router.navigate(['/pollutions']);
      },
      error: (err) => {
        this.errorMessage = 'Email ou mot de passe incorrect';
        console.error('Erreur de connexion:', err);
      },
    });
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
