import BaseApi from '../base'

class PaginatorApi extends BaseApi {

  private route: string
  private PAGE_SIZE: number = 12

  private totalPages: number = 1

  constructor(route: string) {
    super(route)
    this.route = `${route}?limit=${this.PAGE_SIZE}`
  }

  private routeWithPage(page: number): string {
    return `${this.route}&page=${page}`
  }

  private async getResults(page: number = 1) {
    const { data, total_pages } = await this.getWithUrl(this.routeWithPage(page))
    this.totalPages = total_pages
    return data
  }

  public async getPage(page: number) {
    return await this.getResults(page)
  }

  public getTotalPages() {
    return this.totalPages
  }

}

export default PaginatorApi