import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение деталей продукта в каталоге

interface RenderInput {
	id: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export class CatalogItemView extends Component<RenderInput> {
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
			this.events.emit('ui:preview-open', {id: this._id});
		});
	}

	render(data: RenderInput) {
		this._id = data.id;
		this._title.textContent = data.title;
		this._image.src = data.image;
		this._category.textContent = data.category;
		if (data.price) {
			this._price.textContent = data.price.toString() + ' синапсов';
		} else {
			this._price.textContent = '';
		}
		return this.container;
	}
}
