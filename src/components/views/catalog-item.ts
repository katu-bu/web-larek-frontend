import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение деталей продукта

interface RenderInput {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

export class CatalogItemView extends Component<RenderInput> {
	protected _title: HTMLHeadingElement;
	protected _description: HTMLParagraphElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _addToBasketButton: HTMLButtonElement;

	protected _id: string | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._title = ensureElement<HTMLHeadingElement>('.card__title');
		this._description = ensureElement<HTMLParagraphElement>('.card__text');
		this._image = ensureElement<HTMLImageElement>('.card__image');
		this._category = ensureElement<HTMLSpanElement>('.card__category');
		this._price = ensureElement<HTMLSpanElement>('.card__price');
		this._addToBasketButton = ensureElement<HTMLButtonElement>('.card__button');

		this._addToBasketButton.addEventListener('click', () => {
			this.events.emit('ui:add-to-basket', { id: this._id });
		});
	}

	render(data: RenderInput) {
		this._id = data.id;
		this._title.textContent = data.title;
		this._description.textContent = data.description;
		this._image.src = data.image;
		this._category.textContent = data.category;
		this._price.textContent = data.price.toString();
		return this.container;
	}
}
