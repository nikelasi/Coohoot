
import BaseApi from './base'

class AuthApi extends BaseApi {
  constructor(baseUrl: string) {
    super(`${baseUrl}/auth`)
  }

  public verifyEmail = async (token: string): Promise<boolean> => {
    const result = await this.post('/verify-email', { token })
    return result.success
  }

  public register = async (username: string, email: string, password: string): Promise<boolean> => {
    const result = await this.post('/register', { username, email, password })
    return result.success
  }
}

export default AuthApi