import { PropsWithChildren } from "react";

interface FlexRowProps {
    className?: string;
}
export const FlexRow = ({ className, children }: PropsWithChildren<FlexRowProps>) => (
    <div className={`flex flex-wrap flex-row gap-4 ${className}`}>{children}</div>
);
