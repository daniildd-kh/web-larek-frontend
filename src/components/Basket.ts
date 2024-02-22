import { ProductBasket } from "../types";
import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IEvents } from "./base/events";

interface IBasketView{
  products: HTMLElement[];
  totalAmount: number;
}

export class BasketUI extends View<IBasketView>{
  protected listElement: HTMLElement;
  protected totalAmountElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;


  constructor(container:HTMLElement, protected events: IEvents){
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalAmountElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.buttonElement.addEventListener('click', ()=>{
      events.emit('order:open')
    })
    this.products = [];
   }

  set products(products: HTMLElement[]) {

  }

  set totalAmount(value:number){

  }



}
