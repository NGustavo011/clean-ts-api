
import { type SaveSurveyResultModel } from '../../../domain/usecases/save-survey-result'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { type SurveyResultModel } from '../../../domain/models/survey-result'
import { type SaveSurveyResultRepository } from '../../protocols/db/survey/save-survey-result-repository'

interface SutTypes {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  sut: DbSaveSurveyResult
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeFakeSurveyResult = (): SurveyResultModel => {
  return Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' })
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => { resolve(makeFakeSurveyResult()) })
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
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
    const fakeSurveyResultData = makeFakeSurveyResultData()
    await sut.save(fakeSurveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(fakeSurveyResultData)
  })
  test('Deve repassar o error caso o SaveSurveyResultRepository lance um erro', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
  test('Deve retornar um SurveyResult em caso de sucesso', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
