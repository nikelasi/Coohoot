import { VStack, Text, Flex, HStack, IconButton, useColorMode, Icon, Tooltip } from "@chakra-ui/react";
import { Reorder } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdTrash, IoMdWarning } from "react-icons/io";

interface QuestionCardProps {
  question: any;
  index: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onSelect,
  onDelete,
  isSelected
}: QuestionCardProps) => {

  const { question: questionText, id, type, options, answers } = question

  const [scroll, setScroll] = useState<number>(0)

  const ref = useRef<HTMLDivElement>(null)

  const deriveIsValid = () => {
    if (questionText === "") {
      return false
    }
    if (type === 'MCQ') {
      if (options.every((option: any) => option.value !== undefined && option.id !== undefined)) {
        if (options.some((option: any) => option.value === "")) {
          return false
        }
      }
      if (answers.length < 1) {
        return false
      }
    } else if (type === 'Short Answer') {
      if (answers.every((answer: any) => answer.match(/^\/\^(.*)\$\/(i?)$/))) {
        if (answers.some((answer: any) => answer.match(/^\/\^(.*)\$\/(i?)$/)[1] === "")) {
          return false
        }
      }
    }
    return true
  }

  const isValid = useMemo(() => deriveIsValid(), [questionText, type, options, answers])

  return (
    <Reorder.Item
      id={id}
      value={question}
      whileDrag={{
        opacity: 0.5,
        cursor: "grabbing"
      }}
      onDrag={(e: PointerEvent)=> {
        if (ref.current) {

          const sidebar = ref.current.parentElement!.parentElement!.parentElement!
          const sidebarTop = sidebar.firstElementChild!.getBoundingClientRect().bottom
          const sidebarBottom = sidebar.getBoundingClientRect().bottom

          const currentRect = ref.current.getBoundingClientRect()
          const top = currentRect.top
          const bottom = currentRect.bottom

          if (top < sidebarTop) {
            sidebar.scrollBy(0, -2)
          } else if (bottom >= sidebarBottom - 2) {
            sidebar.scrollBy(0, 2)
          }
        }
      }}
      style={{ alignSelf: "stretch", cursor: "grab", position: "relative" }}>
      <Tooltip label="issues with question">
        <Flex
          display={isValid ? "none" : "flex"}
          position="absolute"
          right="0"
          bottom="0"
          bgColor="red"
          color="white"
          rounded="md"
          h="6"
          w="6"
          alignItems="center"
          justifyContent="center">
          <Icon as={IoMdWarning} />
        </Flex>
      </Tooltip>
      <Flex
        ref={ref}
        border="2px solid transparent"
        _hover={{ border: (isSelected ? "" : "2px solid"), borderColor: "var(--chakra-colors-brand-highlight)" }}
        alignSelf="stretch"
        p="2"
        rounded="md"
        bg={isSelected ? "brand.highlight" : "var(--chakra-colors-chakra-body-bg)"}
        onClick={() => onSelect(id)}
        flexDir="column">
        <HStack
          justifyContent="space-between">
          <Text>{index+1}. {type}</Text>
          <IconButton
            onClick={e => { e.stopPropagation(); onDelete(id) }}
            colorScheme="red"
            minW="unset"
            variant="link"
            icon={<IoMdTrash />}
            aria-label="Delete" />
        </HStack>
        <Flex
          p="2"
          w="100%"
          style={{ aspectRatio: 16 / 9 }}
          rounded="md"
          bgColor="highlight">
          <Text
            fontSize="sm"
            noOfLines={3}
            overflow="hidden"
            maxW="100%"
            maxH="100%"
            >
            {questionText || "No question text"}
          </Text>
        </Flex>
      </Flex>
    </Reorder.Item>
  )
}

export default QuestionCard