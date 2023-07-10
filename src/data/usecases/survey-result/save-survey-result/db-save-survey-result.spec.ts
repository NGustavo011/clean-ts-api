
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { type SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockSaveSurveyResultParams, mockSurveyResultModel, throwError } from '../../../../domain/test'
import { mockSaveSurveyResultRepository } from '../../../../data/test'

interface SutTypes {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  sut: DbSaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Deve chamar o SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const fakeSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(fakeSurveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(fakeSurveyResultData)
  })
  test('Deve repassar o error caso o SaveSurveyResultRepository lance um erro', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
  test('Deve retornar um SurveyResult em caso de sucesso', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
