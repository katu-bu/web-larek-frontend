import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение элемента корзины

interface RenderInput {
	id: string;
	title: string;
	price: number | null;
	index: number;
}

export class BasketItemView extends Component<RenderInput> {
	protected _index: HTMLSpanElement;
	protected _title: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _removeButton: HTMLButtonElement;

	protected _id: string | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLSpanElement>('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
		this._removeButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		this._removeButton.addEventListener('click', () => {
			this.events.emit('ui:remove-from-basket', { id: this._id });
		});


	}

	render(data: RenderInput) {
		this._index.textContent = data.index.toString();
		this._id = data.id;
		this._title.textContent = data.title;
		if (data.price) {
			this._price.textContent = data.price.toString() + ' синапсов';
		} else {
			this._price.textContent = '';
		}
		return this.container;
	}
}
