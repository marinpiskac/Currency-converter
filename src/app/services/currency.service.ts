import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CurrencyPair} from '../models/CurrencyPair';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {CurrencyPairQuote, CurrencyPairQuoteJson} from '../models/CurrencyPairQuote';
import {CurrencyConversionResult, CurrencyConversionResultJson} from '../models/CurrencyConversionResult';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  private BASE_URL: string = 'https://forex.1forge.com/1.0.3/'
  private API_KEY: string = 'mUZVvLKhkfAs2YY64Y8Q6P3Kw5x3kzkf'

  private CURRENCY_SYMBOLS: string = 'symbols'
  private CURRENCY_QUOTES: string = 'quotes'
  private CURRENCY_CONVERT: string = 'convert'

  constructor(private http: HttpClient) {
  }

  public getCurrencySymbols(): Observable<Array<CurrencyPair>> {
    let httpParams = new HttpParams().set('api_key', this.API_KEY)

    return this.http.get<Array<string>>(this.BASE_URL + this.CURRENCY_SYMBOLS, {params: httpParams}).pipe(
      map(res => res.map(value => new CurrencyPair({currencyPair: value})))
    )
  }

  getCurrencyPairQuote(currencyPair: CurrencyPair): Observable<CurrencyPairQuote[]> {
    let httpParams = new HttpParams()
      .append('pairs', currencyPair.currency1 + currencyPair.currency2 + ',' + currencyPair.currency2 + currencyPair.currency1)
      .append('api_key', this.API_KEY)

    return this.http.get<Array<CurrencyPairQuoteJson>>(this.BASE_URL + this.CURRENCY_QUOTES, {params: httpParams}).pipe(
      map(res => res.map(value => new CurrencyPairQuote(value)))
    )
  }

  convertCurrencies(currencyPair: CurrencyPair, quantity: number) {
    let httpParams = new HttpParams().append('from', currencyPair.currency1)
      .append('to', currencyPair.currency2)
      .append('quantity', quantity.toString())
      .append('api_key', this.API_KEY)

    return this.http.get<CurrencyConversionResultJson>(this.BASE_URL + this.CURRENCY_CONVERT, {params: httpParams}).pipe(
      map(res => new CurrencyConversionResult(currencyPair, res))
    )
  }
}
