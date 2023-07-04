import { type Authentication, type AuthenticationModel } from '../../../domain/usecases/authentication'
import { type HashComparer } from '../../protocols/cryptography/hash-comparer'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, readonly hashComparer: HashComparer) {
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (account) { await this.hashComparer.compare(authenticationModel.password, account.password) }

    return null
  }
}
