import { IOrderResult } from '../types';
import { ensureElement } from '../utils/utils';
import { View } from './base/View';

interface ISuccessAction {
	onClick: () => void;
}

export class SuccessUI extends View<IOrderResult> {
	closeButton: HTMLButtonElement;
	descriptionElement: HTMLElement;

	constructor(container: HTMLElement, action: ISuccessAction) {
		super(container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (action?.onClick) {
			this.closeButton.addEventListener('click', action.onClick);
		}
	}
	set total(value: number) {
		this.setText(this.descriptionElement, `Списано ${value} синапсов`);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
}
