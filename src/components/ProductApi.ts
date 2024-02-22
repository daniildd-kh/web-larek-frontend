import { IOrder, IProduct, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";


interface IProductApi {
	cdn: string;
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	submitOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class ProductApi extends Api implements IProductApi {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Product List
	getProductList(): Promise<IProduct[]> {
		return this.get(`/product/`).then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	// Product Item
	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/lot/${id}`).then(
				(item: IProduct) => ({
						...item,
						image: this.cdn + item.image,
				}));
	}

	// Order - POST
	submitOrder(order: IOrder): Promise<IOrderResult>{
		return this.post('/order', order).then(
			(data: IOrderResult) => data
	);
	}

}