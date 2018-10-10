export class CurrencyPair {

  currency1: string
  currency2: string

  constructor(pair: CurrencyPairJson) {
    this.currency1 = pair.currencyPair.substr(0, 3)
    this.currency2 = pair.currencyPair.substr(3, 3)
  }
}

export interface CurrencyPairJson {
  currencyPair: string
}
