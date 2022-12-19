
class BaseApi {

  private url: string

  constructor(url: string) {
    this.url = url
  }

  public get = async (path: string) => {
    const response = await fetch(`${this.url}${path}`)
    return await response.json()
  }

  public post = async (path: string, body: any) => {
    const response = await fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    return await response.json()
  }

  public put = async (path: string, body: any) => {
    const response = await fetch(`${this.url}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    return await response.json()
  }

  public delete = async (path: string) => {
    const response = await fetch(`${this.url}${path}`, {
      method: 'DELETE'
    })
    return await response.json()
  }
}

export default BaseApi

export type PostBody = {
  [key: string]: any
}
