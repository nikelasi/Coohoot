import AuthApi from "./auth";
import BaseApi from "./base";

class CoohootApi {

  private baseUrl: string = '/api'
  public auth: AuthApi = new AuthApi(this.baseUrl)

  public setToken = (token: string|null) => {
    BaseApi.setToken(token)
  }
  
}

const api = new CoohootApi()

export default api