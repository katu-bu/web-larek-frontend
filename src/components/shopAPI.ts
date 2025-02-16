import { IProduct, IOrderData, IOrderResult } from '../types/index';
import { Api } from './base/api';
import { API_URL } from '../utils/constants';

// интерфейс API-клиента

interface IShopAPI {
	getProducts(): Promise<IProduct[]>;
	orderProducts: (order: IOrderData) => Promise<IOrderResult>;
}

// класс, реализующий интерфейс IShopAPI

export class ShopAPI implements IShopAPI {
	protected api: Api;

	constructor() {
		this.api = new Api(API_URL);
	}

	getProducts(): Promise<IProduct[]> {
		const rawPromise: Promise<object> = this.api.get('/product');
		return rawPromise.then((obj) => obj as IProduct[]);
	}

	orderProducts(order: IOrderData): Promise<IOrderResult> {
		const rawPromise: Promise<object> = this.api.post('/order', order);
		return rawPromise.then((obj) => obj as IOrderResult);
	}
}
