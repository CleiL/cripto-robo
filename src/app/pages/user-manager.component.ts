import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/user";

@Component({
    selector: "app-user-manager",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,

        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    providers: [],
    template: `
        <section class="user-manager">
            <h1>User Manager</h1>
            <p>Manage users, roles, and permissions here.</p>

            <mat-tab-group>
                <mat-tab label="Users">
                    <mat-card appearance="outlined">
                        <mat-card-header>
                            <mat-card-title>Users</mat-card-title>
                            <mat-card-subtitle>Manage user accounts</mat-card-subtitle>
                        </mat-card-header>
                        <mat-card-content>
                            <form [formGroup]="userForm">
                                <mat-form-field appearance="outline">
                                    <mat-label>Nome</mat-label>
                                    <input matInput formControlName="full_name"  [disabled]="!editingUser" />
                                </mat-form-field>
                                <mat-form-field appearance="outline">
                                    <mat-label>Telefone</mat-label>
                                    <input matInput formControlName="phone"  [disabled]="!editingUser" />
                                </mat-form-field>
                                <mat-form-field appearance="outline">
                                    <mat-label>E-mail</mat-label>
                                    <input matInput formControlName="email"  [disabled]="!editingUser" />
                                </mat-form-field>
                            </form>
                        </mat-card-content>
                        <mat-card-actions>
                            <ng-container *ngIf="editingUser; else editUserBtn">
                                <button mat-flat-button color="primary" (click)="onSaveUser()">Salvar</button>
                                <button mat-stroked-button (click)="onCancel()">Cancelar</button>
                            </ng-container>
                            <ng-template #editUserBtn>
                                <button mat-flat-button color="accent"  (click)="enableUserForm()">Editar</button>
                            </ng-template>
                        </mat-card-actions>
                    </mat-card>
                </mat-tab>
                <mat-tab label="Connections">
                    <mat-card appearance="outlined">
                        <mat-card-header>
                            <mat-card-title>Connections</mat-card-title>
                            <mat-card-subtitle>Manage connections</mat-card-subtitle>
                        </mat-card-header>
                        <mat-card-content>
                            <form [formGroup]="connectionForm">
                                <mat-form-field appearance="outline">
                                    <mat-label>API Key</mat-label>
                                    <input matInput formControlName="api_key" [disabled]="!editingConnection"/>
                                </mat-form-field>
                                <mat-form-field appearance="outline">
                                    <mat-label>Secret Key</mat-label>
                                    <input matInput formControlName="api_secret" [disabled]="!editingConnection"/>
                                </mat-form-field>
                            </form>
                        </mat-card-content>
                        <mat-card-actions>
                            <ng-container *ngIf="editingConnection; else editConnectionBtn">
                                <button mat-flat-button color="primary" (click)="onSaveConnections()">Salvar</button>
                                <button mat-stroked-button (click)="onCancel()">Cancelar</button>
                            </ng-container>
                            <ng-template #editConnectionBtn>
                                <button mat-flat-button color="accent"  (click)="enableConnectionForm()">Editar</button>
                            </ng-template>
                        </mat-card-actions>
                    </mat-card>
                </mat-tab>
                <mat-tab label="Security">
                    <mat-card appearance="outlined">
                        <mat-card-header>
                            <mat-card-title>Security</mat-card-title>
                            <mat-card-subtitle>Manage Security</mat-card-subtitle>
                        </mat-card-header>
                        <mat-card-content>
                            <form [formGroup]="securityForm">
                                <mat-form-field appearance="outline">
                                    <mat-label>Senha</mat-label>
                                    <input matInput type="password" formControlName="password"  [disabled]="!editingSecurity" />
                                </mat-form-field>
                            </form>
                        </mat-card-content>
                        <mat-card-actions>
                            <ng-container *ngIf="editingSecurity; else editSecurityBtn">
                                <button mat-flat-button color="primary" (click)="onSavePassword()">Salvar</button>
                                <button mat-stroked-button (click)="onCancel()">Cancelar</button>
                            </ng-container>
                            <ng-template #editSecurityBtn>
                                <button mat-flat-button color="accent"  (click)="enableSecurityForm()">Editar</button>
                            </ng-template>
                        </mat-card-actions>
                    </mat-card>
                </mat-tab>    
            </mat-tab-group>
        </section>
    `,
    styles: [`
        .user-manager {
            margin: 1rem;

            mat-card {
                margin-top: 1rem;
            }

            mat-card-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: flex-end;
            }

            mat-form-field {
                width: 100%;
                margin-bottom: 1rem;
            }
        }

    `]
})

export class UserManagerComponent implements OnInit {
    userForm!: FormGroup;
    connectionForm!: FormGroup;
    securityForm!: FormGroup;
    loading = false;
    editingUser = false;
    editingConnection = false;
    editingSecurity = false;


    #fb = inject(FormBuilder);
    #userService = inject(UserService);

    ngOnInit() {
        this.userForm = this.#fb.group({
            full_name: [{ value: '', disabled: true }, Validators.required],
            phone: [{ value: '', disabled: true },],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],

        });

        this.connectionForm = this.#fb.group({
            api_key: [{ value: '', disabled: true }],
            api_secret: [{ value: '', disabled: true }]
        });

        this.securityForm = this.#fb.group({
            password: [{ value: '*****************', disabled: true }, [Validators.required, Validators.minLength(8)]]
        });

        this.loadUser();

        this.#userService.getBinance().subscribe({
            next: (binance) => {
                this.connectionForm.patchValue(binance);
            },
            error: () => {
                console.warn('Não foi possível carregar as conexões Binance.');
            }
        });
    }

    loadUser() {
        this.loading = true;
        this.#userService.getUser().subscribe({
            next: (user) => {
                this.userForm.patchValue(user);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onSaveUser() {
        if (this.userForm.invalid) return;

        this.#userService.updateUser(this.userForm.value).subscribe({
            next: (res) => {
                alert('Dados atualizados com sucesso!');
                this.editingUser = false;
                this.userForm.patchValue(res);
                this.userForm.reset();
                this.userForm.disable();
            },
            error: () => alert('Erro ao atualizar dados do usuário.')
        });
    }

    onSavePassword() {
        if (this.securityForm.invalid) return;

        const payload = this.securityForm.value;

        this.#userService.updateUser(payload as Partial<IUser>).subscribe({
            next: () => {
                alert('Senha atualizada com sucesso!');
                this.editingSecurity = false;
                this.securityForm.reset();
                this.securityForm.disable();
            },
            error: () => alert('Erro ao atualizar a senha.')
        });
    }

    onSaveConnections() {
        if (this.connectionForm.invalid) return;

        const payload = this.connectionForm.value;

        this.#userService.updateBinance(payload).subscribe({
            next: () => {
                alert('Conexões atualizadas com sucesso!');
                this.editingConnection = false;
                this.connectionForm.reset();
                this.connectionForm.disable();
            },
            error: () => alert('Erro ao atualizar conexões.')
        });
    }


    enableUserForm() {
        this.editingUser = true;
        this.userForm.enable();
    }

    enableConnectionForm() {
        this.editingConnection = true;
        this.connectionForm.enable();
    }

    enableSecurityForm() {
        this.editingSecurity = true;
        this.securityForm.enable();
    }

    disableAllForms() {
        this.editingUser = false;
        this.editingConnection = false;
        this.editingSecurity = false;

        this.userForm.disable();
        this.connectionForm.disable();
        this.securityForm.disable();
    }

    onCancel() {
        this.disableAllForms();
        this.loadUser();
    }

}