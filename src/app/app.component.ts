import {Component} from '@angular/core';
import {CurrencyService} from './services/currency.service';
import {CookieService} from 'ngx-cookie-service';
import {MatDialog} from '@angular/material';
import {WelcomeDialogComponent} from './welcome-dialog/welcome-dialog.component';
import {CurrencyPair} from './models/CurrencyPair';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/internal/operators';
import {Observable} from 'rxjs/index';
import {CurrencyPairQuote} from './models/CurrencyPairQuote';

const FIRST_RUN_COOKIE_KEY = 'firstRun'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ReactiveFormsModule, MatDialog, CookieService, CurrencyService],
  styleUrls: ['./app.component.css'],
  entryComponents: [WelcomeDialogComponent]
})
export class AppComponent {
  currencyPairs: Array<CurrencyPair>
  conversionForm: FormGroup
  distinctCurrencies: Set<string> = new Set<string>()
  filteredCurrenciesFrom: Observable<Array<string>>
  filteredCurrenciesTo: Observable<Array<string>>
  selectedCurrencyQuotes: Array<CurrencyPairQuote> = []

  constructor(
    private dialogService: MatDialog,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private currencyService: CurrencyService
  ) {
  }

  ngOnInit() {
    this.getCurrencyPairs()

    this.conversionForm = this.formBuilder.group({
      amount: [null, Validators.pattern('^\\d+\\.*\\d*$')],
      resultingAmount: [{value: null, disabled: true}],
      from: ['', Validators.required],
      to: ['', Validators.required]
    })

    setTimeout(() => {
      if (!this.cookieService.check(FIRST_RUN_COOKIE_KEY)) {
        this.dialogService.open(WelcomeDialogComponent)
        this.cookieService.set(FIRST_RUN_COOKIE_KEY, new Date().toDateString())
      }
    })
  }

  getCurrencyPairs() {
    this.currencyService.getCurrencySymbols().subscribe((response) => {
        this.currencyPairs = response

        response.forEach(value => {
          this.distinctCurrencies.add(value.currency1)
        })

        this.filteredCurrenciesFrom = this.conversionForm.controls.from.valueChanges
          .pipe(
            startWith(''),
            map(value => value.length == 0 ?
              Array.from(this.distinctCurrencies).filter(currency =>
                currency != this.conversionForm.value.to)
              : Array.from(this.distinctCurrencies).filter(currency =>
                currency.toLowerCase().includes(value.toLowerCase())
                && currency != this.conversionForm.value.to
              )
            )
          )

        this.filteredCurrenciesTo = this.conversionForm.controls.to.valueChanges
          .pipe(
            startWith(''),
            map(value => value.length == 0 ?
              Array.from(this.distinctCurrencies).filter(currency =>
                currency != this.conversionForm.value.from)
              : Array.from(this.distinctCurrencies).filter(currency =>
                currency.toLowerCase().includes(value.toLowerCase())
                && currency != this.conversionForm.value.from
              )
            )
          )
      },
      (error) => {
        console.log('OOps, there has been an ' + error)
      })
  }

  // Trigger valueChanges event to update observable so we do not have conversion between same currencies
  forceFromCurrencyUpdates() {
    this.conversionForm.controls.from.updateValueAndValidity({onlySelf: true, emitEvent: true})
  }

  // Trigger valueChanges event to update observable so we do not have conversion between same currencies
  forceToCurrencyUpdates() {
    this.conversionForm.controls.to.updateValueAndValidity({onlySelf: true, emitEvent: true})
  }

  switchCurrencies() {
    let temp = this.conversionForm.value
    this.conversionForm.controls.from.setValue(temp.to)
    this.conversionForm.controls.to.setValue(temp.from)
    this.currencyChange()
  }

  //Clear from value if it is not a currency, setTimeout is used so if a value from the dropdown is chosen, the check isnt performed
  //before the value is changed
  checkFromCurrency() {
    setTimeout(() => {
      if (!this.distinctCurrencies.has(this.conversionForm.value.from)) this.conversionForm.controls.from.setValue('')
    }, 100)
  }

  //Clear to value if it is not a currency, setTimeout is used so if a value from the dropdown is chosen, the check isnt performed
  //before the value is changed
  checkToCurrency() {
    setTimeout(() => {
      if (!this.distinctCurrencies.has(this.conversionForm.value.to)) this.conversionForm.controls.to.setValue('')
    }, 100)
  }

  currencyChange() {
    if (this.distinctCurrencies.has(this.conversionForm.value.from) && this.distinctCurrencies.has(this.conversionForm.value.to)) {
      this.currencyService.getCurrencyPairQuote(
        new CurrencyPair({currencyPair: this.conversionForm.value.from + this.conversionForm.value.to})
      ).subscribe(
          (value) => {
            this.selectedCurrencyQuotes = value
            this.amountChange()
          },
          (error) => {
            console.log('OOps, there has been an ' + error)
          })
    } else {
      this.selectedCurrencyQuotes = []
    }
  }

  amountChange(){
    if(this.selectedCurrencyQuotes.length!=0 && this.conversionForm.value.amount != null){
      this.currencyService.convertCurrencies(
        new CurrencyPair({currencyPair: this.conversionForm.value.from + this.conversionForm.value.to}),
        this.conversionForm.value.amount
      ).subscribe(
        (value)=>{
          this.conversionForm.controls.resultingAmount.setValue(value.value)
        }
      )
    }else{
      this.conversionForm.controls.resultingAmount.setValue(0)
    }
  }

  restrictSpecialCharacters(event){
    let keyCode = event.keyCode ? event.keyCode : event.which
    if(keyCode == 45 || keyCode == 43 || keyCode == 42 || keyCode == 47) event.preventDefault()
  }
}
