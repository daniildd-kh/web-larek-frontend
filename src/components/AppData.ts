import {
	IProduct,
	ProductBasket,
	PaymentOptions,
	IOrder,
	IBasketEventData,
	FormErrors,
	IOrderForm,
} from '../types';
import { Model } from './base/Model';
import { IEvents } from './base/events';

export class Product extends Model<IProduct> {
	constructor(data: IProduct, events: IEvents) {
		super(data, events);
	}
}

export class Basket extends Model<ProductBasket[]> {
	protected productList: ProductBasket[] = [];

	constructor(events: IEvents) {
		super([], events);
	}

	getproductList(): IBasketEventData {
		return { basket: this.productList };
	}

	changeProductList(): void {
		this.events.emit('basket:change', this.productList);
	}

	clearBasket(): void {
		this.productList = [];
	}

	removeProduct(product: IProduct): void {
		const productId = product.id;
		this.productList = this.productList.filter((product) => {
			return product.id !== productId;
		});
		this.changeProductList();
	}

	addProduct(product: IProduct): void {
		const productIndex = this.productList.findIndex((p) => p.id === product.id);
		if (productIndex === -1) {
			this.productList.push(product);
		}
		this.changeProductList();
	}

	getTotalAmount() {
		return this.productList.reduce((totalAmount, product) => {
			return totalAmount + product.price;
		}, 0);
	}

	getProductIds(): string[] {
		return this.productList.map((product) => product.id);
	}

	makeOrder(): void {
		if (this.productList.length > 0) {
			this.emitChanges('basket:order');
		}
	}
}

export class Catalog extends Model<IProduct[]> {
	catalogList: IProduct[] = [];

	constructor(events: IEvents) {
		super([], events);
	}

	setCatalog(catalog: IProduct[]) {
		this.catalogList = catalog.map((product) => ({
			...product,
			isAddedToBasket: false,
		}));
		this.emitChanges('catalog:updated', { catalog: this.catalogList });
	}
}

export class Order extends Model<IOrder> {
	order: IOrderForm = {
		phone: '',
		email: '',
		address: '',
		payment: '',
	};
	total?: number = 0;
	items?: string[] = [];
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		super({}, events);
	}

	setDeliveryField(
		field: keyof IOrderForm,
		value: IOrderForm[keyof IOrderForm]
	) {
		if (field === 'payment') {
			this.order[field] = value as PaymentOptions;
		}
		if (field === 'address') {
			this.order[field] = value;
		}

		if (this.validateDelivery()) {
			this.events.emit('order.delivery:ready', this.order);
		}
	}
	setContactsField(
		field: keyof IOrderForm,
		value: IOrderForm[keyof IOrderForm]
	) {
		if (field !== 'payment') {
			this.order[field] = value;
		}

		if (this.validateContacts()) {
			this.events.emit('order.contacts:ready', this.order);
		}
	}

	validateDelivery() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change:delivery', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		if (!this.order.email) {
			errors.email = 'Необходимо указать адрес электронной почты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change:contacts', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
