import { Exception } from "../domain";

import { Constructor } from "./utils";

/**
 * Exception thrown when a **Handler** is not found by the **Command** / **Query** bus.
 */
export class HandlerNotFoundException extends Exception {
  constructor(request: Request<unknown>) {
    super(request.constructor.name);
  }
}

abstract class Request<TResponse> {
  public readonly Response!: TResponse;
}

interface IRequestHandler<TRequest extends Request<TResponse>, TResponse = TRequest["Response"]> {
  readonly target: Constructor<TRequest>;

  execute(request: TRequest): Promise<TResponse>;
}

/**
 * Base class for representing a **Command**:
 *
 * > Change the state of a system but do not return a value.
 */
export abstract class Command<TResult = void> extends Request<TResult> {}

/**
 * Interface for representing a **Command** handler.
 */
export interface ICommandHandler<TCommand extends Command<TResult>, TResult = TCommand["Response"]>
  extends IRequestHandler<TCommand, TResult> {}

/**
 * Interface for representing a **Command** bus.
 */
export interface ICommandBus {
  registerHandler<TCommand extends Command<TResult>, TResult = TCommand["Response"]>(
    commandHandler: ICommandHandler<TCommand, TResult>,
  ): void;

  execute<TCommand extends Command<TResult>, TResult = TCommand["Response"]>(
    command: TCommand,
  ): Promise<TResult>;
}

/**
 * Base class for representing a **Query**:
 *
 * > Return a result and do not change the observable state of the system (are free of side
 * > effects).
 */
export abstract class Query<TResult> extends Request<TResult> {}

/**
 * Type that represents a **Query** handler.
 */
export interface IQueryHandler<TQuery extends Query<TResult>, TResult = TQuery["Response"]>
  extends IRequestHandler<TQuery, TResult> {}

/**
 * Interface for representing a **Query** bus.
 */
export interface IQueryBus {
  registerHandler<TQuery extends Query<TResult>, TResult = TQuery["Response"]>(
    queryHandler: IQueryHandler<TQuery, TResult>,
  ): void;

  execute<TQuery extends Query<TResult>, TResult = TQuery["Response"]>(
    query: TQuery,
  ): Promise<TResult>;
}
