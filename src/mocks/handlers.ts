import { delay, http, HttpResponse } from 'msw'
import type { ApplicationInput } from '../api/applications/applications.types'
import { db } from './db'

export const handlers = [
  http.get('/api/applications', async () => {
    await delay(250)
    return HttpResponse.json(db.list())
  }),

  http.post('/api/applications', async ({ request }) => {
    await delay(300)
    const input = (await request.json()) as ApplicationInput
    return HttpResponse.json(db.create(input), { status: 201 })
  }),

  http.patch('/api/applications/:id', async ({ params, request }) => {
    await delay(200)
    const patch = (await request.json()) as Partial<ApplicationInput>
    const updated = db.update(String(params.id), patch)
    if (!updated) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  http.delete('/api/applications/:id', async ({ params }) => {
    await delay(200)
    db.remove(String(params.id))
    return new HttpResponse(null, { status: 204 })
  }),
]
