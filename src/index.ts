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
import { OrderFormView } from './components/views/order-form';
import { ContactsFormView } from './components/views/contacts-form';
import { OrderResultView } from './components/views/order-result';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { Modal } from './components/common/view/modal';
import { PaymentMethod } from './types';

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
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const resultTemplate = document.querySelector(
	'#success'
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

function computeTotalPrice() {
	return Array.from(basketModel.items)
		.map((id) => {
			const product = catalogModel.getProduct(id);
			return product.price;
		})
		.reduce((a, b) => a + b, 0);
}

function renderBasket() {
	const basketHTMLElement = basketTemplate.content.cloneNode(
		true
	) as HTMLElement;
	const basketView = new BasketView(basketHTMLElement, events);
	basketModal.content = basketHTMLElement;
	const htmlElements = Array.from(basketModel.items).map((id, ix) => {
		const basketItemViewHTMLElement = (
			basketItemTemplate.content.cloneNode(true) as DocumentFragment
		).querySelector('.basket__item') as HTMLElement;
		const basketItemView = new BasketItemView(
			basketItemViewHTMLElement,
			events
		);
		const product = catalogModel.getProduct(id);
		const renderInput = Object.assign({ index: ix+1 }, product);
		return basketItemView.render(renderInput);
	});
	const totalPrice = computeTotalPrice();
	basketView.render({ items: htmlElements, totalPrice: totalPrice });
}

function renderPage() {
	const htmlElements = catalogModel.items.map((product) => {
		const catalogItemViewHTMLElement = (
			catalogItemTemplate.content.cloneNode(true) as DocumentFragment
		).querySelector('.gallery__item') as HTMLButtonElement;
		const catalogItemView = new CatalogItemView(
			catalogItemViewHTMLElement,
			events
		);
		return catalogItemView.render(product);
	});
	pageView.render({ counter: basketModel.countItems(), catalog: htmlElements });
}

// товар добавляется или удаляется из корзины `BasketModel`
events.on('basket:change', ({}) => {
	renderBasket();
	renderPage();
});

// вызывается при обновлении списка товаров в каталоге (`CatalogModel`)
events.on('catalog:change', ({}) => {
	renderPage();
});

// вызывается при нажатии на товар из каталога
events.on('ui:preview-open', (event: { id: string }) => {
	const product = catalogModel.getProduct(event.id);
	catalogModel.setPreview(product);
});

// вызывается при изменении превью товара для показа в модальном окне
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
events.on('ui:add-to-basket', (event: { id: string }) => {
	basketModel.add(event.id);
	catalogPreviewItemModal.close();
});

// вызывается при нажатии кнопки удаления товара в `BasketItemView`.
events.on('ui:remove-from-basket', (event: { id: string }) => {
	basketModel.remove(event.id);
});

// пользователь открывает корзину с главной страницы `PageView`
events.on('ui:basket-open', () => {
	renderBasket();
	basketModal.open();
});

// пользователь нажимает кнопку "Оформить заказ" в `BasketView`.
events.on('ui:order-initiate', () => {
	basketModal.close();
	const orderHTMLElement = (
		orderTemplate.content.cloneNode(true) as DocumentFragment
	).querySelector('.form') as HTMLFormElement;
	orderModel.reset(Array.from(basketModel.items), computeTotalPrice());
	basketModel.clear();
	const orderView = new OrderFormView(orderHTMLElement, events);
	orderFormModal.content = orderHTMLElement;
	orderView.render({
		payment: orderModel.customerData.payment,
		address: orderModel.customerData.address,
		valid: true,
		errors: [],
	});
	orderFormModal.open();
});

events.on('order:change', (event) => {
	// вызывается, когда изменяются данные заказа (`OrderModel`).
	// В обработчик передается обновленный объект заказа.
});

// пользователь вводит адрес доставки в `OrderFormView`
events.on('order.address:change', (event: { field: string; value: string }) => {
	orderModel.update({ address: event.value });
});

// пользователь выбирает способ оплаты в `OrderFormView`
events.on(
	'order.payment:change',
	(event: { field: string; value: PaymentMethod }) => {
		orderModel.update({ payment: event.value });
	}
);

// пользователь вводит email в `ContactsFormView`
events.on(
	'contacts.email:change',
	(event: { field: string; value: string }) => {
		orderModel.update({ email: event.value });
	}
);

// пользователь вводит номер телефона в `ContactsFormView`
events.on(
	'contacts.phone:change',
	(event: { field: string; value: string }) => {
		orderModel.update({ phone: event.value });
	}
);

// пользователь отправляет заказ в `OrderFormView`
events.on('order:submit', () => {
	orderFormModal.close();
	const contactsHTMLElement = (
		contactsTemplate.content.cloneNode(true) as DocumentFragment
	).querySelector('.form') as HTMLFormElement;
	const contactsView = new ContactsFormView(contactsHTMLElement, events);
	contactsFormModal.content = contactsHTMLElement;
	contactsView.render({
		email: orderModel.customerData.email,
		phone: orderModel.customerData.phone,
		valid: true,
		errors: [],
	});
	contactsFormModal.open();
});

// пользователь отправляет форму с контактными данными (`ContactsFormView`).
events.on('contacts:submit', () => {
	contactsFormModal.close();
	const resultHTMLElement = (
		resultTemplate.content.cloneNode(true) as DocumentFragment
	).querySelector('.order-success') as HTMLElement;
	const resultView = new OrderResultView(resultHTMLElement, events);
	orderResultModal.content = resultHTMLElement;
	resultView.render({
		totalPrice: orderModel.total,
	});
	orderResultModal.open();
});

// пользователь нажимает на кнопку "За новыми покупками!"
events.on('succes-close', () => {
	orderResultModal.close();
	orderModel.getFinalOrder();
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
