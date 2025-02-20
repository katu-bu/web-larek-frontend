import { IEvents } from '../base/events';
import { IProduct } from '../../types/index';

// интерфейс модели данных - каталог товаров

interface ICatalogModel {
	get preview(): IProduct;
	set preview(item: IProduct);
	get items(): IProduct[];
	set items(items: IProduct[]);
	getProduct(id: string): IProduct;
}

// класс, реализующий интерфейс модели данных - каталог товаров

export class CatalogModel implements ICatalogModel {
	protected _items: IProduct[] = [];
	protected _preview: IProduct = null;

	constructor(protected events: IEvents) {}

	get items(): IProduct[] {
		return this._items;
	}

	set items(items: IProduct[]) {
		this._items = items;
		this._changed();
	}

	get preview(): IProduct {
		return this._preview;
	}

	set preview(item: IProduct) {
		this._preview = item;
		this._previewChanged();
	}

	getProduct(id: string): IProduct {
		return this.items.find((item) => item.id === id);
	}

	protected _changed() {
		this.events.emit('catalog:change', {});
	}
	protected _previewChanged() {
		this.events.emit('catalog:preview:change', {});
	}
}
