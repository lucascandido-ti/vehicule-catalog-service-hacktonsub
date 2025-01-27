import { Constructor } from "./utils";

/**
 * Base class for representing an **Event**.
 */
export abstract class Event {}

/**
 * Interface for representing an **Event** listener.
 */
export interface IEventListener<TEvent extends Event> {
  readonly target: Constructor<TEvent>;

  handle(event: TEvent): Promise<void>;
}

/**
 * Interface for representing an **Event** bus.
 */
export interface IEventBus {
  addListener<TEvent extends Event>(eventListener: IEventListener<TEvent>): void;

  emit(event: Event): Promise<void>;
}
