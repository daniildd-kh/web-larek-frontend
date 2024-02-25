import { ensureElement } from '../utils/utils';
import { View } from './base/View';
import { IEvents } from './base/events';

interface IPage {
	catalog: HTMLElement[];
	basketCounter: number;
	pageLock: boolean;
}

export class PageUI extends View<IPage> {
	protected basketCounterElement: HTMLElement;
	protected basketButtonElement: HTMLButtonElement;
	protected catalogElement: HTMLElement;
	protected pageWrapperElement: HTMLElement;

	constructor(contaiter: HTMLElement, protected events: IEvents) {
		super(contaiter);
		this.basketCounterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.container
		);
		this.basketButtonElement = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.container
		);
		this.catalogElement = ensureElement<HTMLElement>(
			'.gallery',
			this.container
		);
		this.pageWrapperElement = ensureElement<HTMLElement>(
			'.page__wrapper',
			this.container
		);

		this.basketButtonElement.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set catalog(products: HTMLElement[]) {
		this.catalogElement.replaceChildren(...products);
	}

	set busketNumber(value: number) {
		this.setText(this.basketCounterElement, value);
	}

	set pageLock(value: boolean) {
		if (value) {
			this.pageWrapperElement.classList.add('page__wrapper_locked');
		} else {
			this.pageWrapperElement.classList.remove('page__wrapper_locked');
		}
	}
}
