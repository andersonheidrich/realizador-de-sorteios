import type { RoundedImageProps } from "./interfaces";

const RoundedImage = ({ src, alt, size = "large" }: RoundedImageProps) => {
  const sizeClasses = {
    small: "w-[75px] h-[75px]",
    medium: "w-[150px] h-[150px]",
    large: "w-[200px] h-[200px]",
  }[size];

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover mb-2 ${sizeClasses}`}
    />
  );
};

export default RoundedImage;
