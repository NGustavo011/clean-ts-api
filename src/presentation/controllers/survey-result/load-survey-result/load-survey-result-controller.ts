import { InvalidParamError } from '../../../errors'
import { forbidden } from '../../../helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) { return forbidden(new InvalidParamError('surveyId')) }
    return await Promise.resolve({
      body: {},
      statusCode: 0
    })
  }
}
