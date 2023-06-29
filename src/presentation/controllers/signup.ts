import { type AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor (readonly emailValidator: EmailValidator, readonly addAccount: AddAccount) {
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) { return badRequest(new InvalidParamError('email')) }
      this.addAccount.add({
        name,
        email,
        password
      })
      return {
        body: '',
        statusCode: 0
      }
    } catch (error) {
      return serverError()
    }
  }
}
