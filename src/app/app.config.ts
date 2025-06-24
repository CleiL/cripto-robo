import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { routes } from './app.routes';
import { AuthInterceptor } from './auth/auth.interceptor';
import { NgApexChartModule } from 'ng-apexcharts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(),withInterceptors([AuthInterceptor])),
    importProvidersFrom(NgApexChartModule,)
  ]
};