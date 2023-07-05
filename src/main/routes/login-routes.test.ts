import request from 'supertest'
import { app } from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { type Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('Deve retornar status code 200 em caso de sucesso no SignUp', async () => {
      await request(app).post('/api/signup').send({
        name: 'Gustavo',
        email: 'gustavo.nogueira@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(200)
    })
  })
  describe('POST /login', () => {
    test('Deve retornar status code 200 em caso de sucesso no Login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gustavo',
        email: 'gustavo.nogueira@gmail.com',
        password
      })
      await request(app).post('/api/login').send({
        email: 'gustavo.nogueira@gmail.com',
        password: '123'
      }).expect(200)
    })
  })
})
