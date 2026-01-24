declare module 'react-simple-maps' {
  import { ComponentType } from 'react';

  export interface ComposableMapProps {
    projectionConfig?: {
      rotate?: number[];
      scale?: number;
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface GeographiesProps {
    geography: string;
    children: (args: { geographies: any[] }) => React.ReactNode;
  }

  export interface GeographyProps {
    geography: any;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseMove?: (event: React.MouseEvent) => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}

declare module 'd3-scale-chromatic' {
  export function interpolateGreens(t: number): string;
  export function interpolateBlues(t: number): string;
  export function interpolateReds(t: number): string;
  // Add other interpolate functions as needed
}
