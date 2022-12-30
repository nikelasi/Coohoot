import { Circle, AvatarProps, SkeletonCircle, SkeletonProps, Image, SquareProps } from "@chakra-ui/react"
import { useEffect, useState } from "react"

type SkeletonAvatarProps = { src: string } & SquareProps & { skeletonProps?: SkeletonProps }

const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  src,
  skeletonProps,
  ...circleProps
}: SkeletonAvatarProps) => {

  const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false)

  useEffect(() => {
    setAvatarLoaded(false)
  }, [src])

  // converted css var for chakra color
  const cssVarColor = `var(--chakra-colors-${(circleProps.color as string).replace(".", "-")})`
  const borderWidth = circleProps.border ? (circleProps.border as string).split(" ")[0] : "0px"
  const imgPadding = `${parseInt(borderWidth.replace("px", "")) - 1}px`

  const beforeBorder = {
    border: `${circleProps.border} ${cssVarColor}`,
    content: "''",
    position: "absolute",
    inset: "0 0 0 0",
    visibility: "visible",
    borderRadius: "full",
    zIndex: 1
  }

  return (
    <SkeletonCircle
      isLoaded={avatarLoaded}
      fadeDuration={0.5}
      size={`${circleProps.size as number / 4}rem`}
      position="relative"
      opacity={1}
      _before={!avatarLoaded ? beforeBorder : undefined}
      {...skeletonProps}>
      <Circle
        overflow="hidden"
        position="relative"
        _before={beforeBorder}
        {...circleProps}
        border={undefined}>
        <Image
          p={imgPadding}
          rounded="full"
          position="absolute"
          inset="0 0 0 0"
          src={src}
          onLoad={() => setAvatarLoaded(true)} />
      </Circle>
    </SkeletonCircle>
  )
}

export default SkeletonAvatar