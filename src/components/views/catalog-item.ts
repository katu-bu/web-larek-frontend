import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { determineCategoryClass } from '../../utils/category';
import { IProduct } from '../../types';

// отображение деталей продукта в каталоге

type IPartialProduct = Partial<Omit<IProduct, 'description'>>;

export class CatalogItemView extends Component<IPartialProduct> {
	protected _title: HTMLHeadingElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;

	protected _id: string | null = null;

	constructor(container: HTMLButtonElement, protected events: IEvents) {
		super(container);
		this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
		this.container.addEventListener('click', () => {
			this.events.emit('ui:preview-open', { id: this._id });
		});
	}

	set id(id: string) {
		this._id = id;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set image(image: string) {
		this._image.src = image;
	}

	set category(category: string) {
		this._category.textContent = category;
		this._category.classList.add(determineCategoryClass(category));
	}

	set price(price: number | null) {
		if (price) {
			this._price.textContent = price.toString() + ' синапсов';
		} else {
			this._price.textContent = '';
		}
	}
}
