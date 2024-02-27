import { createElement, ensureElement } from '../utils/utils';
import { View } from './base/View';
import { IEvents } from './base/events';

interface IBasketView {
	products: HTMLElement[];
	totalAmount: number;
}

export class BasketUI extends View<IBasketView> {
	protected listElement: HTMLElement;
	protected totalAmountElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.listElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalAmountElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.buttonElement.addEventListener('click', () => {
			events.emit('order:open');
		});
		this.products = [];
	}

	set products(products: HTMLElement[]) {
		if (products.length) {
			products.forEach((product, index) => {
				const productIndex = product.querySelector('.basket__item-index');
				if (productIndex) {
					productIndex.textContent = (index + 1).toString();
				}
			});
			this.listElement.replaceChildren(...products);
			this.setVisible(this.totalAmountElement);
			this.setDisabled(this.buttonElement, false);
		} else {
			this.listElement.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setHidden(this.totalAmountElement);
			this.setDisabled(this.buttonElement, true);
		}
	}

	set totalAmount(value: number) {
		this.setText(this.totalAmountElement, value);
	}
}
