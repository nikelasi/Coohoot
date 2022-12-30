import AuthApi from "./auth";
import BaseApi from "./base";
import QuizzesApi from "./quizzes";
import UsersApi from "./users";

class CoohootApi {

  private baseUrl: string = '/api'
  public auth: AuthApi = new AuthApi(this.baseUrl)
  public users: UsersApi = new UsersApi(this.baseUrl)
  public quizzes: QuizzesApi = new QuizzesApi(this.baseUrl)

  public setToken = (token: string|null) => {
    BaseApi.setToken(token)
  }
  
}

const api = new CoohootApi()

export default api