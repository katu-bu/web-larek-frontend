import { IView } from './iview';
import { IEventEmitter } from '../events';

// отображение кнопки корзины и счетчика товаров на главной странице

export class IconBasketView implements IView {
	protected quantity: HTMLSpanElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmitter
	) {
		this.quantity = container.querySelector(
			'.header__basket-counter'
		) as HTMLSpanElement;

		this.container.addEventListener('click', () => {
			this.events.emit('ui:basket-open', {});
		});
	}

	render(data: { quantity: number }) {
		this.quantity.textContent = data.quantity.toString();
		return this.container;
	}
}
