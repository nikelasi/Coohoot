import { VStack, Text, Flex, HStack, IconButton, useColorMode } from "@chakra-ui/react";
import { Reorder } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoMdTrash } from "react-icons/io";

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

  const { question: questionText, id, type } = question

  const [scroll, setScroll] = useState<number>(0)

  const ref = useRef<HTMLDivElement>(null)

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
      style={{ alignSelf: "stretch", cursor: "grab" }}>
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