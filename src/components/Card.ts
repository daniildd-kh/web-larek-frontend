import { View } from './base/View';
import { IProduct, CategoryOptions } from '../types';
import { ensureElement } from '../utils/utils';

interface IAction {
	onClick: (event: MouseEvent) => void;
}

export class CardUI extends View<IProduct> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected buttonElement?: HTMLButtonElement;
	protected descriptionElement?: HTMLElement;
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement;

	constructor(blockName: string, container: HTMLElement, action?: IAction) {
		super(container);
		this.titleElement = ensureElement<HTMLElement>(
			`.${blockName}__title`,
			container
		);
		this.priceElement = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			container
		);
		this.descriptionElement = container.querySelector(`.${blockName}__text`);
		this.imageElement = container.querySelector(`.${blockName}__image`);
		this.categoryElement = container.querySelector(`.${blockName}__category`);
		this.buttonElement = container.querySelector(`.${blockName}__button`);

		if (action?.onClick) {
			if (this.buttonElement) {
				this.buttonElement.addEventListener('click', action.onClick);
			} else {
				this.container.addEventListener('click', action.onClick);
			}
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this.titleElement, value);
	}
	get title(): string {
		return this.titleElement.textContent;
	}
	set price(value: number) {
		if (value) {
			this.setText(this.priceElement, `${value} синапсов`);
		} else {
			this.setText(this.priceElement, 'Бесценно');
			this.setDisabled(this.buttonElement, true);
		}
	}
	set image(src: string) {
		this.setImage(this.imageElement, src, this.title);
	}
	setCategoryColor(category: CategoryOptions): string {
		switch (category) {
			case 'софт-скил':
				return 'card__category_soft';
			case 'хард-скил':
				return 'card__category_hard';
			case 'дополнительное':
				return 'card__category_additional';
			case 'другое':
				return 'card__category_other';
			case 'кнопка':
				return 'card__category_button';
			default:
				return 'card__category_other';
		}
	}

	set category(category: CategoryOptions) {
		this.toggleClass(this.categoryElement, this.setCategoryColor(category));
		this.setText(this.categoryElement, category);
	}
	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}
}

export class CardPreviewUI extends CardUI {
	private _isAddedToBasket: boolean;

	constructor(blockName: string, container: HTMLElement, action?: IAction) {
		super(blockName, container, action);

		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', () => {
				this.isAddedToBasket = !this.isAddedToBasket;
			});
		}
	}

	toggleButtonStatus(status: boolean): void {
		if (status) {
			this.setText(this.buttonElement, 'Убрать из корзины');
		} else {
			this.setText(this.buttonElement, 'В корзину');
		}
	}

	get isAddedToBasket(): boolean {
		return this._isAddedToBasket;
	}

	set isAddedToBasket(value: boolean) {
		this.toggleButtonStatus(value);
		this._isAddedToBasket = value;
	}

	render(data: IProduct): HTMLElement {
		super.render(data);
		return this.container;
	}
}
