/**
 * Base class for all exceptions.
 */
export abstract class Exception extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }
}
