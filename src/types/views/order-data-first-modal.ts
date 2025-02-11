import { IView } from "./iview";
import { IEventEmitter } from "../events";

// отображение модального окна с деталями заказа: способ оплаты и адрес доставки

export class OrderDataFirstModalView implements IView {
  protected address: HTMLInputElement;
  protected cardOrderButton: HTMLButtonElement;
  protected cashOrderButton: HTMLButtonElement;
  protected closeModalButton: HTMLButtonElement;
  protected nextButton: HTMLButtonElement;
  
  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    this.address = container.querySelector('[name="address"]') as HTMLInputElement;
    this.cardOrderButton = container.querySelector('[name="card"]') as HTMLButtonElement;
    this.cashOrderButton = container.querySelector('[name="cash"]') as HTMLButtonElement;
    this.closeModalButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.nextButton = container.querySelector('.order__button') as HTMLButtonElement;
  
    this.closeModalButton.addEventListener('click', () => {
      // TODO обработать закрытие модального окна на следующем спринте      
    });

    this.cardOrderButton.addEventListener('click', () => {
      this.events.emit('ui:order-update', {payment: "card"});
    });

    this.cashOrderButton.addEventListener('click', () => {
      this.events.emit('ui:order-update', {payment: "cash"});
    });

    this.nextButton.addEventListener('click', () => {
      this.events.emit('ui:order-update', {address: this.address.value});
      this.events.emit('ui:order-open-step2', {});
      // TODO обработать закрытие модального окна на следующем спринте
    });
  }

  render(data: {}) {
    return this.container;
  } 
}