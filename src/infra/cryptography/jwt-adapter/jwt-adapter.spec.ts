import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
describe('Jwt Adapter', () => {
  test('Deve chamar o método sign com valores corretos', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
