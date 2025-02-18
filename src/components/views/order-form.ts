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

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._address = ensureElement<HTMLInputElement>(
			'[name="address"]',
			container
		);
		this._cardOrderButton = ensureElement<HTMLButtonElement>(
			'[name="card"]',
			container
		);
		this._cashOrderButton = ensureElement<HTMLButtonElement>(
			'[name="cash"]',
			container
		);

		// при вводе адреса генерируется событие `order.address:change`

		this._cardOrderButton.addEventListener('click', () => {
			super.onInputChange('payment', 'card');
			this.payment = 'card';
			// `order.payment:change`
		});

		this._cashOrderButton.addEventListener('click', () => {
			super.onInputChange('payment', 'cash');
			this.payment = 'cash';
			// `order.payment:change`
		});

		// при сабмите формы генерируется событие `order:submit`
		// в связующем коде надо будет обработать закрытие модалки
	}

	handleFormErrors(formErrors: Partial<Record<keyof RenderInput, string>>) {
		super.valid = !formErrors.address && !formErrors.payment;
	}

	set address(value: string) {
		this._address.value = value;
	}

	makeAddressRequired() {
		this._address.required = true
	}

	set payment(value: PaymentMethod) {
		this._cardOrderButton.classList.remove('button_alt-active');
		this._cashOrderButton.classList.remove('button_alt-active');
		if (value === 'card') {
			this._cardOrderButton.classList.add('button_alt-active');
		} else if (value === 'cash') {
			this._cashOrderButton.classList.add('button_alt-active');
		}
	}
}
