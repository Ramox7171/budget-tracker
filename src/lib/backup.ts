// Pełny backup aplikacji - zrzuca wszystkie klucze storage używane przez
// moduły do jednego pliku JSON. Kolejny moduł z własnym stanem to jeden
// dopisany klucz tutaj, nic więcej.
const BACKUP_KEYS = [
  'budget-tracker-state',
  'budget-tracker-saved-budgets',
  'pet-tracker-state',
  'car-tracker-state',
  'accounts-state',
  'theme',
  'language',
] as const

interface BackupEntry {
  raw: boolean
  value: unknown
}

interface BackupFile {
  exportedAt: string
  data: Record<string, BackupEntry>
}

export function exportBackup(): void {
  const data: Record<string, BackupEntry> = {}

  for (const key of BACKUP_KEYS) {
    const stored = localStorage.getItem(key)
    if (stored === null) continue

    try {
      data[key] = { raw: false, value: JSON.parse(stored) }
    } catch {
      data[key] = { raw: true, value: stored }
    }
  }

  const payload: BackupFile = { exportedAt: new Date().toISOString(), data }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const link = document.createElement('a')
  link.href = url
  link.download = `budzet-domowy-backup-${date}.json`
  link.click()

  URL.revokeObjectURL(url)
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text()
  const parsed = JSON.parse(text) as Partial<BackupFile>

  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Nieprawidłowy plik kopii zapasowej.')
  }

  for (const key of BACKUP_KEYS) {
    const entry = parsed.data[key]
    if (!entry) continue

    const serialized = entry.raw ? String(entry.value) : JSON.stringify(entry.value)
    localStorage.setItem(key, serialized)
  }
}
