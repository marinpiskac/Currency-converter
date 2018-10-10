import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CurrencyService} from './services/currency.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CookieService} from 'ngx-cookie-service';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialog,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule, MatInputModule
} from '@angular/material';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeDialogComponent
  ],
  imports: [
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ],
  providers: [ReactiveFormsModule, OverlayModule, MatDialog, HttpClientModule, CookieService, CurrencyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
