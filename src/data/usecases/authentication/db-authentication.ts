import { type Authentication, type AuthenticationModel } from '../../../domain/usecases/authentication'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authenticationModel.email)
    return ''
  }
}
