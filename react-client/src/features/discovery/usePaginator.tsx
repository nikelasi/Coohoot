import React, { useEffect, useMemo, useState } from "react"
import PaginatorApi from "../../api/utils/paginator";
import PaginatorComponent from "./Paginator"

interface UsePaginatorProps {
  maxPages?: number;
  paginatorApi?: PaginatorApi;
}

interface UsePaginatorReturn {
  page: number;
  Paginator: React.FC;
  nextPage: () => void;
  prevPage: () => void;
  isLoading: boolean;
  items: any[];
}

const usePaginator: (props: UsePaginatorProps) => any = ({
  paginatorApi
}: UsePaginatorProps) => {

  const [page, setPage] = useState<number>(1)
  const [maxPages, setMaxPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [items, setItems] = useState<any[]>([])

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


  useEffect(() => {
    if (!paginatorApi) {
      setIsLoading(false)
      return
    }

    (async () => {
      setIsLoading(true)
      const items = await paginatorApi.getPage(page)
      setItems(items)
      setMaxPages(paginatorApi.getTotalPages())
      setIsLoading(false)
    })()

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