import jwt from 'jsonwebtoken'
import { type Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (readonly secret: string) {}
  async encrypt (id: string): Promise<string> {
    const accessToken = jwt.sign({ id }, this.secret)
    return await new Promise(resolve => { resolve(accessToken) })
  }
}
