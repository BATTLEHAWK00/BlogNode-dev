import jwt = require('jsonwebtoken');

export type BlogNodeJwtPayload = Record<string, unknown>;

async function sign<T extends BlogNodeJwtPayload>(payload: T, secret: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, (err, token) => {
      if (err) reject(err);
      resolve(token as string);
    });
  });
}

function getPayload<T extends BlogNodeJwtPayload>(token: string): T | undefined {
  return jwt.decode(token) as T | undefined;
}

function verify<T extends BlogNodeJwtPayload>(token: string, secret: string): Promise<T | undefined> {
  return new Promise<T | undefined>((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) reject(err);
      resolve(payload as T | undefined);
    });
  });
}

export default {
  sign,
  getPayload,
  verify,
};
