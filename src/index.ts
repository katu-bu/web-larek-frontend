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

const modal = new Modal(document.querySelector('.modal'), events);
// const basketModal = new Modal(document.querySelector('.modal__basket'), events);
// const catalogPreviewItemModal = new Modal(
// 	document.querySelector('.modal__preview'),
// 	events
// );
// const orderFormModal = new Modal(
// 	document.querySelector('.modal__order-form'),
// 	events
// );
// const contactsFormModal = new Modal(
// 	document.querySelector('.modal__contacts-form'),
// 	events
// );
// const orderResultModal = new Modal(
// 	document.querySelector('.modal__result'),
// 	events
// );


let orderView: OrderFormView | null = null;
let contactsView: ContactsFormView | null = null;

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
	// УБРАТЬ basketModal.content = basketHTMLElement;
	modal.content = basketHTMLElement;
	const htmlElements = Array.from(basketModel.items).map((id, ix) => {
		const basketItemViewHTMLElement = (
			basketItemTemplate.content.cloneNode(true) as DocumentFragment
		).querySelector('.basket__item') as HTMLElement;
		const basketItemView = new BasketItemView(
			basketItemViewHTMLElement,
			events
		);
		const product = catalogModel.getProduct(id);
		const renderInput = Object.assign({ index: ix + 1 }, product);
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
events.on('basket:change', () => {
	renderBasket();
	renderPage();
});

// вызывается при обновлении списка товаров в каталоге (`CatalogModel`)
events.on('catalog:change', () => {
	renderPage();
});

// вызывается при нажатии на товар из каталога
events.on('ui:preview-open', (event: { id: string }) => {
	const product = catalogModel.getProduct(event.id);
	catalogModel.setPreview(product);
});

// вызывается при изменении превью товара для показа в модальном окне
events.on('catalog:preview:change', () => {
	const previewHTMLElement = previewTemplate.content.cloneNode(
		true
	) as HTMLElement;
	const previewView = new CatalogPreviewItemView(previewHTMLElement, events);
	// УБРАТЬ catalogPreviewItemModal.content = previewHTMLElement;
	modal.content = previewHTMLElement;
	const preview = catalogModel.preview;
	const alreadyInBasket = basketModel.items.has(preview.id);
	previewView.render(Object.assign({ alreadyInBasket }, preview));
	// УБРАТЬ catalogPreviewItemModal.open();
	modal.open();
});

// пользователь нажимает кнопку добавления в корзину (`CatalogItemView`).
events.on('ui:add-to-basket', (event: { id: string }) => {
	basketModel.add(event.id);
	// УБРАТЬ catalogPreviewItemModal.close();
	modal.close();
});

// вызывается при нажатии кнопки удаления товара в `BasketItemView`.
events.on('ui:remove-from-basket', (event: { id: string }) => {
	basketModel.remove(event.id);
});

// пользователь открывает корзину с главной страницы `PageView`
events.on('ui:basket-open', () => {
	renderBasket();
	// УБРАТЬ basketModal.open();
	modal.open();
});

// пользователь нажимает кнопку "Оформить заказ" в `BasketView`.
events.on('ui:order-initiate', () => {
	// УБРАТЬ basketModal.close();
		modal.close();
	const orderHTMLElement = (
		orderTemplate.content.cloneNode(true) as DocumentFragment
	).querySelector('.form') as HTMLFormElement;
	orderModel.reset(Array.from(basketModel.items), computeTotalPrice());
	basketModel.clear();
	orderView = new OrderFormView(orderHTMLElement, events);
	// УБРАТЬ orderFormModal.content = orderHTMLElement;
	modal.content = orderHTMLElement;
	orderView.render({
		payment: orderModel.customerData.payment,
		address: orderModel.customerData.address,
		valid: false,
		errors: '',
	});
	// УБРАТЬ orderFormModal.open();
	modal.open();
});

// пользователь вводит адрес доставки в `OrderFormView`
events.on(
	'order.address:change',
	(event: { field: string; value: string; validationMessage: string }) => {
		orderModel.updateAddress(event.value, event.validationMessage);
		orderView.handleFormErrors(orderModel.orderErrors);
		orderView.makeAddressRequired();
	}
);

// пользователь выбирает способ оплаты в `OrderFormView`
events.on(
	'order.payment:change',
	(event: { field: string; value: PaymentMethod }) => {
		orderModel.updatePayment(event.value);
		orderView.handleFormErrors(orderModel.orderErrors);
	}
);

// пользователь вводит email в `ContactsFormView`
events.on(
	'contacts.email:change',
	(event: { field: string; value: string; validationMessage: string }) => {
		orderModel.updateEmail(event.value, event.validationMessage);
		contactsView.handleFormErrors(orderModel.orderErrors);
		contactsView.makeEmailRequired();
	}
);

// пользователь вводит номер телефона в `ContactsFormView`
events.on(
	'contacts.phone:change',
	(event: { field: string; value: string; validationMessage: string }) => {
		orderModel.updatePhone(event.value, event.validationMessage);
		contactsView.handleFormErrors(orderModel.orderErrors);
		contactsView.makePhoneRequired();
	}
);

// пользователь отправляет заказ в `OrderFormView`
events.on('order:submit', () => {
	// УБРАТЬ orderFormModal.close();
	modal.close();
	orderView = null;
	const contactsHTMLElement = (
		contactsTemplate.content.cloneNode(true) as DocumentFragment
	).querySelector('.form') as HTMLFormElement;
	contactsView = new ContactsFormView(contactsHTMLElement, events);
	// УБРАТЬ contactsFormModal.content = contactsHTMLElement;
	modal.content = contactsHTMLElement;
	contactsView.render({
		email: orderModel.customerData.email,
		phone: orderModel.customerData.phone,
		valid: false,
		errors: '',
	});
	// УБРАТЬ contactsFormModal.open();
	modal.open();
});

// пользователь отправляет форму с контактными данными (`ContactsFormView`).
events.on('contacts:submit', () => {
	// УБРАТЬ contactsFormModal.close();
	modal.close();
	contactsView = null;
	const resultHTMLElement = (
		resultTemplate.content.cloneNode(true) as DocumentFragment
	).querySelector('.order-success') as HTMLElement;
	const resultView = new OrderResultView(resultHTMLElement, events);
	// УБРАТЬ orderResultModal.content = resultHTMLElement;
	modal.content = resultHTMLElement;
	resultView.render({
		totalPrice: orderModel.total,
	});
	// УБРАТЬ orderResultModal.open();
	modal.open();
});

// пользователь нажимает на кнопку "За новыми покупками!"
events.on('succes-close', () => {
	// УБРАТЬ orderResultModal.close();
	modal.close();
	// ? orderModel.getFinalOrder();
});

events.on('modal:open', () => {
	pageView.locked = true;
});

events.on('modal:close', () => {
	pageView.locked = false;
});

const api = new ShopAPI(new Api(API_URL), CDN_URL);

api
	.getProducts()
	.then((res) => catalogModel.setItems(res))
	.catch((err) => console.error(err));

// api
// 	.orderProducts(orderModel.getFinalOrder())
