import request from 'supertest'
import { app } from '../config/app'

describe('NoCache Middleware', () => {
  test('Deve desabilitar o cache', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app).get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
