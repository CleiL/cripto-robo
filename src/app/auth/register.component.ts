import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormsModule, Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
    selector: 'app-register',
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
                <mat-card-title>Register</mat-card-title>
                <mat-card-subtitle>Create a new account</mat-card-subtitle>
                <mat-card-subtitle>
                    return to <a [routerLink]="['/login']">login</a>
                </mat-card-subtitle>
            </mat-card-header>
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
                <mat-card-content>
                    <mat-form-field appearance="outline">
                        <mat-label>Nome</mat-label>
                        <input matInput type="text" placeholder="Enter your name" formControlName="full_name"  required>
                    </mat-form-field>

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
                    <button mat-flat-button>Register</button>
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

            mat-card-header {
                text-align: center;
            }

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

export class RegisterComponent {
    registerForm!: FormGroup;
    submitted = false;

    #fb = inject(FormBuilder);
    #router = inject(Router);
    #authService = inject(AuthService);

    ngOnInit(): void {
        this.registerForm = this.#fb.group({
            full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        }); 
    }

    onRegister() {
        this.submitted = true;

        if (this.registerForm.invalid) return;

        const payload = this.registerForm.value;

        this.#authService.register(this.registerForm.value).subscribe({
            next: () => {
            alert('Registro concluído!');
            this.#router.navigate(['/home']);
            },
            error: err => {
            alert('Erro no registro: ' + err.error?.detail || 'Erro inesperado');
            }
        });
    }
}