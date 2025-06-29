import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import * as Plotly from 'plotly.js-dist-min';


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
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule
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
                <mat-form-field appearance="outline" class="demo-full-width">
                <mat-label>Data Range</mat-label>
                    <mat-date-range-input [rangePicker]="picker">
                        <input matStartDate placeholder="Início" [(ngModel)]="startDate">
                        <input matEndDate placeholder="Fim" [(ngModel)]="endDate">
                    </mat-date-range-input>
                    <mat-datepicker-toggle matSuffix [for]="picker">
                    </mat-datepicker-toggle>
                    <mat-date-range-picker #picker></mat-date-range-picker>
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

                    <mat-form-field appearance="outline">
                        <mat-label>Data Range</mat-label>
                        <mat-date-range-input [rangePicker]="pickerMA">
                            <input matStartDate placeholder="Início" [(ngModel)]="startDateMA">
                            <input matEndDate placeholder="Fim" [(ngModel)]="endDateMA">
                        </mat-date-range-input>
                        <mat-datepicker-toggle matSuffix [for]="pickerMA"></mat-datepicker-toggle>
                        <mat-date-range-picker #pickerMA></mat-date-range-picker>
                    </mat-form-field>

                <section *ngIf="selectedPeriodType">
                    <strong *ngIf="selectedPeriodType === 'short'">Short Term</strong>
                    <strong *ngIf="selectedPeriodType === 'medium'">Medium Term</strong>
                    <strong *ngIf="selectedPeriodType === 'long'">Long Term</strong>

                    <mat-form-field appearance="outline">
                        <mat-label>Symbol</mat-label>
                        <mat-select [(ngModel)]="selectedSymbolMA">
                            <mat-option *ngFor="let s of symbols" [value]="s">{{ s }}
                                
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Fast</mat-label>
                        <input matInput type="number" [(ngModel)]="fastPeriodMA">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Slow</mat-label>
                        <input matInput type="number" [(ngModel)]="slowPeriodMA">
                    </mat-form-field>

                    <button mat-flat-button color="primary"
                        [disabled]="!selectedSymbolMA || isLoadingMovingAverages"
                        (click)="calculateMovingAverages(selectedSymbolMA, fastPeriodMA, slowPeriodMA)">
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
        <mat-card class="database-section">
            <mat-card-title>Moving Averages and RSI</mat-card-title>
            <mat-card-subtitle>
                <span>Moving averages are used to smooth out price data by creating a constantly updated average price.</span>
            </mat-card-subtitle>
            <mat-card-header class="button-container-moving-averages">
                <div class="button-container-rsi">
                    <mat-form-field appearance="outline" >
                        <mat-label matTooltip="Tipo de análise">Type of Analysis</mat-label>
                        <mat-select [(ngModel)]="selectedPeriodRSIType" (ngModelChange)="onPeriodTypeChange($event)">
                            <mat-option value="short">Short Term</mat-option>
                            <mat-option value="medium">Medium Term</mat-option>
                            <mat-option value="long">Long Term</mat-option>
                        </mat-select>
                    </mat-form-field>
    
                    <mat-form-field appearance="outline">
                        <mat-label>Data Range</mat-label>
                        <mat-date-range-input [rangePicker]="pickerRSI">
                            <input matStartDate placeholder="Início" [(ngModel)]="startDateRSI">
                            <input matEndDate placeholder="Fim" [(ngModel)]="endDateRSI">
                        </mat-date-range-input>
                        <mat-datepicker-toggle matSuffix [for]="pickerRSI"></mat-datepicker-toggle>
                        <mat-date-range-picker #pickerRSI></mat-date-range-picker>
                    </mat-form-field>
                </div>

                <section *ngIf="selectedPeriodRSIType">
                    <strong *ngIf="selectedPeriodRSIType === 'short'">Short Term</strong>
                    <strong *ngIf="selectedPeriodRSIType === 'medium'">Medium Term</strong>
                    <strong *ngIf="selectedPeriodRSIType === 'long'">Long Term</strong>

                    <mat-form-field appearance="outline">
                        <mat-label>Symbol</mat-label>
                        <mat-select [(ngModel)]="selectedSymbolRSI">
                            <mat-option *ngFor="let s of symbols" [value]="s">{{ s }}
                                
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Fast</mat-label>
                        <input matInput type="number" [(ngModel)]="fastPeriodRSI">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Slow</mat-label>
                        <input matInput type="number" [(ngModel)]="slowPeriodRSI">
                    </mat-form-field>
                </section>
                <section>

                    <mat-form-field appearance="outline">
                        <mat-label>Overbought (RSI &gt;)</mat-label>
                        <input matInput type="number" [(ngModel)]="rsiOverbought" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Oversold (RSI &lt;)</mat-label>
                        <input matInput type="number" [(ngModel)]="rsiOversold" />
                    </mat-form-field>

                </section>
                <section>
                    <button mat-flat-button color="primary"
                        [disabled]="!selectedSymbolRSI || isLoadingMovingAverages"
                        (click)="calculateMovingAveragesRSI(selectedSymbolRSI, fastPeriodRSI, slowPeriodRSI)">
                        <mat-spinner *ngIf="isLoadingMovingAverages" diameter="20"></mat-spinner>
                        <span *ngIf="!isLoadingMovingAverages">Calcular</span>
                    </button>

                    <mat-menu #columnMenu="matMenu">
                        <button mat-menu-item *ngFor="let col of allColumnsRSI">
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
                <table mat-table [dataSource]="dataSourceMovingAvarageRSI" matSort class="mat-elevation-z8 full-width-table">
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
                            'rsi-overbought': element.rsi > rsiOverbought,
                            'rsi-oversold': element.rsi < rsiOversold,
                            'rsi-neutral': element.rsi <= rsiOverbought && element.rsi >= rsiOversold
                            }">
                            {{
                                element.rsi > rsiOverbought ? 'Overbought' :
                                element.rsi < rsiOversold ? 'Oversold' :
                                'Neutral'
                            }}
                            </span>
                        </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumnsMovingAveragesRSI, sticky: true"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumnsMovingAveragesRSI;"></tr>

                </table>
                <mat-paginator #paginatorMovingAverageRSI [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page"></mat-paginator>
            </mat-card-content>
        </mat-card>
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

                    <tr mat-header-row *matHeaderRowDef="displayedColumnsMovingAveragesRSIBB, sticky: true"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumnsMovingAveragesRSIBB;"></tr>

                </table>
                <mat-paginator #paginatorMovingAverageRSIBB [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page"></mat-paginator>
            </mat-card-content>
        </mat-card>
        <mat-card>
        <mat-card>
  <mat-card-title>Visualização Gráfica</mat-card-title>
  <div #plotlyChart style="width: 100%; height: 600px;"></div>
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

        .rsi-overbought {
            background-color: #ffebee;
            color: #c62828;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .rsi-oversold {
            background-color: #e8f5e9;
            color: #2e7d32;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .rsi-neutral {
            background-color: #e3f2fd;
            color: #0d47a1;
            padding: 2px 6px;
            border-radius: 4px;
        }

        
    `],
})
export class DatabaseComponent implements OnInit {
    // Tabela de Candles
    symbols: string[] = [];
    selectedSymbol: string | null = null;
    startDate: Date | null = null;
    endDate: Date | null = null;
    dataSource = new MatTableDataSource<Candle>([]);
    displayedColumns: string[] = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];
    isLoadingSearch = false;
    isLoadingUpdate = false;

    // Tabela de Médias Móveis
    selectedSymbolMA: string | null = null;
    startDateMA: Date | null = null;
    endDateMA: Date | null = null;
    selectedPeriodType: 'short' | 'medium' | 'long' | null = null;
    displayedColumnsMovingAverages: string[] = ['timestamp', 'open', 'high', 'low', 'close', 'volume', 'mediumFast', 'mediumSlow',];
    dataSourceMovingAvarage = new MatTableDataSource<Candle>([]);
    isLoadingMovingAverages = false;
    fastPeriodMA: number = 5;
    slowPeriodMA: number = 10;


    // Tabela de MA + RSI
    selectedSymbolRSI: string | null = null;
    startDateRSI: Date | null = null;
    endDateRSI: Date | null = null;
    selectedPeriodRSIType: 'short' | 'medium' | 'long' | null = null;
    get displayedColumnsMovingAveragesRSI() {
        return this.allColumnsRSI.filter(col => col.visible).map(col => col.key);
    }
    dataSourceMovingAvarageRSI = new MatTableDataSource<Candle>([]);
    fastPeriodRSI: number = 1;
    slowPeriodRSI: number = 1;
    rsiOverbought: number = 70;
    rsiOversold: number = 30;

    // Tabela de MA + RSI + BB
    selectedSymbolBB: string | null = null;
    startDateBB: Date | null = null;
    endDateBB: Date | null = null;
    selectedPeriodBBType: 'short' | 'medium' | 'long' | null = null;
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

    allColumnsRSI = [
        { key: 'timestamp', label: 'Date', visible: true },
        { key: 'open', label: 'Open', visible: true },
        { key: 'high', label: 'High', visible: true },
        { key: 'low', label: 'Low', visible: true },
        { key: 'close', label: 'Close', visible: true },
        { key: 'volume', label: 'Volume', visible: true },
        { key: 'mediumFast', label: 'Medium Fast', visible: true },
        { key: 'mediumSlow', label: 'Medium Slow', visible: true },
        { key: 'rsi', label: 'RSI', visible: true },
        { key: 'rsiStatus', label: 'RSI Status', visible: true }
    ];

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
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('paginatorMovingAverage') paginatorMovingAverage!: MatPaginator;
    @ViewChild('paginatorMovingAverageRSI') paginatorMovingAverageRSI!: MatPaginator;
    @ViewChild('paginatorMovingAverageRSIBB') paginatorMovingAverageRSIBB!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('plotlyChart', { static: false }) plotlyChartRef!: ElementRef<HTMLDivElement>;


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSourceMovingAvarage.paginator = this.paginatorMovingAverage;
        this.dataSourceMovingAvarage.sort = this.sort;

        this.dataSourceMovingAvarageRSI.paginator = this.paginatorMovingAverageRSI;
        this.dataSourceMovingAvarageRSI.sort = this.sort;

        this.dataSourceMovingAvarageRSIBB.paginator = this.paginatorMovingAverageRSIBB;
        this.dataSourceMovingAvarageRSIBB.sort = this.sort;

    }

    onPeriodTypeChange(type: 'short' | 'medium' | 'long') {
        switch (type) {
            case 'short':
                this.fastPeriodMA = 5;
                this.slowPeriodMA = 10;
                this.fastPeriodRSI = 5;
                this.slowPeriodRSI = 10;
                this.fastPeriodBB = 5;
                this.slowPeriodBB = 10;
                break;
            case 'medium':
                this.fastPeriodMA = 20;
                this.slowPeriodMA = 50;
                this.fastPeriodRSI = 20;
                this.slowPeriodRSI = 50;
                this.fastPeriodBB = 20;
                this.slowPeriodBB = 50;
                break;
            case 'long':
                this.fastPeriodMA = 100;
                this.slowPeriodMA = 200;
                this.fastPeriodRSI = 100;
                this.slowPeriodRSI = 200;
                this.fastPeriodBB = 100;
                this.slowPeriodBB = 200;
                break;
        }
    }

    ngOnInit(): void {
        this.#candleService.listSymbols().subscribe({
            next: (symbols) => this.symbols = symbols,
            error: (err) => console.error('Error loading symbols:', err)
        });
    }

    loadCandles(): void {
        if (!this.selectedSymbol) return;
        this.isLoadingSearch = true;

        const start = this.startDate ? this.startDate.toISOString().split('T')[0] : undefined;
        const end = this.endDate ? this.endDate.toISOString().split('T')[0] : undefined;

        this.#candleService.listBySymbol(this.selectedSymbol, start, end).subscribe({
            next: (data) => {
                this.dataSource.data = data;
                this.#snackBar.open(`Candle data for ${this.selectedSymbol} loaded successfully!`, 'Close', {
                    duration: 3000,
                });

            },
            error: (err) => {
                console.error('Error when searching for candles:', err);
                this.#snackBar.open('Error when searching for candles', 'Close', { duration: 3000 });
                this.isLoadingUpdate = false;
                this.isLoadingSearch = false;
            },
            complete: () => {
                this.isLoadingSearch = false;
                this.isLoadingUpdate = false;
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
                console.error('Error updating candles:', err);
                this.#snackBar.open('Error updating candles', 'Close', { duration: 3000 });
                this.isLoadingUpdate = false;
            },
            complete: () => {
                this.isLoadingUpdate = false;
            }
        });
    }

    calculateMovingAverages(symbol: string | null, fast: number, slow: number) {
        if (!symbol) return;
        this.isLoadingMovingAverages = true;

        if (fast <= 0 || slow <= 0) {
            this.#snackBar.open('Fast and Slow periods must be greater than 0', 'Close', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        if (fast >= slow) {
            this.#snackBar.open('Fast period must be less than Slow period', 'Close', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        if (this.startDateMA && this.endDateMA && this.startDateMA > this.endDateMA) {
            this.#snackBar.open('Start date must be before end date', 'Close', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }
        const start = this.startDateMA ? this.startDateMA.toISOString().split('T')[0] : undefined;
        const end = this.endDateMA ? this.endDateMA.toISOString().split('T')[0] : undefined;

        this.#candleService.getWithMovingAverages(symbol, fast, slow, start, end).subscribe({
            next: (data) => {
                this.dataSourceMovingAvarage.data = data;
                this.#snackBar.open('Moving averages calculated successfully!', 'Close', { duration: 3000 });
            },
            error: (err) => {
                console.error('Error calculating moving averages:', err);
                this.#snackBar.open('Error calculating moving averages', 'Close', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingMovingAverages = false;
            }
        });
    }

    calculateMovingAveragesRSI(symbol: string | null, fast: number, slow: number) {
        if (!symbol) return;
        this.isLoadingMovingAverages = true;

        if (fast <= 0 || slow <= 0) {
            this.#snackBar.open('Periods must be greater than 0', 'Close', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        if (fast >= slow) {
            this.#snackBar.open('Fast period must be less than slow period', 'Close', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        if (this.startDateMA && this.endDateMA && this.startDateMA > this.endDateMA) {
            this.#snackBar.open('Start date must be before end date', 'Close', { duration: 3000 });
            this.isLoadingMovingAverages = false;
            return;
        }

        const start = this.startDateMA ? this.startDateMA.toISOString().split('T')[0] : undefined;
        const end = this.endDateMA ? this.endDateMA.toISOString().split('T')[0] : undefined;

        this.#candleService.getWithMovingAveragesRSI(symbol, fast, slow, start, end).subscribe({
            next: (data) => {
                this.dataSourceMovingAvarageRSI.data = data;
                this.#snackBar.open('Médias móveis e RSI calculados com sucesso!', 'Close', { duration: 3000 });
            },
            error: (err) => {
                console.error('Erro ao calcular MA + RSI:', err);
                this.#snackBar.open('Erro ao calcular indicadores', 'Close', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingMovingAverages = false;
            }
        });
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

        this.#candleService.getWithBB(symbol, fast, slow, start, end).subscribe({
            next: (data) => {
                this.dataSourceMovingAvarageRSIBB.data = data;
                this.#snackBar.open('Indicadores BB calculados com sucesso!', 'Fechar', { duration: 3000 });

                // 🎯 Geração do gráfico
                const timestamps = data.map(d => d.timestamp);
                const close = data.map(d => d.data.close);
                const upper = data.map(d => d.bbUpper);
                const lower = data.map(d => d.bbLower);

                const traceClose = {
                    x: timestamps,
                    y: close,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Close',
                    line: { color: '#2196f3' }
                };

                const traceUpper = {
                    x: timestamps,
                    y: upper,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'BB Upper',
                    line: { color: '#e91e63', dash: 'dot' }
                };

                const traceLower = {
                    x: timestamps,
                    y: lower,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'BB Lower',
                    line: { color: '#4caf50', dash: 'dot' }
                };

                const layout = {
                    title: `Indicadores - ${symbol}`,
                    xaxis: { title: 'Data' },
                    yaxis: { title: 'Preço' }
                };

                setTimeout(() => {
                    Plotly.newPlot(this.plotlyChartRef.nativeElement, [traceClose, traceUpper, traceLower], layout);

                }, 0);
            },
            error: (err) => {
                console.error('Erro ao calcular BB:', err);
                this.#snackBar.open('Erro ao calcular BB', 'Fechar', { duration: 3000 });
            },
            complete: () => {
                this.isLoadingMovingAverages = false;
            }
        });
    }


}