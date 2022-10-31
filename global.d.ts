/* eslint-disable semi */
/* eslint-disable no-var */
declare global {
  // function someFunction(): string;
  var leomatchPeer: { id: string, access_hash: string } | undefined;
  var api: { call: (methodName: string, args?: { [key: string]: any }, options?: { [key: string]: any }) => any };
}

export {}