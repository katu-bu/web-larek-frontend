import './scss/styles.scss';
import { ShopAPI } from './components/shopAPI';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/models/basket';
import { CatalogModel } from './components/models/catalog';
import { OrderModel } from './components/models/order';
import { BasketView } from './components/views/basket';
import { BasketItemView } from './components/views/basket-item';
import { PageView } from './components/views/page';
import { CatalogItemView } from './components/views/catalog-item';
import { CatalogPreviewItemView } from './components/views/catalog-preview-item';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { Modal } from './components/common/view/modal';

const events = new EventEmitter();
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);
const orderModel = new OrderModel(events);
const basketItemTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const pageView = new PageView(document.querySelector('.page__wrapper'), events);
const catalogItemTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const previewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketModal = new Modal(document.querySelector('.modal__basket'), events);
const catalogPreviewItemModal = new Modal(
	document.querySelector('.modal__preview'),
	events
);
const orderFormModal = new Modal(
	document.querySelector('.modal__order-form'),
	events
);
const contactsFormModal = new Modal(
	document.querySelector('.modal__contacts-form'),
	events
);
const orderResultModal = new Modal(
	document.querySelector('.modal__result'),
	events
);

function renderBasket(basketView: BasketView) {
	const ids = Array.from(basketModel.items);
	const htmlElements = ids.map((id) => {
		const basketItemViewHTMLElement = basketItemTemplate.cloneNode(
			true
		) as HTMLElement;
		const basketItemView = new BasketItemView(
			basketItemViewHTMLElement,
			events
		);
		const product = catalogModel.getProduct(id);
		return basketItemView.render(product);
	});
	const totalPrice = ids
		.map((id) => {
			const product = catalogModel.getProduct(id);
			return product.price;
		})
		.reduce((a, b) => a + b, 0);
	basketView.render({ items: htmlElements, totalPrice: totalPrice });
}

function renderPage() {
	const htmlElements = catalogModel.items.map((product) => {
		const catalogItemViewHTMLElement = (catalogItemTemplate.content.cloneNode(
			true
		) as HTMLElement).querySelector('.gallery__item') as HTMLButtonElement;
		const catalogItemView = new CatalogItemView(
			catalogItemViewHTMLElement,
			events
		);
		return catalogItemView.render(product);
	});
	pageView.render({ counter: basketModel.countItems(), catalog: htmlElements });
}

events.on('basket:change', ({}) => {
	// renderBasket();
	// товар добавляется или удаляется из корзины `BasketModel`.
	// В обработчик передаются обновленный список товаров и итоговая сумма.
	renderPage();
});

events.on('catalog:change', ({}) => {
	renderPage();
	// вызывается при обновлении списка товаров в каталоге (`CatalogModel`).
	// В обработчик передается массив товаров.
});

// вызывается при нажатии на товар из каталога
events.on('ui:preview-open', (event: { id: string }) => {
	const product = catalogModel.getProduct(event.id);
	catalogModel.setPreview(product);
});

// вызывается при изменении превью товара для показа в модальном окне.
events.on('catalog:preview:change', ({}) => {
	const previewHTMLElement = previewTemplate.content.cloneNode(
		true
	) as HTMLElement;
	const previewView = new CatalogPreviewItemView(previewHTMLElement, events);
	catalogPreviewItemModal.content = previewHTMLElement;
	previewView.render(catalogModel.preview);
	catalogPreviewItemModal.open();
});

	// пользователь нажимает кнопку добавления в корзину (`CatalogItemView`).
	// В обработчик передается идентификатор добавленного товара.
events.on('ui:add-to-basket', (event: { id: string }) => {
	basketModel.add(event.id);
	catalogPreviewItemModal.close();
});

events.on('ui:remove-from-basket', (event: { id: string }) => {
	basketModel.remove(event.id);
	// вызывается при нажатии кнопки удаления товара в `BasketItemView`.
	// В обработчик передается идентификатор удаляемого товара.
});

// пользователь открывает корзину с главной страницы `PageView`
events.on('ui:basket-open', () => {
	const basketHTMLElement = basketTemplate.content.cloneNode(
		true
	) as HTMLElement;
	const basketView = new BasketView(basketHTMLElement, events);
	basketModal.content = basketHTMLElement;
	renderBasket(basketView);
	basketModal.open();
});

// пользователь нажимает кнопку "Оформить заказ" в `BasketView`.
events.on('ui:order-initiate', () => {
	basketModal.close();
	orderFormModal.open();
});

events.on('order:change', (event) => {
	// вызывается, когда изменяются данные заказа (`OrderModel`).
	// В обработчик передается обновленный объект заказа.
});

events.on('order.address:change', (event) => {
	orderModel.update(event);

	// пользователь вводит адрес доставки в `OrderFormView`.
	// В обработчик передается новый адрес.
});

events.on('order.payment:change', (event) => {
	// пользователь выбирает способ оплаты в `OrderFormView`.
	//  В обработчик передается способ оплаты (`card` или `cash`).
});

events.on('contacts.email:change', (event) => {
	// пользователь вводит email в `ContactsFormView`.
	// В обработчик передается введенный email.
});

events.on('contacts.phone:change', (event) => {
	// пользователь вводит номер телефона в `ContactsFormView`.
	// В обработчик передается введенный номер телефона.
});

// пользователь отправляет заказ в `OrderFormView`. В обработчик передаются все данные заказа.
events.on('order:submit', () => {
	orderFormModal.close();
	contactsFormModal.open();
});

// пользователь отправляет форму с контактными данными (`ContactsFormView`).
//  В обработчик передаются email и телефон.
events.on('contacts:submit', () => {
	contactsFormModal.close();
	orderResultModal.open();
});

// events.on('modal:open', (event) => {
// 	if (event) {
// 		// вызывается при открытии модального окна (`Modal`).
// 		// В обработчик передается содержимое окна.
// 	}
// });

// events.on('modal:close', (event) => {
// 	if (event) {
// 		// вызывается при закрытии модального окна (`Modal`).
// 		// используется для очистки контента и скрытия окна.
// 	}
// });

const api = new ShopAPI(new Api(API_URL), CDN_URL);

api
	.getProducts()
	.then((res) => catalogModel.setItems(res))
	.catch((err) => console.error(err));
