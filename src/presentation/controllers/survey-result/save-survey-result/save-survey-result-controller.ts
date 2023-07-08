import { InvalidParamError } from '../../../errors'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse, type SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById, private readonly saveSurveyResult: SaveSurveyResult) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) { return forbidden(new InvalidParamError('surveyId')) }
      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) { return forbidden(new InvalidParamError('answer')) }
      await this.saveSurveyResult.save({
        accountId: accountId as string,
        surveyId,
        answer,
        date: new Date()
      })
      return {
        body: {},
        statusCode: 0
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
