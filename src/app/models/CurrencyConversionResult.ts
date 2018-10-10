import {CurrencyPair} from './CurrencyPair';

export class CurrencyConversionResult {

  constructor(currencyPair: CurrencyPair, conversionResult: CurrencyConversionResultJson) {
    this.currencyPair = currencyPair
    this.value = conversionResult.value
    this.text = conversionResult.text
    this.timestamp = conversionResult.timestamp
  }

  currencyPair: CurrencyPair
  value: number
  text: string
  timestamp: number
}

export interface CurrencyConversionResultJson {
  value: number,
  text: string,
  timestamp: number
}
