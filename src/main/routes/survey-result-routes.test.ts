import request from 'supertest'
import { app } from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SurveyResult Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('PUT /surveys/:surveyId/results', () => {
    test('Deve retornar status code 403 em caso de realizar a requisição sem passar o accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results').send({
        answer: 'any_answer'
      }).expect(403)
    })
  })
})
