import './scss/styles.scss';
import { ShopAPI } from "./types/api";
import { EventEmitter } from "./components/base/events";
import { BasketModel } from "./types/models/basket";
import { CatalogModel } from "./types/models/catalog";
import { OrderModel, IPartialOrderData } from "./types/models/order";
import { BasketView } from "./types/views/basket";
import { BasketItemView } from "./types/views/basket-item";
import { CatalogView } from "./types/views/catalog";
import { CatalogItemModalView } from "./types/views/catalog-item-modal";

const events = new EventEmitter();
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);
const orderModel = new OrderModel(events);
const basketView = new BasketView(document.querySelector('#basket'), events);
const basketItemTemplate = document.querySelector("#card-basket");
const catalogView = new CatalogView(document.querySelector('.gallery'));
const catalogItemTemplate = document.querySelector('#card-catalog');

// header__basket icon

function renderBasket() {
  const ids = Array.from(basketModel.items);
  const htmlElements = ids.map(id => {
    const basketItemViewHTMLElement = basketItemTemplate.cloneNode(true) as HTMLElement;
    const basketItemView = new BasketItemView(basketItemViewHTMLElement, events);
    const product = catalogModel.getProduct(id);
    return basketItemView.render(product);
  });
  const totalPrice = ids.map(id => {
    const product = catalogModel.getProduct(id);
    return product.price;
  }).reduce((a, b) => (a + b), 0);
  basketView.render({items: htmlElements, totalPrice: totalPrice});
}

function renderCatalog() {
  const htmlElements = catalogModel.items.map(product => {
    const catalogItemViewHTMLElement = catalogItemTemplate.cloneNode(true) as HTMLElement;
    const catalogItemView = new CatalogItemModalView(catalogItemViewHTMLElement, events);
    return catalogItemView.render(product);
  });
  catalogView.render(htmlElements);
}

events.on('basket:change', ({}) => {
  renderBasket();
});

events.on('catalog:change', ({}) => {
  renderCatalog();
});

events.on('ui:add-to-basket', (event: { id: string }) => {
  basketModel.add(event.id);
});

events.on('ui:remove-from-basket', (event: { id: string }) => {
  basketModel.remove(event.id);
});

events.on('ui:basket-open', (event) => {
  if (event) {
    // открытие модалки корзины
  }
});

events.on('ui:order-initiate', (event) => {
  if (event) {
    //закрывается модалка корзины и
    //открывается модалка первого шага заказа
  }
});

events.on('ui:order-update', (event: IPartialOrderData) => {
  orderModel.update(event);
});

events.on('ui:order-open-step2', (event) => {
  if (event) {
    //закрывается модалка первого шага заказа и
    //открывается модалка 2 шага заказа
  }
});

events.on('ui:order-made', (event) => {
  if (event) {
    //закрывается модалка 2 шага заказа и
    //открывается модалка с подтверждением заказа
  }
});

const api = new ShopAPI();

api.getProducts()
  .then((res) => catalogModel.setItems(res))
  .catch(err => console.error(err))