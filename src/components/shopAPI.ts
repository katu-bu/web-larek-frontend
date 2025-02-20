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
		return this.api.get('/product').then((data: GetProductsResult) =>
			data.items.map((item) => {
				item.image = this.cdn + item.image;
				return item;
			})
		);
	}

	orderProducts(order: IOrderData): Promise<IOrderResult> {
		return this.api.post('/order', order).then((data: IOrderResult) => data);
	}
}
