import { Input } from "@chakra-ui/react"

interface ShortAnswerInputProps {
  answer: string | null | undefined;
  qnIndex: number;
  updateAnswer: (answer: string, qnIndex: number) => void;
}

const ShortAnswerInput: React.FC<ShortAnswerInputProps> = ({ answer, qnIndex, updateAnswer }: ShortAnswerInputProps) => {
  return (
    <Input w={["90vw", "80vw", "60vw"]} value={answer || ""} onChange={e => updateAnswer(e.target.value, qnIndex)} />
  )
}

export default ShortAnswerInput