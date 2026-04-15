/// <reference types="vite/client" />

import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-button': any;
      'w3m-connect-button': any;
      'w3m-account-button': any;
      'w3m-network-button': any;
      'w3m-connect-wallet': any;
    }
  }
}
