import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pollution } from '../models/pollution';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PollutionService } from '../services/pollution.service';

@Component({
    selector: 'app-pollution-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './pollution-detail.html',
    styleUrls: ['./pollution-detail.css']
})
export class PollutionDetail implements OnInit {
    pollution?: Pollution;
    loading = true;
    errorMsg: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private svc: PollutionService,
        private router: Router
    ) { }

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        const id = idParam ? idParam : null;
        console.log('Chargement des détails pour la pollution avec ID :', id);
        if (!id) {
            this.errorMsg = 'Identifiant de pollution invalide.';
            this.loading = false;
            return;
        }

        this.svc.getById(id).subscribe({
            next: (p) => {
                this.pollution = p;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur lors du chargement :', err);
                this.errorMsg = 'Impossible de charger cette pollution.';
                this.loading = false;
            }
        });
    }

    edit() {
        if (this.pollution && this.pollution.id) {
            this.router.navigate(['/pollutions', this.pollution.id, 'edit']);
        }
    }

    back() {
        this.router.navigate(['/pollutions']);
    }
}
