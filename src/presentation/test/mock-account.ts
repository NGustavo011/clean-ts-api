import { type AuthenticationModel } from '../../domain/models/authentication'
import { mockAccountModel } from '../../domain/test'
import { type Authentication, type AccountModel, type AddAccount, type AddAccountParams, type AuthenticationParams } from '../controllers/login/signup/signup-controller-protocols'
import { type LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return await new Promise(resolve => { resolve({ accessToken: 'any_token', name: 'any_name' }) })
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
      return await new Promise(resolve => { resolve(mockAccountModel()) })
    }
  }
  return new LoadAccountByTokenStub()
}
