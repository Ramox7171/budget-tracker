const PIN_LENGTH = 4
const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

interface Props {
  value: string
  onChange: (value: string) => void
}

export function PinPad({ value, onChange }: Props) {
  const handleDigit = (digit: string) => {
    if (value.length >= PIN_LENGTH) return
    onChange(value + digit)
  }

  const handleBackspace = () => onChange(value.slice(0, -1))

  return (
    <div>
      <div className="flex justify-center gap-3">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full border border-ink/30 transition-colors dark:border-white/30 ${
              index < value.length ? 'bg-ink dark:bg-slate-100' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="mx-auto mt-6 grid max-w-[16rem] grid-cols-3 gap-3">
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="rounded-xl border border-ink/10 py-3.5 text-lg font-medium transition-colors hover:bg-ink/5 active:bg-ink/10 dark:border-white/10 dark:hover:bg-white/10 dark:active:bg-white/15"
          >
            {digit}
          </button>
        ))}
        <div />
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="rounded-xl border border-ink/10 py-3.5 text-lg font-medium transition-colors hover:bg-ink/5 active:bg-ink/10 dark:border-white/10 dark:hover:bg-white/10 dark:active:bg-white/15"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          aria-label="Backspace"
          className="rounded-xl border border-ink/10 py-3.5 text-sm font-medium text-ink/60 transition-colors hover:bg-ink/5 active:bg-ink/10 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10 dark:active:bg-white/15"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}
