import { Button, Checkbox, Editable, EditableInput, EditablePreview, Flex, IconButton, Input, InputGroup, InputLeftAddon, InputRightElement, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoMdTrash } from "react-icons/io";

interface ShortAnswerAnswersProps {
  answers: any;
  updateAnswers: (answers: any) => void;
}

const ShortAnswerAnswers: React.FC<ShortAnswerAnswersProps> = ({
  answers,
  updateAnswers
}: ShortAnswerAnswersProps) => {
  
  useEffect(() => {
    if (answers.length === 0) {
      updateAnswers(["/^$/"])
    }
  }, [answers])

  return (
    <Flex
      rounded="md"
      flexDir="column"
      p="4"
      background="highlight">
      <Text fontSize="xl" mb="4">Accepted Answers</Text>
      <Flex flexDir="column" gap="4">
        { answers.every((answer: any) => answer.match(/^\/\^(.*)\$\/(i?)$/))
        && answers.map((answer: any, index: number) => (
          <Flex gap="4" key={index}>
            <Flex flexGrow="1" flexDir="row" gap="2" alignItems="center">
              <Editable
                flexGrow="1"
                placeholder={`Type answer ${index + 1} here`}
                value={answer.match(/^\/\^(.*)\$\/(i?)$/)[1]}
                onChange={val => {
                  const newAnswers = [...answers]
                  newAnswers[index] = `/^${val}$/` + (answer.at(-1) === "i" ? "i" : "")
                  updateAnswers(newAnswers)
                }}>
                <InputGroup>
                  <InputLeftAddon bg="brand" color="white" children={index + 1} />
                  <Input mr="40" textAlign="left" borderRightRadius={0} as={EditableInput} />
                  <Input mr="40" textAlign="left" borderRightRadius={0} pb="0" pt="2" as={EditablePreview} />
                  <InputRightElement
                    color="white"
                    rounded="md"
                    borderLeftRadius={0}
                    w="40"
                    bg="brand">
                    <Checkbox
                      isChecked={answer.at(-1) !== "i"}
                      onChange={e => {
                        const newAnswers = [...answers]
                        if (e.target.checked) {
                          newAnswers[index] = answer.slice(0, -1)
                        } else {
                          newAnswers[index] = answer + "i"
                        }
                        updateAnswers(newAnswers)
                      }}>
                      Case Sensitive
                    </Checkbox>
                  </InputRightElement>
                </InputGroup>
              </Editable>
            </Flex>
            <IconButton
              onClick={() => updateAnswers(answers.filter((_: any, i: number) => i !== index))}
              colorScheme="red"
              icon={<IoMdTrash />}
              aria-label="delete" />
          </Flex>
        )) }
        <Button
          onClick={() => updateAnswers([...answers, "/^$/"])}
          variant="ghost">
          Add Answer
        </Button>
      </Flex>
    </Flex>
  )
}

export default ShortAnswerAnswers