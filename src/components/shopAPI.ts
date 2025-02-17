import { IProduct, IOrderData, IOrderResult } from '../types/index';
import { Api } from './base/api';

// интерфейс API-клиента

interface IShopAPI {
	getProducts(): Promise<IProduct[]>;
	orderProducts: (order: IOrderData) => Promise<IOrderResult>;
}

interface GetProductsResult {
	total: number;
	items: IProduct[];
}

// класс, реализующий интерфейс IShopAPI

export class ShopAPI implements IShopAPI {
	constructor(protected api: Api, protected cdn: string) {}

	getProducts(): Promise<IProduct[]> {
		const rawPromise: Promise<object> = this.api.get('/product');
		return rawPromise.then((data: GetProductsResult) =>
			data.items.map((item) => {
				item.image = this.cdn + item.image;
				return item;
			})
		);
	}

	orderProducts(order: IOrderData): Promise<IOrderResult> {
		const rawPromise: Promise<object> = this.api.post('/order', order);
		return rawPromise.then((data: IOrderResult) => data);
	}
}
