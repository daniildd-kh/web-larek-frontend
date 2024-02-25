import { Form } from './common/Form';
import { IOrderContact, IOrderDelivery, PaymentOptions } from '../types';
import { IEvents } from './base/events';

export class OrderDeliveryUI extends Form<IOrderDelivery> {
	paymentButtons: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._submit.addEventListener('click', () => {
			this.events.emit('order.delivery:next');
		});
		const paymentButtons = container.querySelectorAll('.order__buttons button');
		paymentButtons.forEach((button) => {
			button.addEventListener('click', (event) => {
				this.resetButtonStatus();
				button.classList.add('button_alt-active');
				const paymentMethod = (event.target as HTMLButtonElement).name;
				this.paymentSelection(paymentMethod as PaymentOptions);
			});
		});
	}

	resetButtonStatus() {
		if (this.paymentButtons) {
			this.paymentButtons.forEach((button) => {
				button.classList.remove('button_alt-active');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	paymentSelection(method: PaymentOptions) {
		this.events.emit('order.delivery:change', {
			field: 'payment',
			value: method,
		});
	}
	protected onInputChange(field: keyof IOrderDelivery, value: string) {
		this.events.emit('order.delivery:change', {
			field,
			value,
		});
	}
}

export class OrderContactFormUI extends Form<IOrderContact> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._submit.addEventListener('click', () => {
			this.events.emit('order.contacts:next');
		});
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
	protected onInputChange(field: keyof IOrderContact, value: string) {
		this.events.emit('order.contacts:change', {
			field,
			value,
		});
	}
}
