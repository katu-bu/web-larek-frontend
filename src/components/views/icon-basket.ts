import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение кнопки корзины и счетчика товаров на главной странице

interface RenderInput {
	quantity: number;
}

export class IconBasketView extends Component<RenderInput> {
	protected _quantity: HTMLSpanElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._quantity = ensureElement<HTMLSpanElement>('.header__basket-counter');

		this.container.addEventListener('click', () => {
			this.events.emit('ui:basket-open', {});
		});
	}

	render(data: RenderInput) {
		this._quantity.textContent = data.quantity.toString();
		return this.container;
	}
}
