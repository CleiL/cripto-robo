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
        MatSortModule
    ],
    template: `
        <section class="database-section">
            <h1>Database Management</h1>
            <p>This section is dedicated to managing and interacting with the database.</p>
            <div class="button-container">
                <mat-form-field appearance="outline" class="demo-full-width">
                <mat-label>Select</mat-label>
                    <mat-select [(ngModel)]="selectedSymbol">
                        <mat-option *ngFor="let s of symbols" [value]="s">{{ s }}</mat-option>
                    </mat-select>
                </mat-form-field>
                <div class="button-container-buttons">
                    <button mat-raised-button (click)="loadCandles()">
                        search symbol
                    </button>
                    <button
                        mat-flat-button >
                        update symbols
                    </button>
                </div>
            </div>
            <div class="table-container">
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
            </div>
            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of users"></mat-paginator>
        </section>
    `,
    styles: [`
        .database-section {
            margin: 1rem;
        }
        .button-container {
            margin: 1rem;
            display: flex;
            aligin-items: center;
            justify-content: space-around;

            .button-container-buttons {
                display: flex;
                gap: 1rem;
            }
        }

        .table-container {
        max-height: 400px; /* ou a altura que desejar */
        overflow-y: auto;
        }

        table {
        width: 100%;
        border-collapse: collapse;
        }

        table thead th {
        position: sticky;
        top: 0;
        background: #1a1a1a; /* fundo escuro ou da sua paleta */
        z-index: 1;
        }

        mat-row:hover {
        background-color: rgba(124, 77, 255, 0.1); /* roxo leve */
        }

        
    `],
})
export class DatabaseComponent implements OnInit {
    symbols: string[] = [];
    selectedSymbol: string | null = null;
    dataSource = new MatTableDataSource<Candle>([]);
    displayedColumns: string[] = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];

    #candleService = inject(CandleService);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.#candleService.listSymbols().subscribe({
            next: (symbols) => this.symbols = symbols,
            error: (err) => console.error('Erro ao carregar symbols:', err)
        });
    }

    loadCandles(): void {
        if (!this.selectedSymbol) return;

        this.#candleService.listBySymbol(this.selectedSymbol).subscribe({
            next: (data) => {
                this.dataSource.data = data;
            },
            error: (err) => console.error('Erro ao buscar candles:', err)
        });
    }

}