import { Component, inject, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        RouterModule,
        ReactiveFormsModule,
        FormsModule,

        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule
    ],
    providers: [],
    template: `
        <mat-card>
            <mat-card-header>
                <mat-card-title>Login</mat-card-title>
            </mat-card-header>
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                <mat-card-content>
                    <mat-form-field appearance="outline">
                        <mat-label>E-mail</mat-label>
                        <input matInput type="email" placeholder="Enter your email" formControlName="email" required>
                    </mat-form-field>
    
                    <mat-form-field appearance="outline">
                        <mat-label>Senha</mat-label>
                        <input matInput type="password" placeholder="Enter your password" formControlName="password" required>
                    </mat-form-field>
                </mat-card-content>
                <mat-card-actions>
                    <button mat-flat-button>Login</button>
                    <button mat-button type="button" [routerLink]="['/register']">Register</button>
                </mat-card-actions>
            </form>
        </mat-card>
    `,
    styles: [`
        mat-card {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5rem;

            mat-card-content {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            mat-form-field {
                width: 300px;
            }

            mat-card-actions {
                display: flex;
                justify-content: center;
                width: 100%;
                gap: 10px;
            }

        }
        
    `]

})

export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    submitted = false;

    #fb = inject(FormBuilder);
    #router = inject(Router);
    #authService = inject(AuthService);

    ngOnInit(): void {
        this.loginForm = this.#fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onLogin() {
        this.submitted = true;

        if (this.loginForm.invalid) return;

        const loginData = this.loginForm.value;

        this.#authService.login(loginData).subscribe({
            next: () => {
                this.#router.navigate(['/home']);
            },
            error: (err) => {
                console.error('Erro no login:', err);
            }
        });
    }
}