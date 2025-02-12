import { IView } from './iview';
import { IEventEmitter } from '../events';

// интерфейс отображений - модальное окно с деталями заказа: телефон и email

export class OrderDataSecondModalView implements IView {
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;
	protected closeModalButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmitter
	) {
		this.email = container.querySelector('[name="email"]') as HTMLInputElement;
		this.phone = container.querySelector('[name="phone"]') as HTMLInputElement;
		this.closeModalButton = container.querySelector(
			'.modal__close'
		) as HTMLButtonElement;

		this.closeModalButton.addEventListener('click', () => {
			// TODO обработать закрытие модального окна на следующем спринте
		});

		this.container.addEventListener('submit', () => {
			this.events.emit('ui:order-update', {
				email: this.email.value,
				phone: this.phone.value,
			});
			this.events.emit('ui:order-made', {});
			// TODO обработать закрытие модального окна на следующем спринте
		});
	}

	render(_data: {}) {
		return this.container;
	}
}
