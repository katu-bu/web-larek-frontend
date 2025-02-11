import { IView } from "./iview";
import { IEventEmitter } from "../events";

// отображение элемента корзины 

export class BasketItemView implements IView {
  protected title: HTMLSpanElement;
  protected price: HTMLSpanElement;
  protected removeButton: HTMLButtonElement;

  protected id: string | null = null;

  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    this.title = container.querySelector('.basket-item__title') as HTMLSpanElement;
    this.price = container.querySelector('.basket-item__price') as HTMLSpanElement;
    this.removeButton = container.querySelector('.basket-item__remove') as HTMLButtonElement;
  
    this.removeButton.addEventListener('click', () => {
      this.events.emit('ui:remove-from-basket', {id: this.id});
    });
  }

  render(data: { id: string, title: string, price: number }) {
    this.id = data.id;
    this.title.textContent = data.title;
    this.price.textContent = data.price.toString();
    return this.container;
  }
}