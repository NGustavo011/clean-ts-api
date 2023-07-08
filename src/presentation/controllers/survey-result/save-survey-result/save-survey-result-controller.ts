import { InvalidParamError } from '../../../errors'
import { forbidden } from '../../../helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) { return forbidden(new InvalidParamError('surveyId')) }
    return {
      body: {},
      statusCode: 0
    }
  }
}
