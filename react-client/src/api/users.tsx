import BaseApi from "./base";

class UsersApi extends BaseApi {
  constructor(baseUrl: string) {
    super(`${baseUrl}/users`)
  }

  public getByUsername = async (username: string): Promise<any> => {
    const result = await this.get(`/${username}`)
    return result.user
  }

  public deleteUser = async (password: string): Promise<boolean> => {
    const { success } = await this.delete("", {
      "Confirmation-Password": password
    })
    return success
  }
}

export default UsersApi