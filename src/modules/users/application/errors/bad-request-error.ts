export class NotFoundError extends Error {}

export class BadRequestError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}
