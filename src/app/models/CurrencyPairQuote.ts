import {CurrencyPair} from './CurrencyPair';

export class CurrencyPairQuote {

  symbol: CurrencyPair
  price: number
  bid: number
  ask: number
  timestamp: number

  constructor(object: CurrencyPairQuoteJson) {
    this.symbol = new CurrencyPair({currencyPair: object.symbol})
    this.price = object.price
    this.bid = object.bid
    this.ask = object.ask
    this.timestamp = object.timestamp
  }
}

export interface CurrencyPairQuoteJson {
  symbol: string
  price: number
  bid: number
  ask: number
  timestamp: number
}
