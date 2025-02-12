// интерфейс отображений

export interface IView {
  render(data: object): HTMLElement;
}