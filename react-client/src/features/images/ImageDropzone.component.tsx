import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import { Center, Icon, CenterProps, Text, VStack } from '@chakra-ui/react';
import { MdFileUpload } from 'react-icons/md';
import { useEffect, useState } from 'react';

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

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1000 * 1000,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    }
  })

  const dropText = isDragActive ? 'Drop the image here ...' : 'Drag and drop image here, or click to select image from files';
  const borderColor = isDragActive ? 'brand' : 'highlight'

  const fileRejected = fileRejections.length > 0;
  const filesSelected = acceptedFiles.length > 0 || fileRejections.length > 0;

  const [text, setText] = useState('No image selected');
  const [error, setError] = useState<string | null>(null);

  const validateDrop = (acceptedFiles: Array<File>, fileRejections: Array<FileRejection>) => {
    if (acceptedFiles.length > 0) {
      setText(`${acceptedFiles[0].name} selected`)
      setError(null);
      return;
    }

    if (fileRejections.length > 0) {
      fileRejections.forEach((file: FileRejection) => {
        file.errors.forEach((err: FileError) => {
          if (err.code === "file-too-large") {
            setError(`Please upload a file smaller than 10MB.`);
            setText(`${file.file.name} is too large.`)
          }
  
          if (err.code === "file-invalid-type") {
            setError(`Please upload a .jpg, .jpeg, or .png file.`);
            setText(`${file.file.name} is not a valid image file.`)
          }
  
          if (err.code === "too-many-files") {
            setError("Please upload only one file.");
            setText(`Too many files selected.`)
          }
        });
      });
      return
    }

    setText('No image selected');
    setError(null);
  }

  useEffect(() => {
    validateDrop(acceptedFiles, fileRejections);
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
        { error && <Text
          position="absolute"
          left="1"
          top="1"
          color="red"
          fontSize="xs">
          {error}
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