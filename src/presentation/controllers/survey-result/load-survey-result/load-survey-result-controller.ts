import { InvalidParamError } from '../../../errors'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse, type LoadSurveyResult } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById, private readonly loadSurveyResult: LoadSurveyResult) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) { return forbidden(new InvalidParamError('surveyId')) }
      await this.loadSurveyResult.load(surveyId)
      return {
        body: {},
        statusCode: 0
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
