// SHA-256 przez Web Crypto - dostępne zarówno w przeglądarce, jak i w
// webview Tauri. To nie jest szyfrowanie danych, tylko odciśnięcie PIN-u,
// żeby nie trzymać go w localStorage jawnym tekstem.
export async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
