import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CandleService } from "../services/candle.service";
import { Candle } from "../interfaces/candle";
import { CommonModule } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Signal } from "../interfaces/signal";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
    selector: "app-analytics",
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatCheckboxModule
    ],

    template: `
        <mat-card class="database-section">
            <mat-card-title>Moving Averages, RSI, Bollinger Bands</mat-card-title>
            <mat-card-subtitle>
                <span>Moving averages are used to smooth out price data by creating a constantly updated average price.</span>
            </mat-card-subtitle>
            <mat-card-header class="button-container-moving-averages">
                <div class="button-container-rsi">
                    <mat-form-field appearance="outline" >
                        <mat-label matTooltip="Tipo de análise">Type of Analysis</mat-label>
                        <mat-select [(ngModel)]="selectedPeriodBBType" (ngModelChange)="onPeriodTypeChange($event)">
                            <mat-option value="short">Short Term</mat-option>
                            <mat-option value="medium">Medium Term</mat-option>
                            <mat-option value="long">Long Term</mat-option>
                        </mat-select>
                    </mat-form-field>
    
                    <mat-form-field appearance="outline">
                        <mat-label>Data Range</mat-label>
                        <mat-date-range-input [rangePicker]="pickerBB">
                            <input matStartDate placeholder="Início" [(ngModel)]="startDateBB">
                            <input matEndDate placeholder="Fim" [(ngModel)]="endDateBB">
                        </mat-date-range-input>
                        <mat-datepicker-toggle matSuffix [for]="pickerBB"></mat-datepicker-toggle>
                        <mat-date-range-picker #pickerBB></mat-date-range-picker>
                    </mat-form-field>
                </div>

                <section *ngIf="selectedPeriodBBType">
                    <strong *ngIf="selectedPeriodBBType === 'short'">Short Term</strong>
                    <strong *ngIf="selectedPeriodBBType === 'medium'">Medium Term</strong>
                    <strong *ngIf="selectedPeriodBBType === 'long'">Long Term</strong>

                    <mat-form-field appearance="outline">
                        <mat-label>Symbol</mat-label>
                        <mat-select [(ngModel)]="selectedSymbolBB">
                            <mat-option *ngFor="let s of symbols" [value]="s">{{ s }}
                                
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Fast</mat-label>
                        <input matInput type="number" [(ngModel)]="fastPeriodBB">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Slow</mat-label>
                        <input matInput type="number" [(ngModel)]="slowPeriodBB">
                    </mat-form-field>
                </section>
                <section>

                    <mat-form-field appearance="outline">
                        <mat-label>Overbought (RSI &gt;)</mat-label>
                        <input matInput type="number" [(ngModel)]="rsiOverboughtBB" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Oversold (RSI &lt;)</mat-label>
                        <input matInput type="number" [(ngModel)]="rsiOversoldBB" />
                    </mat-form-field>

                </section>
                <section>
                    <button mat-flat-button color="primary"
                        [disabled]="!selectedSymbolBB || isLoadingMovingAverages"
                        (click)="calculateBollingerBands(selectedSymbolBB, fastPeriodBB, slowPeriodBB)">
                        <mat-spinner *ngIf="isLoadingMovingAverages" diameter="20"></mat-spinner>
                        <span *ngIf="!isLoadingMovingAverages">Calcular</span>
                    </button>

                    <mat-menu #columnMenu="matMenu">
                        <button mat-menu-item *ngFor="let col of allColumnsBB">
                            <mat-checkbox [(ngModel)]="col.visible">{{ col.label }}</mat-checkbox>
                        </button>
                    </mat-menu>

                    <button mat-icon-button [matMenuTriggerFor]="columnMenu" matTooltip="Colunas Visíveis">
                        <span class="material-symbols-outlined">
                            dataset
                        </span>
                    </button>
                </section>
            </mat-card-header>
            <mat-card-content class="table-container">
                <table mat-table [dataSource]="dataSourceMovingAvarageRSIBB" matSort class="mat-elevation-z8 full-width-table">
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

                    <!-- RSI Column -->
                    <ng-container matColumnDef="rsi">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> RSI </th>
                        <td mat-cell *matCellDef="let element"> {{ element.rsi | number }} </td>
                    </ng-container>

                    <!-- RSI Status Column -->
                    <ng-container matColumnDef="rsiStatus">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> RSI Status </th>
                        <td mat-cell *matCellDef="let element">
                            <span [ngClass]="{
                            'rsi-overbought': element.rsi > rsiOverboughtBB,
                            'rsi-oversold': element.rsi < rsiOversoldBB,
                            'rsi-neutral': element.rsi <= rsiOverboughtBB && element.rsi >= rsiOversoldBB
                            }">
                            {{
                                element.rsi > rsiOverboughtBB ? 'Overbought' :
                                element.rsi < rsiOversoldBB ? 'Oversold' :
                                'Neutral'
                            }}
                            </span>
                        </td>
                    </ng-container>

                    <!-- Bollinger Band Upper -->
                    <ng-container matColumnDef="bbUpper">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> BB Upper </th>
                        <td mat-cell *matCellDef="let element"> {{ element.bbUpper | number:'1.2-2' }} </td>
                    </ng-container>

                    <!-- Bollinger Band Lower -->
                    <ng-container matColumnDef="bbLower">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> BB Lower </th>
                        <td mat-cell *matCellDef="let element"> {{ element.bbLower | number:'1.2-2' }} </td>
                    </ng-container>

                    <ng-container matColumnDef="sinalCompra">
                    <th mat-header-cell *matHeaderCellDef>Compra</th>
                        <td mat-cell *matCellDef="let el">
                            <span *ngIf="el.sinalCompra">🟢</span>
                            <span *ngIf="!el.sinalCompra">-</span>
                        </td>
                    </ng-container>

                    <ng-container matColumnDef="sinalVenda">
                        <th mat-header-cell *matHeaderCellDef>Venda</th>
                        <td mat-cell *matCellDef="let el">
                            <span *ngIf="el.sinalVenda">🔴</span>
                            <span *ngIf="!el.sinalVenda">-</span>
                        </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumnsMovingAveragesRSIBB, sticky: true"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumnsMovingAveragesRSIBB;"></tr>

                </table>
                <mat-paginator #paginatorMovingAverageRSIBB [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page"></mat-paginator>
            </mat-card-content>
            <div class="graph-price-vol">
                <button mat-raised-button color="accent"
                    (click)="renderTechnicalChart(dataSourceMovingAvarageRSIBB.data, {
                    showMA: true, showRSI: true, showBB: true, showVolume: true,
                    title: 'MA + RSI + BB - ' + selectedSymbolBB
                    })"
                    [disabled]="!dataSourceMovingAvarageRSIBB.data.length">
                    🧠 Gráfico Técnico Completo
                </button>
            </div>
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

            .button-container-rsi {
                display: flex;
                gap: 1rem;   
                align-items: center;
                justify-content: center;                
            }

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

        .rsi-overbought {
            background-color: #c62828; /* vermelho */
            color: #fff;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }

        .rsi-oversold {
            background-color: #2e7d32; /* verde */
            color: #fff;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }

        .rsi-neutral {
            background-color: #e3f2fd; /* azul claro */
            color: #083a80;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }

        .graph-price-vol {
            margin-top: 1rem; 
            text-align: center;
        }

        .vol-chart {
            width: 100%;
            height: 100%; 
            margin-top: 1rem;
        }

        .chart-controls {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
            padding: 1rem 0;
        }
        .unified-chart {
            width: 100%;
            height: 700px;
        }
        .rsi-pending {
            background-color: #eeeeee;
            color: #616161;
            font-style: italic;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
        }
    `]
})

