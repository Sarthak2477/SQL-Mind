"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { HandleProps } from "@xyflow/react";

import { BaseHandle } from "@/components/base-handle";

function getFlexDirection(position: string) {
  const flexDirection =
    position === "top" || position === "bottom" ? "flex-col" : "flex-row";
  switch (position) {
    case "bottom":
    case "right":
      return flexDirection + "-reverse justify-end";
    default:
      return flexDirection;
  }
}

const LabeledHandle = React.forwardRef<
  HTMLDivElement,
  HandleProps &
    React.HTMLAttributes<HTMLDivElement> & {
      title: string;
      handleclassname?: string;
      labelclassName?: string;
      labelStyle?: CSSProperties,
    }
>(({ className, labelclassName: labelClassName, labelStyle, title, position, children, ...props }, ref) => (
  <div
    ref={ref}
    title={title}
    className={cn(
      "relative flex items-center",
      getFlexDirection(position),
      className,
    )}
  >
    <BaseHandle position={position} {...props} />
    {
      !children && <label style={labelStyle} className={`px-3 text-foreground ${labelClassName}`}>{title}</label>
    }
    
    { children }
  </div>
));

LabeledHandle.displayName = "LabeledHandle";

export { LabeledHandle };
