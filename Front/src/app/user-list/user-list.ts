import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur.service';
import { Utilisateur } from '../models/utilisateur';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './user-list.html',
    styleUrls: ['./user.list.css']
})
export class UserList implements OnInit {
    users: Utilisateur[] = [];
    loading = false;
    error: string | null = null;

    constructor(
        private userService: UtilisateurService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.error = null;
        this.userService.getAll().subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur chargement utilisateurs:', err);
                this.error = 'Impossible de charger les utilisateurs.';
                this.loading = false;
            }
        });
    }

    deleteUser(id?: string): void {
        if (!id) return;
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        this.userService.delete(id).subscribe({
            next: () => {
                this.loadUsers();
            },
            error: (err) => {
                console.error('Erreur suppression:', err);
                alert('Erreur lors de la suppression de l\'utilisateur.');
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/']);
    }
}