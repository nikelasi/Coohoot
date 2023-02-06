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

  // const [dragged, setDragged] = useState<boolean>(false)
  const [scroll, setScroll] = useState<number>(0)

  // TODO: Dragging question to top/bottom of list should scroll the list
  // if question is being dragged, scroll to it
  // const ref = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   if (isSelected) {
  //     ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  //   }
  // }, [isSelected])

  // useEffect(() => {

  // }, [scroll])


  return (
    <Reorder.Item
      id={id}
      value={question}
      whileDrag={{
        opacity: 0.5,
        cursor: "grabbing"
      }}
      // onDrag={(e: PointerEvent)=> {
      //   if (ref.current) {
      //     const parentRect = ref.current.parentElement!.getBoundingClientRect()
      //     const parentTop = parentRect.y
      //     const parentBottom = parentRect.y + parentRect.height
      //     const top = e.clientY
      //     const bottom = e.clientY + ref.current.getBoundingClientRect().height
      //     if (top < parentTop) {
      //       ref.current.scroll(0, 1)
      //       ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
      //     } else if (bottom > parentBottom) {
      //       // ref.current.scrollIntoView({ behavior: "smooth", block: "end" })
      //       ref.current.scroll(0, -1)
      //     }
      //   }
      // }}
      // onDragStart={() => setDragged(true)}
      // onDragEnd={() => setDragged(false)}
      style={{ alignSelf: "stretch", cursor: "grab" }}>
      <Flex
        // ref={ref}
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