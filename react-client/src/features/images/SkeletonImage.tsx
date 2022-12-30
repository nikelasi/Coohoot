import { Image, ImageProps, Skeleton, SkeletonProps } from "@chakra-ui/react"
import { useEffect, useState } from "react"

interface SkeletonImageProps {
  skeletonProps?: SkeletonProps
  imageProps?: ImageProps
  src: string;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({
  skeletonProps,
  imageProps,
  src
}: SkeletonImageProps) => {

  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  return (
    <Skeleton
      isLoaded={imageLoaded}
      fadeDuration={0.5}
      {...skeletonProps}>
      <Image
        src={src}
        onLoad={() => setImageLoaded(true)}
        {...imageProps} />
    </Skeleton>
  )
}

export default SkeletonImage