import { IEvents } from '../base/events';
import { IProduct } from '../../types/index';

// интерфейс модели данных - каталог товаров

interface ICatalogModel {
	items: IProduct[];
	preview: IProduct;
	setItems(items: IProduct[]): void;
	getProduct(id: string): IProduct;
	setPreview(item: IProduct): void;
}

// класс, реализующий интерфейс модели данных - каталог товаров

export class CatalogModel implements ICatalogModel {
	items: IProduct[] = [];
	preview: IProduct = null;

	setItems(items: IProduct[]): void {
		this.items = items;
		this._changed();
	}

	getProduct(id: string): IProduct {
		return this.items.find((item) => item.id === id);
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this._previewChanged();
	}

	constructor(protected events: IEvents) {}

	protected _changed() {
		this.events.emit('catalog:change', {});
	}
	protected _previewChanged() {
		this.events.emit('catalog:preview:change', {});
	}

}
