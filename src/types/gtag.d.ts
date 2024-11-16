interface GtagParams {
  [key: string]: string | number | boolean;
}

declare global {
  interface Window {
    gtag: (command: string, action: string, params: GtagParams) => void;
    dataLayer: Array<unknown>;
  }
}

export {};