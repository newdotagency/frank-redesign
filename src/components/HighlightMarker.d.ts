// Types for the JS HighlightMarker component, so TypeScript components can use it.
import type { ReactNode } from "react";
export default function HighlightMarker(props: {
    children?: ReactNode;
    delay?: number;
    reduced?: boolean;
    color?: string;
    shade?: string;
}): JSX.Element;
