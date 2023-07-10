import { type SurveyResultModel } from '../models/survey-result'
import { type SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

export const mockSurveyResultModel = (): SurveyResultModel => {
  return Object.assign({}, mockSaveSurveyResultParams(), { id: 'any_id' })
}

export const mockSurveyResult = (): SurveyResultModel => {
  return {
    id: 'valid_id',
    surveyId: 'valid_survey_id',
    accountId: 'valid_account_id',
    date: new Date(),
    answer: 'valid_answer'
  }
}
