export class NotFoundError extends Error {}

export class EntityValidationError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
