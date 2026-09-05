import { splitCsvLine } from './csvLine'
import type { ParsedTransaction } from './types'

// mBank eksportuje "Listę operacji" jako CSV pełen metadanych i nagłówków.
// Zamiast parsować cały plik liniowo, wyłapujemy tylko wiersze zaczynające
// się od daty w formacie ISO - to jedyne linie z realnymi transakcjami.
const ROW_PATTERN = /^\d{4}-\d{2}-\d{2};/

function parseAmount(raw: string): number {
  const cleaned = raw
    .replace(/PLN/gi, '')
    .replace(/\s/g, '')
    .replace(',', '.')
    .trim()
  return Number(cleaned)
}

export function parseMbankCsv(text: string): ParsedTransaction[] {
  const lines = text.split(/\r?\n/)
  const transactions: ParsedTransaction[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!ROW_PATTERN.test(line)) continue

    const fields = splitCsvLine(line, ';')
    const [date, descriptionRaw, , categoryRaw, amountRaw] = fields
    if (!date || !amountRaw) continue

    const amount = parseAmount(amountRaw)
    if (Number.isNaN(amount)) continue

    transactions.push({
      date,
      description: descriptionRaw.replace(/\s+/g, ' ').trim(),
      category: categoryRaw?.trim() || null,
      amount,
    })
  }

  return transactions
}
