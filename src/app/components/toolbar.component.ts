import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../services/auth.service";

@Component({
    selector: "app-toolbar",
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,

        MatToolbarModule,
        MatButtonModule,
        MatIconModule
    ],
    providers: [],
    template: `
        <mat-toolbar>
            <button mat-icon-button [routerLink]="['/home']">
                <mat-icon>menu</mat-icon>
            </button>
            <span>My App</span>
            <span class="example-spacer"></span>
            <div class="menu-spacer">
                <button mat-mini-fab [routerLink]="['/analysys']">
                    <mat-icon>analytics</mat-icon>
                </button>
                <button mat-mini-fab [routerLink]="['/alocation']">
                    <mat-icon>hub</mat-icon>
                </button>
                <button mat-mini-fab [routerLink]="['/backtest']">
                    <mat-icon>data_exploration</mat-icon>
                </button>
                <button mat-mini-fab [routerLink]="['/billet']">
                    <mat-icon>wallet</mat-icon>
                </button>
                <button mat-mini-fab [routerLink]="['/classification']">
                    <mat-icon>bubble_chart</mat-icon>
                </button>
                <button mat-mini-fab [routerLink]="['/home/database']">
                    <mat-icon class="material-symbols-outlined">database</mat-icon>
                </button>
            </div>
            <span class="example-spacer"></span>
            <div class="menu-spacer">
                <button mat-mini-fab [routerLink]="['/home/user-manager']">
                    <mat-icon class="material-symbols-outlined">account_circle</mat-icon>
                </button>
                <button mat-mini-fab>
                    <mat-icon>notifications</mat-icon>
                </button>
                <button mat-mini-fab (click)="logout()">
                    <mat-icon>logout</mat-icon>
                </button>
            </div>
        </mat-toolbar>
    `,
    styles: [`
        .example-spacer {
            flex: 1 1 auto;
        }
        .menu-spacer,  {
            display: flex;
            gap: 0.5rem;
        }

    `]
})

export class ToolbarComponent {
    readonly authService = inject(AuthService);
    readonly router = inject(Router);

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}