export class AnalyticsComponent implements OnInit {
    // Tabela de MA + RSI + BB
    symbols: string[] = [];
    selectedSymbolBB: string | null = null;
    startDateBB: Date | null = null;
    endDateBB: Date | null = null;
    selectedPeriodBBType: 'short' | 'medium' | 'long' | null = null;
    isLoadingMovingAverages = false;
    get displayedColumnsMovingAveragesRSIBB() {
        return this.allColumnsBB.filter(col => col.visible).map(col => col.key);
    }
    dataSourceMovingAvarageRSIBB = new MatTableDataSource<Candle>([]);
    fastPeriodBB: number = 1;
    slowPeriodBB: number = 1;
    rsiOverboughtBB: number = 70;
    rsiOversoldBB: number = 30;

    #candleService = inject(CandleService);
    #snackBar = inject(MatSnackBar);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('paginatorMovingAverageRSIBB') paginatorMovingAverageRSIBB!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('unifiedChart', { static: false }) unifiedChartRef!: ElementRef<HTMLDivElement>;


    ngAfterViewInit() {
        this.dataSourceMovingAvarageRSIBB.paginator = this.paginatorMovingAverageRSIBB;
        this.dataSourceMovingAvarageRSIBB.sort = this.sort;

    }

    allColumnsBB = [
        { key: 'timestamp', label: 'Date', visible: true },
        { key: 'open', label: 'Open', visible: true },
        { key: 'high', label: 'High', visible: true },
        { key: 'low', label: 'Low', visible: true },
        { key: 'close', label: 'Close', visible: true },
        { key: 'volume', label: 'Volume', visible: true },
        { key: 'mediumFast', label: 'Medium Fast', visible: true },
        { key: 'mediumSlow', label: 'Medium Slow', visible: true },
        { key: 'rsi', label: 'RSI', visible: true },
        { key: 'rsiStatus', label: 'RSI Status', visible: true },
        { key: 'bbUpper', label: 'BB Upper', visible: true },
        { key: 'bbLower', label: 'BB Lower', visible: true },
        { key: 'sinalCompra', label: 'Sinal Compra', visible: true },
        { key: 'sinalVenda', label: 'Sinal Venda', visible: true },

    ];

