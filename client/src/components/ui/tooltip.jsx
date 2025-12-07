import * as React from "react";

export const TooltipProvider = ({ children }) => <>{children}</>;
export const Tooltip = ({ children }) => <>{children}</>;
export const TooltipTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const TooltipContent = ({ children }) => <>{children}</>;
