import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { CandleService } from "../services/candle.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Candle } from "../interfaces/candle";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: string;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Binance', weight: '21/06/2025', symbol: 'H' },
    { position: 2, name: 'CoinMake', weight: '21/06/2025', symbol: 'He' },

];

@Component({
    selector: "app-database",
    standalone: true,
    providers: [],
    imports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,


        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule
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
                    <!-- <button mat-raised-button class="demo-button">
                        Add data
                    </button> -->
                    <button
                        mat-flat-button
                        class="demo-button">
                        update data
                    </button>
                </div>
            </div>
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
    `],
})
export class DatabaseComponent implements OnInit {
    symbols: string[] = [];
    selectedSymbol: string | null = null;
    candles: Candle[] = [];

    #candleService = inject(CandleService);

    ngOnInit(): void {
        this.#candleService.listSymbols().subscribe({
            next: (symbols) => this.symbols = symbols,
            error: (err) => console.error('Erro ao carregar symbols:', err)
        });
    }
}