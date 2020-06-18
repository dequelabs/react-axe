// @types/requestidlecallback can only be used as a global (it doesn't export
// anything) so we need to declare a module for it
// @see https://github.com/Microsoft/TypeScript/issues/11420
declare module 'requestidlecallback' {
  export function request(
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ): IdleCallbackHandle;
  export function cancel(handle: number): void;
}

// @reference axe-corehttps://github.com/dequelabs/axe-core/blob/develop/lib/core/base/audit.js
declare type AxeCoreNodeResultKey = 'any' | 'all' | 'none';

declare interface AxeWithAudit {
  _audit: {
    data: {
      failureSummaries: {
        any: {
          failureMessage: (args: string[]) => string;
        };
        all: {
          failureMessage: (args: string[]) => string;
        };
        none: {
          failureMessage: (args: string[]) => string;
        };
      };
    };
  };
}
