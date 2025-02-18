import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// интерфейс отображений - модальное окно с подтверждением заказа

interface RenderInput {
	totalPrice: number;
}

export class OrderResultView extends Component<RenderInput> {
	protected _totalPrice: HTMLParagraphElement;
	protected _orderSuccessCloseButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._totalPrice = ensureElement<HTMLParagraphElement>(
			'.order-success__description', container
		);
		this._orderSuccessCloseButton = ensureElement<HTMLButtonElement>(
			'.order-success__close', container
		);

		this._orderSuccessCloseButton.addEventListener('click', () => {
			this.events.emit('succes-close', {});
		});
	}

	render(data: RenderInput) {
		this._totalPrice.textContent = 'Списано ' + data.totalPrice.toString() + ' синапсов';
		return this.container;
	}
}
