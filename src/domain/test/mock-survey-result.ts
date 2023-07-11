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
  return {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        count: 1,
        percent: 25,
        image: 'any_image'
      },
      {
        answer: 'other_answer',
        count: 3,
        percent: 75
      }
    ],
    date: new Date()
  }
}
