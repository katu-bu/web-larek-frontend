import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение корзины

interface IBasket {
	items: HTMLElement[];
	totalPrice: number;
}

export class BasketView extends Component<IBasket> {
	protected _totalPrice: HTMLSpanElement;
	protected _itemsList: HTMLUListElement;
	protected _makeOrderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._totalPrice = ensureElement<HTMLSpanElement>(
			'.basket__price',
			container
		);
		this._makeOrderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this._itemsList = ensureElement<HTMLUListElement>(
			'.basket__list',
			container
		);

		this._makeOrderButton.addEventListener('click', () => {
			this.events.emit('ui:order-initiate', {});
		});
	}

	set itemsList(items: HTMLElement[]) {
		this._itemsList.replaceChildren(...items);
	}

	set totalPrice(totalPrice: number) {
		if (totalPrice) {
			this._totalPrice.textContent = totalPrice.toString() + ' синапсов';
		} else {
			this._totalPrice.textContent = '';
			this._makeOrderButton.disabled = true;
		}
	}
}
