import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { determineCategoryClass } from '../../utils/category';
import { IProduct } from '../../types';

// отображение деталей продукта на превью

type IPreviewProduct = IProduct & {
	alreadyInBasket: boolean;
};

export class CatalogPreviewItemView extends Component<IPreviewProduct> {
	protected _title: HTMLHeadingElement;
	protected _description: HTMLParagraphElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _addToBasketButton: HTMLButtonElement;

	protected _id: string | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
		this._description = ensureElement<HTMLParagraphElement>(
			'.card__text',
			container
		);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
		this._addToBasketButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		this._addToBasketButton.addEventListener('click', () => {
			this.events.emit('ui:add-to-basket', { id: this._id });
		});
	}

	set id(id: string) {
		this._id = id;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set description(description: string) {
		this._description.textContent = description;
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
			this._addToBasketButton.disabled = true;
		}
	}

	set alreadyInBasket(alreadyInBasket: boolean) {
		if (alreadyInBasket) {
			this._addToBasketButton.disabled = true;
		}
	}
}
