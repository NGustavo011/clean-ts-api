import { type AccountModel } from '../add-account/db-add-account-protocols'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication Usecase', () => {
  test('Deve chamar o LoadAccountByEmailRepository com um e-mail correto', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_password'
        }
        return await new Promise(resolve => { resolve(account) })
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
