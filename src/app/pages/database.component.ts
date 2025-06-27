import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { CandleService } from "../services/candle.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Candle } from "../interfaces/candle";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
@Component({
    selector: "app-database",
    standalone: true,
    providers: [],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatInputModule
    ],
    template: `
        <mat-card class="database-section">
            <mat-card-title>Database Management</mat-card-title>
            <mat-card-subtitle>This section is dedicated to managing and interacting with the database.</mat-card-subtitle>
            <mat-card-header class="button-container">
                <mat-form-field appearance="outline" class="demo-full-width">
                    <mat-label mat-label>Select</mat-label>
                    <mat-select [(ngModel)]="selectedSymbol">
                        <mat-option *ngFor="let s of symbols" [value]="s">{{ s }}</mat-option>
                    </mat-select>
                </mat-form-field>
                <div class="button-container-buttons">
                    <button mat-stroked-button 
                        matTooltip="Pesquisar Cripto"
                        [disabled]="!selectedSymbol || isLoadingSearch"
                        (click)="loadCandles()">
                        <mat-spinner *ngIf="isLoadingSearch" diameter="20"></mat-spinner>
                        <span *ngIf="!isLoadingSearch">search symbol</span>
                    </button>
                    <button
                        mat-flat-button 
                        matTooltip="Atualizar Dados Cripto" 
                        (click)="updateCandles()"
                        [disabled]="!selectedSymbol || isLoadingUpdate">
                        <mat-spinner *ngIf="isLoadingUpdate" diameter="20"></mat-spinner>
                        <span *ngIf="!isLoadingUpdate">update symbols</span>
                    </button>
                </div>
            </mat-card-header>
            <mat-card-content class="table-container">
                <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8 full-width-table">
                    <!-- Date Column -->
                    <ng-container matColumnDef="timestamp">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
                        <td mat-cell *matCellDef="let element"> {{ element.timestamp | date:'yyyy-MM-dd' }} </td>
                    </ng-container>

                    <!-- Open Column -->
                    <ng-container matColumnDef="open">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Open </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.open | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- High Column -->
                    <ng-container matColumnDef="high">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> High </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.high | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Low Column -->
                    <ng-container matColumnDef="low">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Low </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.low | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Close Column -->
                    <ng-container matColumnDef="close">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Close </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.close | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Volume Column -->
                    <ng-container matColumnDef="volume">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Volume </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.volume | number }} </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns, sticky: true"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

                </table>
                <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page"></mat-paginator>
            </mat-card-content>
        </mat-card>
            <mat-card class="database-section">
                <mat-card-title>Moving Averages</mat-card-title>
                <mat-card-subtitle>
                    <span>Moving averages are used to smooth out price data by creating a constantly updated average price.</span>
                </mat-card-subtitle>
                <mat-card-header class="button-container-moving-averages">

                    <mat-form-field appearance="outline" class="select-prazo">
                        <mat-label matTooltip="Tipo de análise">Type of Analysis</mat-label>
                        <mat-select [(ngModel)]="selectedPeriodType" (ngModelChange)="onPeriodTypeChange($event)">
                            <mat-option value="short">Short Term</mat-option>
                            <mat-option value="medium">Medium Term</mat-option>
                            <mat-option value="long">Long Term</mat-option>
                        </mat-select>
                    </mat-form-field>

                <section *ngIf="selectedPeriodType">
                    <strong *ngIf="selectedPeriodType === 'short'">Short Term</strong>
                    <strong *ngIf="selectedPeriodType === 'medium'">Medium Term</strong>
                    <strong *ngIf="selectedPeriodType === 'long'">Long Term</strong>

                    <mat-form-field appearance="outline">
                        <mat-label>Symbol</mat-label>
                        <mat-select [(ngModel)]="selectedSymbol">s
                            <mat-option *ngFor="let s of symbols" [value]="s">{{ s }}
                                
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Fast</mat-label>
                        <input matInput type="number" [(ngModel)]="fastPeriod">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Slow</mat-label>
                        <input matInput type="number" [(ngModel)]="slowPeriod">
                    </mat-form-field>

                    <button mat-flat-button color="primary"
                        [disabled]="!selectedSymbol || isLoadingMovingAverages"
                        (click)="calculateMovingAverages(selectedSymbol, fastPeriod, slowPeriod)">
                        <mat-spinner *ngIf="isLoadingMovingAverages" diameter="20"></mat-spinner>
                        <span *ngIf="!isLoadingMovingAverages">Calcular</span>
                    </button>
                </section>
            </mat-card-header>
            <mat-card-content class="table-container">
                <table mat-table [dataSource]="dataSourceMovingAvarage" matSort class="mat-elevation-z8 full-width-table">
                    <!-- Date Column -->
                    <ng-container matColumnDef="timestamp">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
                        <td mat-cell *matCellDef="let element"> {{ element.timestamp | date:'yyyy-MM-dd' }} </td>
                    </ng-container>

                    <!-- Open Column -->'
                    <ng-container matColumnDef="open">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Open </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.open | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- High Column -->
                    <ng-container matColumnDef="high">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> High </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.high | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Low Column -->
                    <ng-container matColumnDef="low">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Low </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.low | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Close Column -->
                    <ng-container matColumnDef="close">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Close </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.close | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Volume Column -->
                    <ng-container matColumnDef="volume">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Volume </th>
                        <td mat-cell *matCellDef="let element"> {{ element.data.volume | number }} </td>
                    </ng-container>

                    <!-- Medium Fast Column -->
                    <ng-container matColumnDef="mediumFast">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Medium Fast </th>
                        <td mat-cell *matCellDef="let element"> {{ element.mediumFast | number }} </td>
                    </ng-container>

                    <!-- Medium Slow Column -->
                    <ng-container matColumnDef="mediumSlow">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Medium Slow </th>
                        <td mat-cell *matCellDef="let element"> {{ element.mediumSlow | number }} </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumnsMovingAverages, sticky: true"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumnsMovingAverages;"></tr>

                </table>
                <mat-paginator #paginatorMovingAverage [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page"></mat-paginator>
            </mat-card-content>
        </mat-card>
    `,
    styles: [`
        .database-section {
            margin: 1rem;
            padding: 1rem;
        }
        .button-container {
            margin: 1rem;
            display: flex;
            
            gap: 1rem;
            align-items: center;
            justify-content: space-around;

            .button-container-buttons {
                display: flex;
                gap: 1rem;
            }

            .input-field {
                width: 120px;
            }
        }

        .button-container-moving-averages {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;

            section {
                display: flex;
                gap: 1rem;
                align-items: center;
                justify-content: center;
            }
        }

        .table-container {
            max-height: 500px;
            overflow-y: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        table thead th {
            position: sticky;
            top: 0;
            background: #1a1a1a;
            z-index: 1;
        }

        mat-row:hover {
            background-color: rgba(124, 77, 255, 0.1);
        }
        
    `],
})
export class DatabaseComponent implements OnInit {
    symbols: string[] = [];
    selectedSymbol: string | null = null;
    selectedSymbolMovingAverages: string | null = null;
    dataSource = new MatTableDataSource<Candle>([]);
    dataSourceMovingAvarage = new MatTableDataSource<Candle>([]);
    displayedColumns: string[] = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];
    displayedColumnsMovingAverages: string[] = ['timestamp', 'open', 'high', 'low', 'close', 'volume', 'mediumFast', 'mediumSlow'];

    isLoadingSearch = false;
    isLoadingUpdate = false;
    isLoadingMovingAverages = false;

    selectedSymbolFast: string | null = null;
    selectedSymbolMedium: string | null = null;
    selectedSymbolSlow: string | null = null;

    selectedPeriodType: 'short' | 'medium' | 'long' | null = null;
    fastPeriod: number = 1;
    slowPeriod: number = 1;


    #candleService = inject(CandleService);
    #snackBar = inject(MatSnackBar);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('paginatorMovingAverage') paginatorMovingAverage!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSourceMovingAvarage.paginator = this.paginatorMovingAverage;
        this.dataSourceMovingAvarage.sort = this.sort;
    }

    onPeriodTypeChange(type: 'short' | 'medium' | 'long') {
        switch (type) {
            case 'short':
                this.fastPeriod = 5;
                this.slowPeriod = 10;
                break;
            case 'medium':
                this.fastPeriod = 20;
                this.slowPeriod = 50;
                break;
            case 'long':
                this.fastPeriod = 100;
                this.slowPeriod = 200;
                break;
        }
    }

    ngOnInit(): void {
        this.#candleService.listSymbols().subscribe({
            next: (symbols) => this.symbols = symbols,
            error: (err) => console.error('Erro ao carregar symbols:', err)
        });
    }

    loadCandles(): void {
        if (!this.selectedSymbol) return;
        this.isLoadingSearch = true;

        this.#candleService.listBySymbol(this.selectedSymbol).subscribe({
            next: (data) => {
                this.dataSource.data = data;
                this.#snackBar.open(`Candle data for ${this.selectedSymbol} loaded successfully!`, 'Close', {
                    duration: 3000,
                });
            },
            error: (err) => {
                console.error('Erro ao buscar candles:', err);
                this.#snackBar.open('Erro ao buscar candles', 'Fechar', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingSearch = false;
            }
        });
    }

    updateCandles(): void {
        if (!this.selectedSymbol) return;
        this.isLoadingUpdate = true;

        this.#candleService.updateCandles(this.selectedSymbol).subscribe({
            next: (res) => {
                console.log(res.detail);
                this.#snackBar.open(`Candles for ${this.selectedSymbol} updated successfully!`, 'Close', {
                    duration: 3000,
                });
                this.loadCandles();
            },
            error: (err) => {
                console.error('Erro ao atualizar candles:', err);
                this.#snackBar.open('Erro ao atualizar candles', 'Fechar', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingUpdate = false;
            }
        });
    }

    calculateMovingAverages(symbol: string | null, fast: number, slow: number) {
        if (!symbol) return;
        this.isLoadingMovingAverages = true;

        this.#candleService.getWithMovingAverages(symbol, fast, slow).subscribe({
            next: (data) => {
                this.dataSourceMovingAvarage.data = data;
                this.#snackBar.open('Médias móveis calculadas com sucesso!', 'Fechar', { duration: 3000 });
            },
            error: (err) => {
                console.error('Erro ao calcular médias móveis:', err);
                this.#snackBar.open('Erro ao calcular médias móveis', 'Fechar', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingMovingAverages = false;
            }
        });
    }

}