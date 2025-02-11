import { API_URL } from '../utils/constants';
import { Api } from '../components/base/api';
import { IProduct, IOrderData, IOrderResult } from "../types/data"


// интерфейс API-клиента

export interface IShopAPI {
  getProducts(): Promise<IProduct[]>;
  // getProductDetails: (id: string) => Promise<IProduct>;
  // orderProducts: (order: IOrderData) => Promise<IOrderResult>;
}

export class ShopAPI implements IShopAPI {
  protected api: Api;

  constructor() {
    this.api = new Api(API_URL); 
  }

  getProducts(): Promise<IProduct[]> {
    const rawPromise: Promise<object> = this.api.get("/product");
    // TODO handle type conversion in a safe way
    return rawPromise.then(obj => obj as IProduct[])
  }
}
