
import { Form } from "./common/Form";
import { IOrderContact, IOrderDelivery,paymentOptions } from "../types";
import { IEvents } from "./base/events";



class OrderDeliveryUI extends Form<IOrderDelivery>{
  constructor(container: HTMLFormElement, events:IEvents) {
    super(container, events);
  }

  set address(value:string){

  }
  set payment(method:paymentOptions){

  }

}

class OrderContactFormUI extends Form<IOrderContact> {
  constructor(container: HTMLFormElement, events:IEvents) {
    super(container, events);
  }

  set phone(value:string){

  }

  set email(value:string){

  }
}