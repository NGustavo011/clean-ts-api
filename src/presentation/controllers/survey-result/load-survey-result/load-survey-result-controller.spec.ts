import { LoadSurveyResultController } from './load-survey-result-controller'
import { type HttpRequest } from './load-survey-result-controller-protocols'
import { mockLoadSurveyById } from '../../../test/mock-survey'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  test('Deve chamar o LoadSurveyById com valores corretos', async () => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
  })
})
