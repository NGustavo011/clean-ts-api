import { type Authentication, type AuthenticationModel, type HashComparer, type LoadAccountByEmailRepository, type TokenGenerator, type UpdateAccessTokenRepository } from './db-authentication-protocols'

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
