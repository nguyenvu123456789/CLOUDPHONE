import type {
  CSSProperties,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactNode,
} from "react";

export type ComponentType =
  | ReactNode
  | ForwardRefExoticComponent<any>
  | JSX.Element
  | FunctionComponent;

/**
 * ReactNode:
 * ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
 */
export type ChildrenType = ReactNode[] | ReactNode;

export interface ChildrenInterface {
  children?: ChildrenType;
}

export interface BaseCompInterface {
  id?: string;
  className?: string;
  dir?: string;
  children?: ChildrenType;
  component?: ComponentType;
  href?: string;
  title?: string;
  rel?: string;
  target?: string;
  style?: CSSProperties;
  onClick?: any;
  i18n?: {[key: string]: string};
}
