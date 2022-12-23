import { HStack, IconButton, Text } from "@chakra-ui/react"
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

interface PaginatorProps {
  maxPages: number;
  page: number;
  nextPage: () => void;
  prevPage: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  maxPages,
  page,
  nextPage,
  prevPage
}: PaginatorProps) => (
  <HStack>
    <IconButton
      onClick={prevPage}
      isDisabled={page === 1}
      isRound
      size="sm"
      aria-label="previous page"
      icon={<IoMdArrowBack />} />
    <Text>Page {page} of {maxPages}</Text>
    <IconButton
      onClick={nextPage}
      isDisabled={page === maxPages}
      isRound
      size="sm"
      aria-label="next page"
      icon={<IoMdArrowForward />} />
  </HStack>
)

export default Paginator