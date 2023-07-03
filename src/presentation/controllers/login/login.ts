import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (readonly emailValidator: EmailValidator) {
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
      return await new Promise(resolve => { resolve(ok('')) })
    } catch (error) {
      return serverError(error)
    }
  }
}
