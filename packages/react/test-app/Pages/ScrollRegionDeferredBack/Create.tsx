import { Deferred, usePage } from '@inertiajs/react'

const Options = () => {
  const { templates, authors } = usePage<{ templates?: string[]; authors?: string[] }>().props

  return (
    <div>
      Templates: {templates?.join(', ')} / Authors: {authors?.join(', ')}
    </div>
  )
}

export default () => {
  return (
    <Deferred data={['templates', 'authors']} fallback={<div>Loading options...</div>}>
      <Options />
    </Deferred>
  )
}
