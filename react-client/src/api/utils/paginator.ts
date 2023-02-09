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

  private routeWithSearch(page: number, searchParam: string): string {
    if (!searchParam) return this.routeWithPage(page)
    return `${this.routeWithPage(page)}&search=${searchParam}`
  }

  private async getResults(page: number = 1, searchParam: string = "") {
    const { data, total_pages } = await this.getWithUrl(this.routeWithSearch(page, searchParam))
    this.totalPages = total_pages
    return data
  }

  public async getPage(page: number, searchParam: string = "") {
    return await this.getResults(page, searchParam)
  }

  public getTotalPages() {
    return this.totalPages
  }

}

export default PaginatorApi