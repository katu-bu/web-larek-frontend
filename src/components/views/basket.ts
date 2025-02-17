import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение корзины

interface RenderInput {
	items: HTMLElement[];
	totalPrice: number;
}

export class BasketView extends Component<RenderInput> {
	protected _totalPrice: HTMLSpanElement;
	protected _itemsList: HTMLUListElement;
	protected _makeOrderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._totalPrice = ensureElement<HTMLSpanElement>('.basket__price', container);
		this._makeOrderButton = ensureElement<HTMLButtonElement>('.basket__button', container);
		this._itemsList = ensureElement<HTMLUListElement>('.basket__list', container);

		this._makeOrderButton.addEventListener('click', () => {
			this.events.emit('ui:order-initiate', {});
		});
	}

	render(data: RenderInput) {
		this._itemsList.replaceChildren(...data.items);
		this._totalPrice.textContent = data.totalPrice.toString();
		return this.container;
	}
}
