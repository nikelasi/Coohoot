import { Box, useRadio } from "@chakra-ui/react";

const MCQRadioButton = (props: any) => {

  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        borderColor="brand"
        px="5"
        py="3"
        _checked={{
          bg: 'brand',
          color: 'white',
        }}
        _focus={{
          boxShadow: "outline",
        }}>
        {props.children}
      </Box>
    </Box>
  );
};

export default MCQRadioButton;
