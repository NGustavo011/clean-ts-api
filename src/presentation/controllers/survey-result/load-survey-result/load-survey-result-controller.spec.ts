import { LoadSurveyResultController } from './load-survey-result-controller'
import { type LoadSurveyById, type HttpRequest } from './load-survey-result-controller-protocols'
import { mockLoadSurveyById } from '../../../test/mock-survey'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../errors'
import { throwError } from '../../../../domain/test'

interface SutTypes {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Deve chamar o LoadSurveyById com valores corretos', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
  })
  test('Deve retornar o status code 403 se o LoadSurveyById retornar nulo', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Deve retornar o status code 500 se o LoadSurveyById lançar um erro', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
