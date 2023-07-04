import { type Authentication, type AuthenticationModel } from '../../../domain/usecases/authentication'
import { type HashComparer } from '../../protocols/cryptography/hash-comparer'
import { type TokenGenerator } from '../../protocols/cryptography/token-generator'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, readonly hashComparer: HashComparer, readonly tokenGenerator: TokenGenerator, readonly updateAccessTokenRepository: UpdateAccessTokenRepository) {
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (!account) {
      return null
    }
    const isValid = await this.hashComparer.compare(authenticationModel.password, account.password)
    if (!isValid) {
      return null
    }
    const accessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
