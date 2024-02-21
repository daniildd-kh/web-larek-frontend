import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductApi } from './components/ProductApi';
import { Catalog, Basket } from './components/AppData';
import { ICatalogEventData, IProduct, IBasketEventData, IOrder, IOrderResult } from './types';
import { Modal } from './components/common/Modal';
import { ensureElement } from './utils/utils';

const api = new ProductApi(CDN_URL, API_URL);
const eventEmmiter = new EventEmitter();
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmmiter);

const catalog = new Catalog(eventEmmiter);


api.getProductList()
	.then((data) => {
		catalog.setCatalog(data);
	})
	.catch((error) => {
		console.log(error);
	});
  

  eventEmmiter.on('catalog:updated', (data: ICatalogEventData) => {
    console.log('Каталог обновлен:', data.catalog);
    });
  

  eventEmmiter.on('product:open', (product: IProduct) => {
    console.log('Товар открыт:', product);
    modal.open();

  });


  eventEmmiter.on('product:add', (event: IProduct) => {
    console.log('Товар добавлен в корзину:', event);
  });


  eventEmmiter.on('basket:open', (event) => {
    console.log('Корзина открыта:', event);
  });


  eventEmmiter.on('basket:сhange', (data: IBasketEventData) => {
    console.log('Корзина обновлена:', data.basket);
  });


  eventEmmiter.on('product:remove', (data: IBasketEventData) => {
    console.log('Товар убран из корзины:', data.basket);
  });


  eventEmmiter.on('order:open', (event: IOrder) => {
    console.log('Оформление заказа:', event);
  });


  eventEmmiter.on('order.delivery:ready', (event: IOrder) => {
    console.log('Перейти в раздел контакнтной информации:', event);
  });


  eventEmmiter.on('order.contact:ready', (event: IOrderResult) => {
    console.log('Заказ оформлен:', event);
  });


  eventEmmiter.on('formErrors:change', (errors: Partial<IOrder>)=>{
    console.log('Ошибки в форме: ', errors)
  })


  eventEmmiter.on('modal:close', (event) => {
    console.log('Модальное окно закрыто:', event);
  });



