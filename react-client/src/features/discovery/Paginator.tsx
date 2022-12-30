import { HStack, IconButton, Text } from "@chakra-ui/react"
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

interface PaginatorProps {
  isLoading: boolean;
  maxPages: number;
  page: number;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
}

const Paginator: React.FC<PaginatorProps> = ({
  isLoading,
  maxPages,
  page,
  nextPage,
  prevPage
}: PaginatorProps) => (
  <HStack>
    <IconButton
      onClick={prevPage}
      isLoading={isLoading}
      isDisabled={page === 1 || isLoading}
      isRound
      size="sm"
      aria-label="previous page"
      icon={<IoMdArrowBack />} />
    <Text>Page {page} of {maxPages}</Text>
    <IconButton
      onClick={nextPage}
      isLoading={isLoading}
      isDisabled={page === maxPages || isLoading}
      isRound
      size="sm"
      aria-label="next page"
      icon={<IoMdArrowForward />} />
  </HStack>
)

export default Paginator