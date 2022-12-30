import BaseApi from "./base";
import PaginatorApi from "./utils/paginator";

class QuizzesApi extends BaseApi {

  private route;

  constructor(baseUrl: string) {
    super(`${baseUrl}/quizzes`)
    this.route = `${baseUrl}/quizzes`
  }

  public getAllPaginated = () => {
    return new PaginatorApi(`${this.route}`)
  }
}

export default QuizzesApi