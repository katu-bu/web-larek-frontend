import { IEventEmitter } from "../events";
import { IOrderData } from "../index";

// интерфейс модели данных - данные о заказе

export interface IPartialOrderData {
  payment?: string;
  email?: string;
  phone?: number;
  address?: string;
}

interface IOrderModel {
  update(upd: IPartialOrderData): void;
  clear(total: number, items: string[]): void;
  getFinalOrder(): IOrderData;
}

export class OrderModel implements IOrderModel {
  protected customerData: IPartialOrderData = {};
  protected total: number = 0;
  protected items: string[] = [];

  update(upd: IPartialOrderData): void {
    if (upd.payment) {
      this.customerData.payment = upd.payment;
    }
    if (upd.email) {
      this.customerData.email = upd.email;
    }
    if (upd.phone) {
      this.customerData.phone = upd.phone;
    }
    if (upd.address) {
      this.customerData.address = upd.address;
    }
    this._changed();
  }

  clear(total: number, items: string[]) {
    this.total = total;
    this.items = items;
    this.customerData = {};
    this._changed();
  }

  getFinalOrder(): IOrderData {
    return {
      payment: this.customerData.payment, 
      email: this.customerData.email,
      phone: this.customerData.phone,
      address: this.customerData.address,
      total: this.total,
      items: this.items
    }
  }

  constructor(protected events: IEventEmitter) {}

  protected _changed() {
    this.events.emit('order:change', {})
  }
}