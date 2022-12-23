import BaseApi from "./base";

class UsersApi extends BaseApi {
  constructor(baseUrl: string) {
    super(`${baseUrl}/users`)
  }

  public getByUsername = async (username: string): Promise<any> => {
    const result = await this.get(`/${username}`)
    return result.user
  }
}

export default UsersApi