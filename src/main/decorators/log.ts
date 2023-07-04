import { type LogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { type HttpRequest, type Controller, type HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (readonly controller: Controller, readonly logErrorRepository: LogErrorRepository) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
