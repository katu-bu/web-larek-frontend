import { Form } from '../../components/common/view/form';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { PaymentMethod } from '../../types';

// отображение деталей заказа: способ оплаты и адрес доставки

interface RenderInput {
	payment?: PaymentMethod;
	address?: string;
}

export class OrderFormView extends Form<RenderInput> {
	protected _address: HTMLInputElement;
	protected _cardOrderButton: HTMLButtonElement;
	protected _cashOrderButton: HTMLButtonElement;
	protected _nextButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._address = ensureElement<HTMLInputElement>('[name="address"]');
		this._cardOrderButton = ensureElement<HTMLButtonElement>('[name="card"]');
		this._cashOrderButton = ensureElement<HTMLButtonElement>('[name="cash"]');
		this._nextButton = ensureElement<HTMLButtonElement>('.order__button');

		// при вводе адреса генерируется событие `order.address:change`

		this._cardOrderButton.addEventListener('click', () => {
			super.onInputChange('payment', 'card');
			// `order.payment:change`
		});

		this._cashOrderButton.addEventListener('click', () => {
			super.onInputChange('payment', 'cash');
			// `order.payment:change`
		});

		// при сабмите формы генерируется событие `order:submit`
		// в связующем коде надо будет обработать закрытие модалки
	}

	set address(value: string) {
		this._address.value = value;
	}

	set payment(value: PaymentMethod) {
		//TODO сделать кнопку нажатой
	}
}
