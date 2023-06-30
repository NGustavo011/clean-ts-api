import { type AccountModel, type AddAccount, type AddAccountModel, type Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (readonly encrypter: Encrypter) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => {
      resolve({
        id: 'any_id',
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
    })
  }
}
