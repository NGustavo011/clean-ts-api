import { type LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result'
import { type LoadSurveyResultRepository } from '../../../protocols/db/survey-result/load-survey-result-repository'
import { type SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {
  }

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return await Promise.resolve(null)
  }
}
