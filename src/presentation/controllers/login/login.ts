import { type Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (readonly emailValidator: EmailValidator, readonly authentication: Authentication) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
      }
      if (!password) {
        return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
      }
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) { return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) }) }
      await this.authentication.auth(email, password)
      return await new Promise(resolve => { resolve(ok('')) })
    } catch (error) {
      return serverError(error)
    }
  }
}
