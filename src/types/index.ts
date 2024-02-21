export type paymentOptions = 'card' | 'cash';
export type categoryOptions = 'софт-скил' | 'другое' | 'дополнительно' | 'кнопка' | 'хард-скил';

export interface IProduct {
	id: string;
  title: string;
	description: string;
	image: string;
	category: categoryOptions;
	price: number;
  isAddedToBasket: boolean;
}

export interface ICatalogEventData{
  catalog: IProduct[];
}

export interface IBasketEventData{
  basket: IProductBasket[];
}

export type IProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;


export interface IOrderContact {
  phone: string;
  email: string;
}

export interface IOrderDelivery{
  address: string;
  payment: paymentOptions;
}

export interface IOrder extends IOrderContact, IOrderDelivery {
  total: number;
  items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult{
  id: string;
  total: number;
}