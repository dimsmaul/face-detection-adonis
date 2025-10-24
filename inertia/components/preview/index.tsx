import clsx from "clsx";
import React from "react";

export interface PreviewProps {
  label: string | React.ReactNode;
  isLabelTitle?: boolean;
  labelClassName?: string;
  children: string | React.ReactNode;
  className?: string;
  requiredMark?: boolean;
  rightContent?: string | React.ReactNode;
}

const Preview: React.FC<PreviewProps> = (props) => {
  return (
    <div className={props.className}>
      <div className="flex flex-row justify-between items-center">
        {typeof props.label === "string" ? (
          <h3
            // className={`${
            //   props.isLabelTitle
            //     ? "font-medium text-[15px]"
            //     : "text-gray-400 text-custom-3 "
            // } ${props.labelClassName}`}
            className={clsx(
              props.isLabelTitle
                ? "font-medium text-[15px]"
                : "text-gray-400 text-custom-3",
              props.labelClassName
            )}
          >
            {props.label}{" "}
            {props.requiredMark && <span className="text-red-500">*</span>}
          </h3>
        ) : (
          props.label
        )}
        {props.rightContent}
      </div>
      {typeof props.children === "string" ? (
        <p className="text-custom-3">{props.children}</p>
      ) : (
        props.children
      )}
    </div>
  );
};

export default Preview;