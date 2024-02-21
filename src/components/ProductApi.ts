import { IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";


interface IProductApi {
	cdn: string;
	getProductList: () => Promise<IProduct[]>;
}
export class ProductApi extends Api implements IProductApi {
	cdn: string;
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
}

// Product Item

// Order - POST