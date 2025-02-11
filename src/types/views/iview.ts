import { IEventEmitter } from "../events";

// интерфейс отображений

export interface IViewConstructor {
  new (container: HTMLElement, events?: IEventEmitter): IView;
}

export interface IView {
  render(data: object): HTMLElement;
}