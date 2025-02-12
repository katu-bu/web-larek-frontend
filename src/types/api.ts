import { IProduct, IOrderData, IOrderResult } from '../types/index';

// интерфейс API-клиента

export interface IShopAPI {
	getProducts(): Promise<IProduct[]>;
	getProductDetails: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrderData) => Promise<IOrderResult>;
}
