export interface ParsedTransaction {
  date: string
  description: string
  category: string | null
  amount: number
}

export interface BankParser {
  id: string
  label: string
  parse: (text: string) => ParsedTransaction[]
}
