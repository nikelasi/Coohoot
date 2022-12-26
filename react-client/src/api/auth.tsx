
import BaseApi, { PostBody } from './base'

class AuthApi extends BaseApi {
  constructor(baseUrl: string) {
    super(`${baseUrl}/auth`)
  }

  public verifyEmail = async (token: string): Promise<boolean> => {
    const result = await this.post('/verify-email', { token })
    return result.success
  }

  public register = async (username: string, email: string, password: string): Promise<any> => {
    const result = await this.post('/register', { username, email, password })
    return result
  }

  public login = async (userIdentification: string, password: string): Promise<any> => {
    const body: PostBody = { password }
    const isEmail = userIdentification.includes('@')
    if (isEmail) {
      body.email = userIdentification
    } else {
      body.username = userIdentification
    }
    const result = await this.post('/login', body)
    return result
  }

  public logout = async (): Promise<boolean> => {
    const result = await this.post('/logout', {})
    return result.success
  }

  // Reset password routes
  public forgotPassword = async (userIdentification: string): Promise<boolean> => {
    const body: PostBody = {}
    const isEmail = userIdentification.includes('@')
    if (isEmail) {
      body.email = userIdentification
    } else {
      body.username = userIdentification
    }
    const result = await this.post('/password-reset/request', body)
    return result.success
  }

  public checkPasswordResetToken = async (token: string): Promise<any> => {
    const result = await this.post('/password-reset/check', { token })
    return result
  }

  public resetPassword = async (token: string, password: string): Promise<any> => {
    const result = await this.post('/password-reset', { token, password })
    return result
  }
  
}

export default AuthApi