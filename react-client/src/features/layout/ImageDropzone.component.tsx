import { useDropzone } from 'react-dropzone';
import { Center, useColorModeValue, Icon, CenterProps, Text, FormErrorMessage, VStack } from '@chakra-ui/react';
import { MdFileUpload } from 'react-icons/md';
import { useEffect } from 'react';

export interface DropzoneState {
  fileRejected: boolean;
  filesSelected: boolean;
  acceptedFiles: Array<File>;
}

interface ImageDropzoneProps {
  dropzoneProps: {
    onDropzoneChange: (dropzoneState: DropzoneState) => void;
  }
}

type Props = ImageDropzoneProps & CenterProps;

const ImageDropzone: React.FC<Props> = ({ dropzoneProps, ...centerProps }: Props) => {

  const { onDropzoneChange } = dropzoneProps;

  const onDrop = (acceptedFiles: Array<File>) => {}

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    }
  })

  const dropText = isDragActive ? 'Drop the image here ...' : 'Drag and drop image here, or click to select image from files';
  const borderColor = isDragActive ? 'brand' : 'highlight'

  const fileRejected = fileRejections.length > 0;
  const filesSelected = acceptedFiles.length > 0 || fileRejections.length > 0;

  const text = !filesSelected ? 'No image selected'
    : fileRejected ? `${fileRejections[0].file.name} is not a valid image file.`
    : `${acceptedFiles[0].name} selected`;

  useEffect(() => {
    onDropzoneChange({
      fileRejected,
      filesSelected,
      acceptedFiles
    })
  }, [fileRejected, filesSelected, acceptedFiles])

  return (
    <VStack
      alignItems="stretch">
      <Text fontSize="sm">
        {text}
      </Text>
      <Center
        position="relative"
        p={10}
        cursor="pointer"
        bg={isDragActive ? "highlight" : 'transparent'}
        _hover={{ bg: "highlight" }}
        transition="background-color 0.2s ease"
        borderRadius={4}
        border="3px dashed"
        borderColor={borderColor}
        color="brand.accent"
        {...getRootProps()}
        {...centerProps}>
        <input {...getInputProps()} />
        <Icon as={MdFileUpload} boxSize="12" />
        <Text textAlign="center" fontSize="sm">{dropText}</Text>
        { fileRejected && <Text
          position="absolute"
          left="1"
          top="1"
          color="red"
          fontSize="xs">
          Please upload a .jpg, .jpeg, or .png file.
        </Text> }
      </Center>
      <Text
        fontSize="xs">
        Only .jpg, .jpeg, or .png files will be accepted
      </Text>
    </VStack>
  )
}

export default ImageDropzone