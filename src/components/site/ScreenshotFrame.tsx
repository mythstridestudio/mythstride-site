import Image from "next/image";
import { getAssetPath } from "@/lib/assets";

type ScreenshotFrameProps = {
  title: string;
  caption: string;
  image: { src: string; alt: string };
};

export function ScreenshotFrame({
  title,
  caption,
  image,
}: ScreenshotFrameProps) {
  return (
    <figure className="screenshot-frame">
      <div className="screenshot-frame__viewport">
        <Image
          src={getAssetPath(image.src)}
          alt={image.alt}
          width={720}
          height={1560}
          className="screenshot-frame__shot"
          sizes="(max-width: 640px) 78vw, 320px"
          loading="lazy"
        />
      </div>
      <figcaption>
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
