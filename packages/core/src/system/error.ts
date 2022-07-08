/* eslint-disable max-classes-per-file */
export class BlogNodeError extends Error {}
export class BlogNodeFatalError extends Error {}

export class BlogNodeServerError extends BlogNodeError {}
export class BlogNodeInternalServerError extends BlogNodeServerError {}
export class BlogNodeRequestError extends BlogNodeServerError {}
