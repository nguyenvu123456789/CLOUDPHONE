import { ReactElement } from "react";
import { mixClass } from "class-lib";
import build from "reshow-build";
import NextImage from "next/image";

import type {
  ComponentType,
  BaseCompInterface,
} from "@/types/BaseCompInterface";

interface ItemProps extends BaseCompInterface {
  divided?: boolean;
}

interface ItemViewProps extends ItemProps {
  moreDisplayStyle?: "inline" | "block";
  image?: ComponentType;
  altImage?: ComponentType;
  content?: ComponentType;
  more?: ComponentType;
  truncateContent?: boolean;
}

interface ButtonProps extends BaseCompInterface {
  primary?: boolean;
  disabled?: boolean;
  color?: string;
}

interface SegmentHeaderProps extends BaseCompInterface {
  header?: string;
  headerClassName?: string;
}

interface TitleProps extends BaseCompInterface {
  fontSize?: string;
}

type SafeNumber = number | `${number}` | undefined;

interface ImageProps extends BaseCompInterface {
  src: string;
  nextWidth?: SafeNumber;
  nextHeight?: SafeNumber;
  alt?: string;
  wrap?: boolean;
  quality?: number;
  wrapperClassName?: string;
  width?: any;
  height?: any;
  nextFill?: boolean;
  priority?: boolean;
  loading?: "eager" | "lazy";
  placeholder?: "blur" | "empty";
}

export const Content = ({
  className,
  ...props
}: BaseCompInterface): JSX.Element => {
  return (
    <div
      {...props}
      role="contentinfo"
      className={mixClass("content", className)}
    />
  );
};

export const Segment = ({
  component = "div",
  children,
  className,
  ...props
}: BaseCompInterface) => {
  return build(component)(
    {
      ...props,
      className: mixClass("segment", "block border rounded-md", className),
    },
    children
  );
};

export const SegmentHeader = ({
  header,
  headerClassName = "mb-3 font-bold",
  ...props
}: SegmentHeaderProps): JSX.Element => {
  const headerEl = header ? (
    <Header className={headerClassName}>{header}</Header>
  ) : null;
  return (
    <>
      {headerEl}
      <Segment {...props} />
    </>
  );
};

export const Icon = ({
  component = "div",
  children,
  className,
  ...props
}: BaseCompInterface) => {
  return build(component)(
    {
      ...props,
      className: mixClass("icon", className),
    },
    build(children)()
  );
};

export const Image = ({
  src,
  wrap,
  wrapperClassName,
  width,
  height,
  nextWidth,
  nextHeight,
  nextFill,
  priority,
  quality,
  placeholder,
  loading,
  alt = "",
  ...props
}: ImageProps) => {
  // https://nextjs.org/docs/app/api-reference/components/image
  const imgEl = build(
    nextWidth || nextHeight || nextFill ? (
      <NextImage
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={src}
        width={nextWidth}
        height={nextHeight}
        fill={nextFill}
        src={src}
        alt={alt}
        loading={loading}
      />
    ) : (
      "img"
    )
  )({
    ...props,
    src,
    alt,
  });
  if (wrap) {
    const classes = mixClass("image", wrapperClassName, {
      [width]: width,
      [height]: height,
    });
    return <div className={classes}>{imgEl}</div>;
  } else {
    return imgEl;
  }
};

export const CircularImage = ({
  className,
  ...props
}: ImageProps): JSX.Element => {
  return <Image className={mixClass(className, "rounded-full")} {...props} />;
};

export const Button = ({
  className,
  component = "button",
  primary,
  color = "blue",
  disabled,
  ...props
}: ButtonProps) => {
  const comp = build(component);
  const primaryClass = mixClass("py-1.5 px-3 text-white rounded-full", {
    "bg-cm-blue-b0e": disabled,
    "bg-cm-blue-05a hover:bg-cm-blue-009": !disabled && color === "blue",
    "bg-cm-green-3ac hover:bg-cm-green-00a": !disabled && color === "green",
  });

  return comp({
    className: mixClass("button btn cursor-pointer", className, {
      [primaryClass]: primary,
    }),
    ...props,
  });
};

export const Header = ({
  component = "div",
  className,
  ...props
}: BaseCompInterface) => {
  return build(component)({
    ...props,
    className: mixClass("header", className),
  });
};

export const Title = ({
  fontSize = "text-2xl",
  className,
  ...props
}: TitleProps): JSX.Element => {
  return (
    <div
      {...props}
      className={mixClass("title font-bold", fontSize, className)}
    />
  );
};

export const List = ({
  component = "div",
  ...props
}: BaseCompInterface) => {
  return build(component)({
    ...props,
    role: "list",
  });
};

export const Item = ({
  divided,
  className,
  component = "div",
  ...props
}: ItemProps) => {
  const dividedClass = {
    "first:mt-0 first:border-t-[0]": divided,
    "last:mb-0 ": divided,
    "border-t": divided,
  };
  return build(component)({
    ...props,
    className: mixClass("item", className, dividedClass),
  });
};

export const ItemView = ({
  altImage,
  image,
  content,
  more,
  moreDisplayStyle = "inline",
  truncateContent,
  className,
  ...props
}: ItemViewProps): JSX.Element => {
  let thisImage;
  let thisContent;
  let thisMore;
  if (altImage) {
    thisImage = build(altImage)();
  } else if (image) {
    thisImage = build(image)({
      wrap: true,
      wrapperClassName: "flex-none flex items-center",
    });
  }
  if (content) {
    const contentEl: ReactElement = content as ReactElement;
    thisContent = build(content)({
      className: mixClass(
        contentEl.props?.className,
        "flex-initial pl-3 self-center",
        {
          "break-words": !truncateContent,
          truncate: truncateContent,
          grow: !more || moreDisplayStyle === "inline",
          "after:basis-full flex-initial": more && moreDisplayStyle === "block",
        }
      ),
    });
  }
  if (more) {
    const moreEl: ReactElement = more as ReactElement;
    thisMore = build(more)({
      className: mixClass(moreEl.props?.className, {
        "flex-none self-center": moreDisplayStyle === "inline",
      }),
    });
  }
  return (
    <Item
      {...props}
      className={mixClass(className, "flex", {
        "flex-wrap": moreDisplayStyle === "block",
        "flex-nowrap": moreDisplayStyle === "inline",
      })}
    >
      {thisImage}
      {thisContent}
      {thisMore}
    </Item>
  );
};
