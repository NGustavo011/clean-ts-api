import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountParams } from '../../../../domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
