import { IEvents } from '../../base/events';

// интерфейс модели данных - корзина товаров

interface IBasketModel {
	items: Set<string>;
	add(id: string): void;
	remove(id: string): void;
	isBasketProduct(id: string): boolean;
	clear(): void;
	countItems(): number;
}

// класс, реализующий интерфейс модели данных - корзина товаров
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

	isBasketProduct(id: string): boolean {
		return this.items.has(id);
	}

	clear(): void {
		this.items.clear();
	}

	countItems(): number {
		return this.items.size;
	}

	constructor(protected events: IEvents) {}
	protected _changed() {
		this.events.emit('basket:change', {});
	}
}
