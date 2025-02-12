import { IEventEmitter } from '../events';
import { IProduct } from '../index';

// интерфейс модели данных - каталог товаров

interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void;
	getProduct(id: string): IProduct;
}

export class CatalogModel implements ICatalogModel {
	items: IProduct[] = [];

	setItems(items: IProduct[]): void {
		this.items = items;
		this._changed();
	}

	getProduct(id: string): IProduct {
		return this.items.find((item) => item.id === id);
	}

	constructor(protected events: IEventEmitter) {}

	protected _changed() {
		this.events.emit('catalog:change', {});
	}
}
