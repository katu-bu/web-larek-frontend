import { IView } from "./iview";
import { IEventEmitter } from "../events";

// отображение модального окна с деталями продукта

export class CatalogItemModalView implements IView {
  protected title: HTMLHeadingElement;
  protected description: HTMLParagraphElement;
  protected image: HTMLImageElement;
  protected category: HTMLSpanElement;
  protected price: HTMLSpanElement;
  protected addToBasketButton: HTMLButtonElement;
  protected closeModalButton: HTMLButtonElement;
  
  protected id: string | null = null;

  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    this.title = container.querySelector('.card__title') as HTMLHeadingElement;
    this.description = container.querySelector('.card__text') as HTMLParagraphElement;
    this.image = container.querySelector('.card__image') as HTMLImageElement;
    this.category = container.querySelector('.card__category') as HTMLSpanElement;
    this.price = container.querySelector('.card__price') as HTMLSpanElement;
    this.addToBasketButton = container.querySelector('.card__button') as HTMLButtonElement;
    this.closeModalButton = container.querySelector('.modal__close') as HTMLButtonElement;
    
    this.addToBasketButton.addEventListener('click', () => {
      this.events.emit('ui:add-to-basket', {id: this.id});
    });

    this.closeModalButton.addEventListener('click', () => {
      // как закрыть окно - поменять класс у попапа?;
      // this.container.classList.add('disabled');
    });
  }
  
  render(data: { id: string, title: string, 
    description: string, image: string, category: string, price: number}) {
      this.id = data.id;
      this.title.textContent = data.title;
      this.description.textContent = data.description;
      this.image.src = data.image;
      this.category.textContent = data.category;
      // как то добавлять класс по цвету категории
      this.price.textContent = data.price.toString();
      return this.container;
    }
}