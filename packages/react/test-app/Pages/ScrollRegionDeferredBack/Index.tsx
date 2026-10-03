import { Link, router, useRemember } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

const rowHeight = 40
const rows = Array.from({ length: 200 }, (_, index) => ({ id: String(index + 1), title: `Article ${index + 1}` }))

export default () => {
  // Row selection survives Back.
  const [checked, setChecked] = useRemember<string[]>([], 'articles:checked')

  // The grid keeps its visible window in history so it can re-anchor rows after Back.
  // It starts from the region's current offset, which is 0 until Inertia restores it.
  const grid = useRef<HTMLDivElement>(null)
  const [firstVisibleRow, setFirstVisibleRow] = useState(0)

  useEffect(() => {
    router.remember({ firstVisibleRow }, 'articles:window')
  }, [firstVisibleRow])

  const toggle = (id: string) =>
    setChecked((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))

  return (
    <>
      <Link href="/scroll-region-deferred-back/create">New article</Link>
      <div>Selected: {checked.length}</div>

      <div
        scroll-region=""
        id="grid"
        ref={grid}
        style={{ height: '300px', overflowY: 'auto' }}
        onScroll={() => setFirstVisibleRow(Math.floor((grid.current?.scrollTop ?? 0) / rowHeight))}
      >
        {rows.map((row) => (
          <label key={row.id} style={{ display: 'block', height: `${rowHeight}px` }}>
            <input type="checkbox" checked={checked.includes(row.id)} onChange={() => toggle(row.id)} />
            {row.title}
          </label>
        ))}
      </div>
    </>
  )
}
