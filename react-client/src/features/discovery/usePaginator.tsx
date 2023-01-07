import React, { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PaginatorApi from "../../api/utils/paginator";
import PaginatorComponent from "./Paginator"

interface UsePaginatorProps {
  maxPages?: number;
  paginatorApi?: PaginatorApi;
  pageParam?: string;
}

interface UsePaginatorReturn {
  page: number;
  Paginator: React.FC;
  nextPage: () => void;
  prevPage: () => void;
  isLoading: boolean;
  items: any[];
}

const usePaginator: (props: UsePaginatorProps) => UsePaginatorReturn = ({
  paginatorApi,
  pageParam = 'page'
}: UsePaginatorProps) => {

  const [searchParams, setSearchParams] = useSearchParams()

  const [page, setPage] = useState<number>(parseInt(searchParams.get(pageParam) || "1"))
  const [maxPages, setMaxPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [items, setItems] = useState<any[]>([])

  const navigate = useNavigate()

  const location = useLocation()
  const { pathname } = location;

  const navigatePage = (page: any) => {
    navigate(`${pathname}?page=${page}`)
  }

  const nextPage = async () => {
    if (page === maxPages) return
    setPage(page + 1)
  }

  const prevPage = async () => {
    if (page === 1) return
    setPage(page - 1)
  }

  const Paginator = useMemo(() => {
    const InnerPaginator: React.FC = () => {
      return <PaginatorComponent
        isLoading={isLoading}
        page={page}
        maxPages={maxPages}
        nextPage={nextPage}
        prevPage={prevPage} />
    }
    return InnerPaginator
  }, [page, maxPages, isLoading, nextPage, prevPage])

  const loadPage = async (page: number) => {
    if (!paginatorApi) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        [pageParam]: "1"
      })
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const items = await paginatorApi.getPage(page)
    setItems(items)

    setMaxPages(paginatorApi.getTotalPages())
    const newPage = page > paginatorApi.getTotalPages() ? paginatorApi.getTotalPages() : page < 1 ? 1 : page

    setIsLoading(false)
    setPage(newPage)
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      [pageParam]: newPage.toString()
    })
  }


  useEffect(() => {
    // scuffed way to fix
    const timeout = setTimeout(() => loadPage(page), 1)
    return () => clearTimeout(timeout)
  }, [page])
  
  return {
    page,
    Paginator,
    isLoading,
    nextPage,
    prevPage,
    items
  }
}

export default usePaginator