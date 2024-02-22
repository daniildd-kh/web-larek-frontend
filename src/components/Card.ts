import { View } from "./base/View";
import { IProduct, CategoryOptions } from "../types";
import { ensureElement } from "../utils/utils";

interface IAction{
  onClick: (event: MouseEvent) => void;
}

export class CardUI extends View<IProduct>{
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected descriptionElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected categoryElement?: HTMLElement;

  constructor(blockName:string, container:HTMLElement, action?: IAction){
    super(container)
    this.titleElement = ensureElement<HTMLElement>(`.${blockName}__title`, this.container);
    this.priceElement = ensureElement<HTMLElement>(`.${blockName}__price`, this.container);
    this.descriptionElement = ensureElement<HTMLElement>(`.${blockName}__text`, this.container);
    this.imageElement = ensureElement<HTMLImageElement>(`.${blockName}__image`, this.container);
    this.categoryElement = ensureElement<HTMLElement>(`.${blockName}__category`, this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>(`.${blockName}__button`, this.container);
    
    if(action?.onClick){
      if(this.buttonElement){
        this.buttonElement.addEventListener("click", action.onClick);
      }
      else{
        this.container.addEventListener("click", action.onClick);
      }
    }
  }
  set id(value:string){

  }
  get id():string{
    return 
  }

  set title(value:string){

  }
  set price(value:number){
  }
  set image(src:string){

  }
  set category(category:CategoryOptions){

  }
  set description(value:string){

  }

}


export class CardPreviewUI extends CardUI {
  constructor(blockName: string, container: HTMLElement, action?: IAction) {
    super(blockName, container, action);
  }

  render(data: IProduct): HTMLElement {
    super.render(data);

    if (data.isAddedToBasket) {
      this.setDisabled(this.buttonElement, true)
    } else {
      this.setDisabled(this.buttonElement, false)
    }

    return this.container;
  }
}
