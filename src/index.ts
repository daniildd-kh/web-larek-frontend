import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductApi } from './components/ProductApi';
import { Catalog, Basket, Order } from './components/AppData';
import {
	ICatalogEventData,
	IProduct,
	IOrder,
	IOrderForm,
} from './types';
import { Modal } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { PageUI } from './components/Page';
import { CardPreviewUI, CardUI } from './components/Card';
import { BasketUI } from './components/Basket';
import { OrderContactFormUI, OrderDeliveryUI } from './components/Order';
import { SuccessUI } from './components/Success';

// шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactFormTemplate =
	ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new ProductApi(CDN_URL, API_URL);
const eventEmmiter = new EventEmitter();
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	eventEmmiter
);

const catalog = new Catalog(eventEmmiter);
const basket = new Basket(eventEmmiter);
const order = new Order(eventEmmiter);
const page = new PageUI(document.body, eventEmmiter);
const basketUI = new BasketUI(cloneTemplate(basketTemplate), eventEmmiter);
const orderDeliveryUI = new OrderDeliveryUI(
	cloneTemplate(orderDeliveryTemplate),
	eventEmmiter
);
const orderContactFormUI = new OrderContactFormUI(
	cloneTemplate(orderContactFormTemplate),
	eventEmmiter
);
const successUI = new SuccessUI(cloneTemplate(successTemplate), {
	onClick: () => modal.close(),
});

const getProductsApi = () => api
	.getProductList()
	.then((data) => {
		catalog.setCatalog(data);
	})
	.catch((error) => {
		console.log(error);
	});

getProductsApi();

// Каталог обновлен
eventEmmiter.on('catalog:updated', (data: ICatalogEventData) => {

	const catalog = data.catalog.map((product) => {
		const catalogCard = new CardUI('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => eventEmmiter.emit('product:open', product),
		});
		return catalogCard.render({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.image,
			category: product.category,
		});
	});
	page.catalog = catalog;
});

// Товар открыт
eventEmmiter.on('product:open', (product: IProduct) => {
	const cardPreview = new CardPreviewUI(
		'card',
		cloneTemplate(cardPreviewTemplate),
		{
			onClick: () => {
				product.isAddedToBasket = !product.isAddedToBasket;
				if (product.isAddedToBasket) {
					eventEmmiter.emit('product:add', product);
				} else {
					eventEmmiter.emit('product:remove', product);
				}
			},
		}
	);
	const cardRendered = {
		content: cardPreview.render({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.image,
			description: product.description,
			category: product.category,
			isAddedToBasket: product.isAddedToBasket,
		}),
	};
	modal.render(cardRendered);
});

// Товар добавлен в корзину
eventEmmiter.on('product:add', (product: IProduct) => {
	basket.addProduct(product);
	modal.close();
});
// Товар убран из корзины
eventEmmiter.on('product:remove', (product: IProduct) => {
	basket.removeProduct(product);
});

// Корзина обновлена
eventEmmiter.on('basket:change', (basket: IProduct[]) => {
	page.busketNumber = basket.length;
});

// Корзина открыта
eventEmmiter.on('basket:open', () => {
	const basketData = basket.getproductList().basket;
	const cardBasketTemplates = basketData.map((product) => {
		const cardBasket = new CardUI('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				product.isAddedToBasket = !product.isAddedToBasket;
				eventEmmiter.emit('product:remove', product);
				eventEmmiter.emit('basket:open');
			},
		});
		return cardBasket.render({
			id: product.id,
			title: product.title,
			price: product.price,
		});
	});
	const basketRender = {
		content: basketUI.render({
			products: cardBasketTemplates,
			totalAmount: basket.getTotalAmount(),
		}),
	};
	modal.render(basketRender);
});

eventEmmiter.on('order:open', () => {
	order.items = basket.getProductIds();
	order.total = basket.getTotalAmount();
	const orderDeliveryRender = {
		content: orderDeliveryUI.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	};
  orderDeliveryUI.resetButtonStatus();
	modal.render(orderDeliveryRender);
	// Оформление заказа
});

eventEmmiter.on(
	'order.delivery:change',
	(data: { field: keyof IOrderForm; value: IOrderForm[keyof IOrderForm] }) => {
		order.setDeliveryField(data.field, data.value);
	}
);

eventEmmiter.on('order.delivery:ready', (event: IOrder) => {
	// Перейти в раздел контактной информации
});

// Ошибки в форме
eventEmmiter.on('formErrors:change:delivery', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	orderDeliveryUI.valid = !address && !payment;
	orderDeliveryUI.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Заказ готов к оформлению
eventEmmiter.on('order.contacts:ready', (event: IOrder) => {
});

eventEmmiter.on('order.delivery:next', () => {
	const orderContactFormRender = {
		content: orderContactFormUI.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	};
	modal.render(orderContactFormRender);
});

// Ошибки в форме
eventEmmiter.on('formErrors:change:contacts', (errors: Partial<IOrderForm>) => {
	const { phone, email } = errors;
	orderContactFormUI.valid = !phone && !email;
	orderContactFormUI.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

eventEmmiter.on(
	'order.contacts:change',
	(data: { field: keyof IOrderForm; value: IOrderForm[keyof IOrderForm] }) => {

		order.setContactsField(data.field, data.value);
	}
);

// Заказ оформлен
eventEmmiter.on('order.contacts:next', () => {
	const { payment, email, phone, address } = order.order;
	api
		.submitOrder({
			payment,
			email,
			phone,
			address,
			total: order.total,
			items: order.items,
		})
		.then((data) => {
			basket.clearBasket();
			const successRender = {
				content: successUI.render({
					id: data.id,
					total: data.total,
				}),
			};
			modal.render(successRender);
      page.busketNumber = 0;
      getProductsApi();

		})
		.catch((error) => {
			console.log(error);
		});
});

eventEmmiter.on('modal:open', () => {
	page.pageLock = true;
});

eventEmmiter.on('modal:close', () => {
	page.pageLock = false;
});
