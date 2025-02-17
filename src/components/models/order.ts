import { IEvents } from '../base/events';
import { IOrderData } from '../../types/index';

// интерфейс модели данных - данные о заказе

type IPartialOrderData = Partial<Omit<IOrderData, 'total' | 'items'>>;

interface IOrderModel {
	orderErrors: Partial<Record<keyof IPartialOrderData, string>>;
	update(upd: IPartialOrderData): void;
	reset(items: string[], total: number): void;
	getFinalOrder(): IOrderData;
}

// класс, реализующий интерфейс модели данных - данные о заказе

export class OrderModel implements IOrderModel {
	orderErrors: Partial<Record<keyof IPartialOrderData, string>>;
	protected customerData: IPartialOrderData = {};
	protected total: number = 0;
	protected items: string[] = [];

	update(upd: IPartialOrderData): void {
		if (upd.payment) {
			this.customerData.payment = upd.payment;
			delete this.orderErrors.payment;
		}
		if (upd.email) {
			this.customerData.email = upd.email;
			delete this.orderErrors.email;
		}
		if (upd.phone) {
			this.customerData.phone = upd.phone;
			delete this.orderErrors.phone;
		}
		if (upd.address) {
			this.customerData.address = upd.address;
			delete this.orderErrors.address;
		}
		this._changed();
	}

	reset(items: string[], total: number) {
		this.customerData = {};
		this.items = items;
		this.total = total;
		this._changed();
		this.orderErrors = {
			payment: 'пустое поле',
			email: 'пустое поле',
			phone: 'пустое поле',
			address: 'пустое поле',
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

	constructor(protected events: IEvents) {}

	protected _changed() {
		this.events.emit('order:change', {});
	}
}
