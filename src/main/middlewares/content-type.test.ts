import request from 'supertest'
import { app } from '../config/app'

describe('Content Type Middleware', () => {
  test('Deve retornar o conteúdo como json por padrão', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type').expect('content-type', /json/)
  })
  test('Deve retornar um xml quando mesmo for forçado a tal', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app).get('/test_content_type_xml').expect('content-type', /xml/)
  })
})
