import { Badge, Button, Flex, Heading, HStack, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import { IoMdHammer } from "react-icons/io";
import Modal, { ModalProps } from "../layout/Modal.layout"

interface InvalidQuestionsModal {
  questions: Array<any>;
  setSelectedQuestion: (questionId: string) => void;
}

type Props = ModalProps & InvalidQuestionsModal

const ErrorBadge: React.FC<{ error: string }> = ({ error }: { error: string }) => (
  <Badge colorScheme="red" textTransform="none">{error}</Badge>
)

const InvalidQuestionsModal: React.FC<Props> = ({ questions, setSelectedQuestion, ...modalProps}: Props) => {

  const { onClose } = modalProps
  
  const onFix = (questionId: string) => {
    onClose()
    setSelectedQuestion(questionId)
  }

  return (
    <Modal {...modalProps}>
      <ModalHeader>Save</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">
        <Text>The quiz can't be saved yet, there are still issues with these questions.</Text>
        <Flex gap="2" flexDir="column">
          <Heading size="sm">Issues</Heading>
          {questions.map((question: any, index: number) => {
            const errors = []
            if (question.question === "") errors.push("Question text must be set")
            if (question.type === "MCQ" && question.answers.length === 0) errors.push("At least one choice has to be selected as the answer")
            if (question.type === "MCQ" && question.options.some((option: any) => option.value === "")) errors.push("All choices have to be set")
            if (question.type === "Short Answer" && question.answers.some((answer: any) => answer.value === "")) errors.push("All answers have to be set")
            return {
              index,
              id: question.id,
              type: question.type,
              errors
            }
          })
          .filter((question: any) => question.errors.length > 0)
          .map((question: any) => (
            <Flex gap="2" flexDir="column" bgColor="highlight" key={question.index} p="2" position="relative" rounded="md">
              <HStack justifyContent="space-between">
                <Heading size="sm">Question {question.index + 1} - {question.type}</Heading>
                <Button
                  onClick={() => onFix(question.id)}
                  leftIcon={<IoMdHammer />}
                  size="2xs" p="1" pr="2">
                  Fix
                </Button>
              </HStack>
              <Flex gap="1" flexDir="column">
                {question.errors.map((error: string, index: number) => (
                  <ErrorBadge key={index} error={error} />
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </ModalBody>
    </Modal>
  )
}

export default InvalidQuestionsModal