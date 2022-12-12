import AuthApi from "./auth";

class CoohootApi {

  private baseUrl: string = '/api'
  public auth: AuthApi = new AuthApi(this.baseUrl)
  
}

const api = new CoohootApi()

export default api