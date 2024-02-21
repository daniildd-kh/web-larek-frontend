import { ensureElement } from "../utils/utils";
import { View } from "./base/View";

interface ISuccess {
  totalAmount: number;
}

interface ISuccessAction {
  onClick: () => void;
}

export class SuccessUI extends View<ISuccess>{
  closeButton: HTMLElement;

  constructor(container: HTMLElement, action: ISuccessAction) {
    super(container);
    this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);

    if (action?.onClick) {
      this.closeButton.addEventListener('click', action.onClick);
  }
  }
  set totalAmount(value:number){
    
  }
  
  
}