import { ChangeEvent, ReactNode, useRef } from 'react'

interface Props {
  onImport: (file: File) => void
  className?: string
  children: ReactNode
}

export function ImportButton({ onImport, className, children }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onImport(file)
    event.target.value = ''
  }

  return (
    <>
      <button type="button" onClick={() => inputRef.current?.click()} className={className}>
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={handleChange}
        className="hidden"
      />
    </>
  )
}
