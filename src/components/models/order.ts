import { IEvents } from '../base/events';
import { IOrderData, PaymentMethod } from '../../types/index';

// интерфейс модели данных - данные о заказе

type IPartialOrderData = Partial<Omit<IOrderData, 'total' | 'items'>>;

interface IOrderModel {
	orderErrors: Partial<Record<keyof IPartialOrderData, string>>;
	updatePayment(newValue: PaymentMethod, validationMessage: string): void;
	updateEmail(newValue: string, validationMessage: string): void;
	updatePhone(newValue: string, validationMessage: string): void;
	updateAddress(newValue: string, validationMessage: string): void;
	reset(items: string[], total: number): void;
	getFinalOrder(): IOrderData;
}

// класс, реализующий интерфейс модели данных - данные о заказе

export class OrderModel implements IOrderModel {
	orderErrors: Partial<Record<keyof IPartialOrderData, string>>;
	customerData: IPartialOrderData;
	total: number;
	items: string[];

	constructor(protected events: IEvents) {}

	updatePayment(newValue: PaymentMethod) {
		this.customerData.payment = newValue;
		delete this.orderErrors.payment;
		this._changed();
	}

	updateEmail(newValue: string, validationMessage: string) {
		this.customerData.email = newValue;
		this.handleValidationError('email', validationMessage);
		this._changed();
	}

	updatePhone(newValue: string, validationMessage: string) {
		this.customerData.phone = newValue;
		this.handleValidationError('phone', validationMessage);
		this._changed();
	}

	updateAddress(newValue: string, validationMessage: string) {
		this.customerData.address = newValue;
		this.handleValidationError('address', validationMessage);
		this._changed();
	}

	private handleValidationError(
		key: keyof IPartialOrderData,
		validationMessage: string
	) {
		if (validationMessage === '') {
			delete this.orderErrors[key];
		} else {
			this.orderErrors[key] = validationMessage;
		}
	}

	reset(items: string[], total: number) {
		this.customerData = {
			email: '',
			address: '',
			phone: '',
		};
		this.items = items;
		this.total = total;
		this._changed();
		this.orderErrors = {
			payment: 'Заполните это поле.',
			email: 'Заполните это поле.',
			phone: 'Заполните это поле.',
			address: 'Заполните это поле.',
		};
	}

	getFinalOrder(): IOrderData {
		return {
			payment: this.customerData.payment,
			email: this.customerData.email,
			phone: this.customerData.phone,
			address: this.customerData.address,
			total: this.total,
			items: this.items,
		};
	}

	protected _changed() {
		this.events.emit('order:change', {});
	}
}
