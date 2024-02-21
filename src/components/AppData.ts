import {
	IProduct,
	IProductBasket,
	paymentOptions,
	IOrder,

} from '../types';
import { Model } from './base/Model';
import { IEvents } from './base/events';

export class Product extends Model<IProduct> {

	constructor(data: IProduct, events: IEvents) {
			super(data, events);
	}
}

export class Basket extends Model<IProductBasket[]> {
	protected productList: IProductBasket[] = [];

	constructor(events: IEvents) {
    super([], events);
}

	getProductList():void {
		this.events.emit('basket:change', this.productList);
	}

	clearBasket():void {
	}

	removeProduct(productId: string):void {
	}

	addProduct(product: IProduct):void {

	}
	getTotalAmount() {
	
	}
	makeOrder():void {
	}
}

export class Catalog extends Model<IProduct[]> {
	catalogList: IProduct[] = [];

  constructor(events: IEvents) {
    super([], events);
}

	setCatalog(catalog: IProduct[]) {
		this.catalogList = catalog.map(product => ({ ...product, isAddedToBasket: false }));
		this.emitChanges('catalog:updated', { catalog: this.catalogList });
	}
}

class Order extends Model<IOrder> {
	phone: string = '';
	email: string = '';
	address: string = '';
  payment: paymentOptions = 'card';
	total: number = 0;
	items: string[] = [];

	constructor(events: IEvents) {
		super({}, events);
		}	

	setDeliveryField():void{

	}
	setContactField():void{
		
	}

	validateDelivery():void{

	}
	validateContact():void{

	}
}