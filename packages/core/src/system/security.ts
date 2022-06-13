import * as cryptojs from 'crypto-js';

// todo 安全相关：密码/XSS/JWT
export function sha256(content: string): string {
  return cryptojs.SHA256(content).toString();
}

export function sha256WithSalt(content: string, salt: string): string {
  return cryptojs.algo.SHA256
    .create()
    .update(content)
    .update(salt)
    .finalize()
    .toString();
}

export function sha384(content: string): string {
  return cryptojs.SHA384(content).toString();
}

export function sha384WithSalt(content: string, salt: string): string {
  return cryptojs.algo.SHA384
    .create()
    .update(content)
    .update(salt)
    .finalize()
    .toString();
}
