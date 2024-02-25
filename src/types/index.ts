export type PaymentOptions = 'card' | 'cash' | '';
export type CategoryOptions =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: CategoryOptions;
	price: number | null;
	isAddedToBasket?: boolean;
}

export interface ICatalogEventData {
	catalog: IProduct[];
}

export interface IBasketEventData {
	basket: ProductBasket[];
}

export type ProductBasket = Pick<
	IProduct,
	'id' | 'title' | 'price' | 'isAddedToBasket'
>;

export interface IOrderContact {
	phone: string;
	email: string;
}

export interface IOrderDelivery {
	address: string;
	payment: PaymentOptions;
}

export type IOrderForm = Partial<IOrderContact> & Partial<IOrderDelivery>;

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
