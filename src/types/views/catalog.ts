import { IView } from "./iview";

// интерфейс отображений - каталог 

export class CatalogView implements IView {
  constructor(protected container: HTMLElement) {}
  render(data: HTMLElement[]) {
    this.container.replaceChildren(...data);
    return this.container;
  } 
}