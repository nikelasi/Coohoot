
class BaseApi {

  private url: string
  private static token: string|null = null

  constructor(url: string) {
    this.url = url
  }

  public static setToken = (token: string|null) => {
    BaseApi.token = token
  }

  protected getWithUrl = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${BaseApi.token}`
      }
    })
    return await response.json()
  }


  protected get = async (path: string) => {
    const response = await fetch(`${this.url}${path}`, {
      headers: {
        'Authorization': `Bearer ${BaseApi.token}`
      }
    })
    return await response.json()
  }

  protected post = async (path: string, body: any = {}) => {
    const response = await fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BaseApi.token}`
      },
      body: JSON.stringify(body)
    })
    return await response.json()
  }

  protected put = async (path: string, body: any = {}) => {
    const response = await fetch(`${this.url}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BaseApi.token}`
      },
      body: JSON.stringify(body)
    })
    return await response.json()
  }

  protected delete = async (path: string, headers: any = {}) => {
    const response = await fetch(`${this.url}${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${BaseApi.token}`,
        ...headers
      }
    })
    return await response.json()
  }
}

export default BaseApi

export type PostBody = {
  [key: string]: any
}