    onPeriodTypeChange(type: 'short' | 'medium' | 'long') {
        switch (type) {
            case 'short':
                this.fastPeriodBB = 5;
                this.slowPeriodBB = 10;
                break;
            case 'medium':
                this.fastPeriodBB = 20;
                this.slowPeriodBB = 50;
                break;
            case 'long':
                this.fastPeriodBB = 100;
                this.slowPeriodBB = 200;
                break;
        }
    }

    calculateBollingerBands(symbol: string | null, fast: number, slow: number): void {
        if (!symbol) return;
        this.isLoadingMovingAverages = true;

        if (fast <= 0 || slow <= 0) {
            this.#snackBar.open('Períodos devem ser maiores que zero.', 'Fechar', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        if (fast >= slow) {
            this.#snackBar.open('O período rápido deve ser menor que o lento.', 'Fechar', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        if (this.startDateBB && this.endDateBB && this.startDateBB > this.endDateBB) {
            this.#snackBar.open('Data inicial deve ser anterior à final.', 'Fechar', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        const start = this.startDateBB?.toISOString().split('T')[0];
        const end = this.endDateBB?.toISOString().split('T')[0];

        this.#candleService.getTechnicalAnalysis(
            symbol,
            fast,
            slow,
            start,
            end,
            this.rsiOverboughtBB,
            this.rsiOversoldBB
        ).subscribe({
            next: (data) => {
                this.dataSourceMovingAvarageRSIBB.data = data;
                this.#snackBar.open('Análise técnica completa carregada!', 'Fechar', { duration: 3000 });
            },
            error: (err) => {
                console.error('Erro ao carregar análise técnica:', err);
                this.#snackBar.open('Erro ao carregar análise técnica', 'Fechar', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingMovingAverages = false;
            }
        });

    }

