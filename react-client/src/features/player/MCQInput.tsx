import { SimpleGrid, useRadioGroup, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MCQRadioButton from "./MCQRadioButton";

interface MCQInputProps {
  id: string;
  qnIndex: number;
  answer: string | null | undefined;
  options: any;
  updateAnswer: (answer: string, qnIndex: number) => void;
}

const MCQInput: React.FC<MCQInputProps> = ({ id, options, qnIndex, answer, updateAnswer }: MCQInputProps) => {

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: id,
    onChange: (value: string) => updateAnswer(value, qnIndex),
    value: answer || undefined
  })

  const group = getRootProps()

  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2
      }}
      gap="2"
      textAlign="center"
      w={["90vw", "80vw", "60vw"]}
      p="4"
      {...group}>
      { options.map((option: any, i: number) => {
        const radio = getRadioProps({ value: option.id })
        return (
          <MCQRadioButton
            key={option.id}
            {...radio}>
            {option.value}
          </MCQRadioButton>
        )
      }) }
    </SimpleGrid>
  )
}

export default MCQInput