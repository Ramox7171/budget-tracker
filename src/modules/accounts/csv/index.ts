import { parseMbankCsv } from './mbankParser'
import type { BankParser } from './types'

// Rejestr parserów - kolejny bank to kolejny wpis tutaj plus plik parsera.
export const BANK_PARSERS: BankParser[] = [
  { id: 'mbank', label: 'mBank — lista operacji (CSV)', parse: parseMbankCsv },
]

export type { BankParser, ParsedTransaction } from './types'