    ngOnInit(): void {
        this.#candleService.listSymbols().subscribe({
            next: (symbols) => this.symbols = symbols,
            error: (err) => console.error('Error loading symbols:', err)
        });
    }

    renderTechnicalChart(data: Candle[], config: {
        showMA?: boolean,
        showRSI?: boolean,
        showBB?: boolean,
        showVolume?: boolean,
        title?: string
    }): void {
        if (!data.length) return;

        const timestamps = data.map(d => d.timestamp);
        const open = data.map(d => d.data.open);
        const high = data.map(d => d.data.high);
        const low = data.map(d => d.data.low);
        const close = data.map(d => d.data.close);
        const volume = data.map(d => d.data.volume);
        const maFast = data.map(d => d.mediumFast);
        const maSlow = data.map(d => d.mediumSlow);
        const bbUpper = data.map(d => d.bbUpper);
        const bbLower = data.map(d => d.bbLower);
        const rsi = data.map(d => d.rsi);

        const traces: any[] = [{
            x: timestamps, open, high, low, close,
            type: 'candlestick', name: 'Candles',
            xaxis: 'x', yaxis: 'y'
        }];

        if (config.showVolume) {
            traces.push({
                x: timestamps,
                y: volume,
                type: 'bar',
                name: 'Volume',
                marker: { color: '#9e9e9e' },
                xaxis: 'x',
                yaxis: 'y2'
            });
        }

        if (config.showMA) {
            traces.push({
                x: timestamps, y: maFast,
                type: 'scatter', mode: 'lines',
                name: 'MA Rápida', line: { color: '#2196f3' }
            });
            traces.push({
                x: timestamps, y: maSlow,
                type: 'scatter', mode: 'lines',
                name: 'MA Lenta', line: { color: '#673ab7' }
            });
        }

        if (config.showBB) {
            traces.push({
                x: timestamps, y: bbUpper,
                type: 'scatter', mode: 'lines',
                name: 'BB Superior', line: { color: '#f44336', dash: 'dot' }
            });
            traces.push({
                x: timestamps, y: bbLower,
                type: 'scatter', mode: 'lines',
                name: 'BB Inferior', line: { color: '#4caf50', dash: 'dot' }
            });
        }

        if (config.showRSI) {
            traces.push({
                x: timestamps, y: rsi,
                type: 'scatter', mode: 'lines',
                name: 'RSI', line: { color: '#ff9800' }, yaxis: 'y3'
            });
            traces.push({
                x: timestamps, y: Array(timestamps.length).fill(70),
                type: 'scatter', mode: 'lines',
                name: 'RSI 70', line: { color: '#c62828', dash: 'dot' },
                yaxis: 'y3', hoverinfo: 'skip'
            });
            traces.push({
                x: timestamps, y: Array(timestamps.length).fill(30),
                type: 'scatter', mode: 'lines',
                name: 'RSI 30', line: { color: '#2e7d32', dash: 'dot' },
                yaxis: 'y3', hoverinfo: 'skip'
            });
        }

        const layout: any = {
            title: config.title || 'Gráfico Técnico',
            height: 700,
            xaxis: {
                domain: [0, 1],
                type: 'date',
                title: 'Data',
                tickangle: -45,
                tickmode: 'auto',
                ticks: 'outside',
                tickformat: '%Y-%m-%d',
                tickfont: { size: 10 }
            },
            yaxis: { domain: [0.4, 1], title: 'Preço' },
            legend: { orientation: 'h' },
            dragmode: 'zoom',
            hovermode: 'x unified',
            margin: { t: 40, r: 30, b: 40, l: 60 },
            uirevision: true
        };

        if (config.showVolume) {
            layout.yaxis2 = { domain: [0.25, 0.39], title: 'Volume', showticklabels: true };
        }
        if (config.showRSI) {
            layout.yaxis3 = { domain: [0, 0.24], title: 'RSI', showticklabels: true };

            layout.shapes = [
                {
                    type: 'rect',
                    xref: 'paper',
                    yref: 'y3',
                    x0: 0,
                    x1: 1,
                    y0: 70,
                    y1: 100,
                    fillcolor: '#ffcdd2',
                    opacity: 0.3,
                    line: { width: 0 }
                },
                {
                    type: 'rect',
                    xref: 'paper',
                    yref: 'y3',
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 30,
                    fillcolor: '#c8e6c9',
                    opacity: 0.3,
                    line: { width: 0 }
                }
            ];
        }

        const plotlyConfig = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToAdd: ['zoom2d', 'pan2d', 'resetScale2d', 'toImage']
        };

        // Criação do gráfico em nova aba
        const win = window.open('', '_blank');
        if (!win) return;

        const htmlContent = `
                <html>
                <head>
                    <title>${layout.title}</title>
                    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
                </head>
                <body style="margin:0;padding:0">
                    <div id="plot" style="width:100%;height:100vh;"></div>
                    <script>
                    const traces = ${JSON.stringify(traces)};
                    const layout = ${JSON.stringify(layout)};
                    const config = ${JSON.stringify(plotlyConfig)};
                    Plotly.newPlot('plot', traces, layout, config);
                    </script>
                </body>
                </html>
            `;
        win.document.open();
        win.document.write(htmlContent);
        win.document.close();
    }


}