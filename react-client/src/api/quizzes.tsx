import BaseApi from "./base";
import PaginatorApi from "./utils/paginator";

class QuizzesApi extends BaseApi {

  private route;

  constructor(baseUrl: string) {
    super(`${baseUrl}/quizzes`)
    this.route = `${baseUrl}/quizzes`
  }

  public getMinePaginated = () => {
    return new PaginatorApi(`${this.route}/mine`)
  }

  public getAllPaginated = () => {
    return new PaginatorApi(`${this.route}`)
  }

  public getOthersPaginated = (userId: string) => {
    return new PaginatorApi(`${this.route}/by/${userId}`)
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

  public deleteQuiz = async (quizId: string) => {
    const result = await this.delete(`/${quizId}`)
    return result.success
  }
}

export default QuizzesApi