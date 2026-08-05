declare const __PRICE_GRAPH_CARD_VERSION__: string;

interface Window {
  customCardHelpers?: {
    handleAction?: (element: Element, hass: unknown, config: unknown, action: string) => void;
  };
  loadCardHelpers?: () => Promise<{
    createCardElement?: (config: unknown) => Promise<{
      constructor?: {
        getConfigElement?: () => unknown;
      };
    }>;
  }>;
  customCards?: Array<{
    type: string;
    name: string;
    description: string;
    version?: string;
  }>;
}

interface Element {
  style: CSSStyleDeclaration;
}

interface SVGElement {
  setAttribute(qualifiedName: string, value: unknown): void;
}
