import React, { useMemo, useState } from "react"
import PaginatorComponent from "./Paginator"

interface UsePaginatorProps {
  maxPages?: number;
}

const usePaginator: (props: UsePaginatorProps) => any = (
  { maxPages = 1 }: UsePaginatorProps
) => {
  const [page, setPage] = useState<number>(1)

  const nextPage = () => {
    if (page === maxPages) return
    setPage(page + 1)
  }

  const prevPage = () => {
    if (page === 1) return
    setPage(page - 1)
  }

  const Paginator = useMemo(() => {
    const InnerPaginator: React.FC = () => {
      return <PaginatorComponent
        page={page}
        maxPages={maxPages}
        nextPage={nextPage}
        prevPage={prevPage} />
    }
    return InnerPaginator
  }, [page])
  
  return {
    page,
    Paginator,
    nextPage,
    prevPage
  }
}

export default usePaginator