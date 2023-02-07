import { Button, Checkbox, Editable, EditableInput, EditablePreview, Flex, IconButton, Input, InputGroup, InputLeftAddon, InputRightElement, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoMdTrash } from "react-icons/io";
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
      background="highlight">
      <Text fontSize="xl" mb="4">Choices (check correct answers)</Text>
      <Flex
        flexDir="column"
        gap="4">
        { options.every((option: any) => option.value !== undefined && option.id !== undefined)
        && options.map((option: any, index: number) => (
          <Flex gap="4">
            <Flex flexGrow="1" flexDir="row" gap="2" key={option.id} alignItems="center">
              <Editable
                flexGrow="1"
                placeholder={`Type option ${index + 1} here`}
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
          Add Option
        </Button>
      </Flex>
    </Flex>
  )
}

export default MCQAnswers