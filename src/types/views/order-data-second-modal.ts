import { IView } from "./iview";
import { IEventEmitter } from "../events";

// интерфейс отображений - модальное окно с деталями заказа: телефон и email

export class OrderDataFirstModalView implements IView {
  protected email: HTMLInputElement;
  protected phone: HTMLInputElement;
  protected closeModalButton: HTMLButtonElement;
  protected goToPayButton: HTMLButtonElement;
  
  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    this.email = container.querySelector('[name="email"]') as HTMLInputElement;
    this.phone = container.querySelector('[name="phone"]') as HTMLInputElement;
    this.closeModalButton = container.querySelector('.modal__close') as HTMLButtonElement;
    // у кнопки нет класса
    // this.goToPayButton = container.querySelector('.,,,') as HTMLButtonElement;
  
    this.closeModalButton.addEventListener('click', () => {
      // как закрыть окно - поменять класс у попапа?;
    });

    this.goToPayButton.addEventListener('click', () => {
      this.events.emit('ui:order-update', {email: this.email.value, phone: this.phone.value});
      this.events.emit('ui:order-made', {});
      // закрытие модалки 
    });
  }

render(data: {}) {
  return this.container;
} 
}
