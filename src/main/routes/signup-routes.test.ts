import request from 'supertest'
import { app } from '../config/app'

describe('SignUp Routes', () => {
  test('Deve retornar uma conta em caso de sucesso', async () => {
    await request(app).post('/api/signup').send({
      name: 'Gustavo',
      email: 'gustavo.nogueira@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    }).expect(200)
  })
})
