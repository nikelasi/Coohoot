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

  public editDetails = async (quiz: any) => {
    const result = await this.put(`/${quiz.id}`, {
      title: quiz.title,
      description: quiz.description,
      visibility: quiz.visibility,
      thumbnail_url: quiz.thumbnail_url
    })
    return result.success
  }

  public deleteQuiz = async (quizId: string) => {
    const result = await this.delete(`/${quizId}`)
    return result.success
  }

  public publish = async (quizId: string) => {
    const result = await this.post(`/publish`, {
      quiz_id: quizId
    })
    return result.success
  }

  public unpublish = async (quizId: string) => {
    const result = await this.post(`/unpublish`, {
      quiz_id: quizId
    })
    return result.success
  }

  public uploadImage = async (base64_url: string) => {
    const result = await this.post(`/upload-image`, {
      image_url: base64_url
    })
    if (result.success) {
      return result.url
    }
    return null
  }

  public saveQuestions = async (quizId: string, questions: any[]) => {
    const result = await this.post(`/${quizId}/questions`, {
      questions: questions.map((question: any) => {
        return {
          ...question,
          type: question.type.toLowerCase() === "mcq" ? "mcq" : "short-answer"
        }
      })
    })
    return [result.success, result.success ? result.questions : null]
  }

}

export default QuizzesApi