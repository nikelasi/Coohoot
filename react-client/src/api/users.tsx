import BaseApi from "./base";

class UsersApi extends BaseApi {
  constructor(baseUrl: string) {
    super(`${baseUrl}/users`)
  }

  public getMe = async (): Promise<any> => {
    const result = await this.get('/me')
    return result
  }

  public getByUsername = async (username: string): Promise<any> => {
    const result = await this.get(`/${username}`)
    return result.user
  }

  public changePassword = async (oldPassword: string, newPassword: string): Promise<any> => {
    const result = await this.put('/change-password', {
      password: oldPassword,
      new_password: newPassword
    })
    return result
  }

  public updatePfp = async (base64: string): Promise<any> => {
    const result = await this.put('/update-pfp', {
      pfp: base64
    })
    return result
  }

  public deleteUser = async (password: string): Promise<boolean> => {
    const { success } = await this.delete("", {
      "Confirmation-Password": password
    })
    return success
  }
}

export default UsersApi