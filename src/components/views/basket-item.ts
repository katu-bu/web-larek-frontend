import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение элемента корзины

interface IBasketItem {
	id: string;
	title: string;
	price: number | null;
	index: number;
}

export class BasketItemView extends Component<IBasketItem> {
	protected _index: HTMLSpanElement;
	protected _title: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _removeButton: HTMLButtonElement;

	protected _id: string | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._index = ensureElement<HTMLSpanElement>(
			'.basket__item-index',
			container
		);
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

	set id(id: string) {
		this._id = id;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set price(price: number | null) {
		if (price) {
			this._price.textContent = price.toString() + ' синапсов';
		} else {
			this._price.textContent = '';
		}
	}

	set index(index: number) {
		this._index.textContent = index.toString();
	}
}
