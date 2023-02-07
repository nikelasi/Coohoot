import { Button, Checkbox, Editable, EditableInput, EditablePreview, Flex, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputRightElement, SimpleGrid, Text, Tooltip } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoMdTrash, IoMdWarning } from "react-icons/io";
import { MdOnlinePrediction } from "react-icons/md";

interface MCQAnswersProps {
  answers: any;
  options: any;
  updateAnswers: (answers: any) => void;
  updateOptions: (options: any) => void;
}

const genId = () => `option$${Math.random().toString(36).slice(2)}`

const MCQAnswers: React.FC<MCQAnswersProps> = ({
  answers,
  options,
  updateAnswers,
  updateOptions
}: MCQAnswersProps) => {

  useEffect(() => {
    if (options.length < 2) {
      updateOptions([...options, {
        id: genId(),
        value: ""
      }])
    }
  }, [options])

  return (
    <Flex
      rounded="md"
      flexDir="column"
      p="4"
      position="relative"
      background="highlight">
      <Text fontSize="xl">Choices (check correct answers)</Text>
      <Tooltip colorScheme="red" label="at least one of the choices has to be set as answer">
        <Flex
          display={answers.length === 0 ? "flex" : "none"}
          position="absolute"
          top="4"
          left="4"
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
        mt="4"
        flexDir="column"
        gap="4">
        { options.every((option: any) => option.value !== undefined && option.id !== undefined)
        && options.map((option: any, index: number) => (
            <Flex gap="4" key={option.id}>
              <Flex flexGrow="1" flexDir="row" gap="2" alignItems="center">
                <Editable
                  flexGrow="1"
                  placeholder={`Type choice ${index + 1} here`}
                  value={option.value}
                  onChange={val => {
                    updateOptions(options.map((comparedOption: any) => {
                      if (comparedOption.id === option.id) {
                        return { ...option, value: val }
                      }
                      return comparedOption
                    }
                    ))
                  }}>
                  <InputGroup>
                    <InputLeftAddon bg="brand" color="white" children={index + 1} />
                    <Input mr="10" textAlign="left" borderRightRadius={0} as={EditableInput} />
                    <Input mr="10" textAlign="left" borderRightRadius={0} pb="0" pt="2" as={EditablePreview} />
                    <InputRightElement
                      rounded="md"
                      borderLeftRadius={0}
                      bg="brand">
                      <Checkbox
                        isChecked={answers.includes(option.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            updateAnswers([...answers, option.id])
                          } else {
                            updateAnswers(answers.filter((answer: any) => answer !== option.id))
                          }
                        }} />
                      <Tooltip colorScheme="red" label="please fill in a choice">
                        <Flex
                          display={option.value === "" ? "flex" : "none"}
                          position="absolute"
                          right="12"
                          top="0"
                          bottom="0"
                          margin="auto"
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
                    </InputRightElement>
                  </InputGroup>
                </Editable>
              </Flex>
              <IconButton
                onClick={() => {
                  updateAnswers(answers.filter((answer: any) => answer !== option.id))
                  updateOptions(options.filter((comparedOption: any) => comparedOption.id !== option.id))
                }}
                colorScheme="red"
                icon={<IoMdTrash />}
                aria-label="delete" />
            </Flex>
        )) }
        <Button
          variant="ghost"
          onClick={() => {
            updateOptions([...options, { id: genId(), value: "" }])
          }}>
          Add Choice
        </Button>
      </Flex>
    </Flex>
  )
}

export default MCQAnswers