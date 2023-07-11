import { SaveSurveyResultController } from './save-survey-result-controller'
import { type LoadSurveyById, type HttpRequest, type SaveSurveyResult } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '../../../errors'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockSurveyResultModel, throwError } from '../../../../domain/test'
import { mockLoadSurveyById, mockSaveSurveyResult } from '../../../test'

interface SutTypes {
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
  sut: SaveSurveyResultController
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Deve chamar o LoadSurveyById com os valores corretos', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(mockRequest().params.surveyId)
  })
  test('Deve retornar o status code 403 em caso de LoadSurveyById retornar null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Deve retornar status code 500 se LoadSurveyById lançar um erro', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Deve retornar o status code 403 em caso de fornecido uma resposta inválida', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('Deve chamar o SaveSurveyResult com os valores corretos', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer'
    })
  })
  test('Deve retornar status code 500 se SaveSurveyResult lançar um erro', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Deve retornar status code 200 em caso de sucesso', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
