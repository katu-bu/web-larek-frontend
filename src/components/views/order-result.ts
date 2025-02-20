import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// интерфейс отображений - модальное окно с подтверждением заказа

interface ITotalPrice {
	totalPrice: number;
}

export class OrderResultView extends Component<ITotalPrice> {
	protected _totalPrice: HTMLParagraphElement;
	protected _orderSuccessCloseButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._totalPrice = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			container
		);
		this._orderSuccessCloseButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this._orderSuccessCloseButton.addEventListener('click', () => {
			this.events.emit('succes-close', {});
		});
	}

	set totalPrice(totalPrice: number) {
		this._totalPrice.textContent =
			'Списано ' + totalPrice.toString() + ' синапсов';
	}
}
