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
      // как закрыть окно - поменять класс у попапа?;]
      // this.events.emit('ui:basket-open', {});
      
    });

    this.cardOrderButton.addEventListener('click', () => {
      // надо передать серверу инфу о способе оплаты - карта; 
      this.events.emit('ui:order-update', {payment: "card"});
    });

    this.cashOrderButton.addEventListener('click', () => {
      // надо передать серверу инфу о способе оплаты - наличка;
      this.events.emit('ui:order-update', {payment: "cash"});
    });

    this.nextButton.addEventListener('click', () => {
      this.events.emit('ui:order-update', {address: this.address.value});
      this.events.emit('ui:order-open-step2', {});
      // закрытие модалки 
    });
  }

  render(data: {}) {
    return this.container;
  } 
}