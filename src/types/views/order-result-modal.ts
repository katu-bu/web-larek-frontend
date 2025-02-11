import { IView } from "./iview";
import { IEventEmitter } from "../events";

// интерфейс отображений - модальное окно с подтверждением заказа

export class OrderResultModalView implements IView {
  protected totalPrice: HTMLParagraphElement;
  protected closeModalButton: HTMLButtonElement;
  protected orderSuccessCloseButton: HTMLButtonElement;
  
  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    this.totalPrice = container.querySelector('.order-success__description') as HTMLParagraphElement;
    this.closeModalButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.orderSuccessCloseButton = container.querySelector('.order-success__close') as HTMLButtonElement;
  
    this.closeModalButton.addEventListener('click', () => {
      // как закрыть окно - поменять класс у попапа?;
    });

    this.orderSuccessCloseButton.addEventListener('click', () => {
      // закрытие модалки 
    });
  }

render(data: {totalPrice: number}) {
  this.totalPrice.textContent = data.totalPrice.toString();
  return this.container;
} 
}
