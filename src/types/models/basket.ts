import { IEventEmitter } from "../events";

// интерфейс модели данных - корзина товаров

interface IBasketModel {
  items: Set<string>;
  add(id: string): void;
  remove(id: string): void;
}

export class BasketModel implements IBasketModel {
  items: Set<string> = new Set();

  add(id: string): void {
    this.items.add(id);
    this._changed();
  }

  remove(id: string): void {
    this.items.delete(id);
    this._changed();
  }

  constructor(protected events: IEventEmitter) {}
  protected _changed() {
    this.events.emit('basket:change', {})
  }
}
