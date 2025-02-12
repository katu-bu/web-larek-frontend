import { IView } from './iview';
import { IEventEmitter } from '../events';

// отображение модального окна с корзиной

export class BasketView implements IView {
	protected totalPrice: HTMLSpanElement;
	protected itemsList: HTMLUListElement;
	protected closeModalButton: HTMLButtonElement;
	protected makeOrderButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmitter
	) {
		this.totalPrice = container.querySelector(
			'.basket__price'
		) as HTMLSpanElement;
		this.makeOrderButton = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		this.closeModalButton = container.querySelector(
			'.modal__close'
		) as HTMLButtonElement;
		this.itemsList = container.querySelector(
			'.basket__list'
		) as HTMLUListElement;

		this.makeOrderButton.addEventListener('click', () => {
			this.events.emit('ui:order-initiate', {});
		});

		this.closeModalButton.addEventListener('click', () => {
			// TODO обработать закрытие модального окна на следующем спринте
		});
	}

	render(data: { items: HTMLElement[]; totalPrice: number }) {
		this.itemsList.replaceChildren(...data.items);
		this.totalPrice.textContent = data.totalPrice.toString();
		return this.container;
	}
}
