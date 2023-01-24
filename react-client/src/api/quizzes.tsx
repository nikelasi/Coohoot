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

  public getOne = async (id: string) => {
    const result = await this.get(`/${id}`)
    if (result.success) {
      return result.quiz
    }
    return null
  }

  public create = async (title: string, description: string, visibility: string, thumbnail_url: string | null) => {
    const result = await this.post("", {
      title,
      description,
      visibility,
      thumbnail_url
    })
    if (result.success) {
      return result.quiz
    }
    return null
  }
}

export default QuizzesApi