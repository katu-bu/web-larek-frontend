# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектурный паттерн
В данной проектной работе "Веб-ларек" используется архитектурный паттерн MVP (Model-View-Presenter), адаптированный под событийно-ориентированный подход с использованием `EventEmitter`.
Компоненты MVP в проекте:
1. __Модель__ 
Отвечает за логику работы приложения и хранение данных:
- `BasketModel` — управляет корзиной товаров;
- `CatalogModel` — управляет каталогом товаров;
- `OrderModel` — управляет данными заказа.
2. __Представление__ 
Отвечает за отображение данных и обработку пользовательских действий.
3. __Презентер__ 
Связывает модель и представление, управляет логикой взаимодействия компонентов. В качестве презентера используется `EventEmitter`, который обеспечивает обмен событиями между моделями и представлениями.

## Базовый код

1. __Класс__ `Api`
Помогает отправлять запросы на сервер и получать от него данные.
_Ключевые методы:_ 
- `get(uri: string)` — используется, чтобы получить данные с сервера.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` — позволяет отправлять данные на сервер.
Если сервер вернет ошибку, она обработается автоматически.
Класс `Api` не реализует никакой интерфейс, а просто предоставляет методы для выполнения HTTP-запросов.

2. __Класс__ `Component<T>`
Абстрактный класс, от которого будут наследовать все классы слоя VIEW. 
Упрощает работу с элементами на странице. Он помогает изменять текст, скрывать или показывать элементы, переключать классы и управлять изображениями.
Этот класс нельзя использовать напрямую, но можно создать от него другие классы и добавить нужный функционал.
_Ключевые методы:_
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс у элемента;
- `setText(element: HTMLElement, value: unknown)` — меняет текст у элемента;
- `setDisabled(element: HTMLElement, state: boolean)` — блокирует или разблокирует элемент;
- `setHidden(element: HTMLElement)` и `setVisible(element: HTMLElement)` — скрывают и показывают элемент;
- `setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает картинку;
- `render(data?: Partial<T>)` — обновляет данные и возвращает элемент.
Класс `Component<T>` не реализует интерфейс, но он содержит обобщённый параметр `<T>` для работы с данными внутри. `<T>` - это обобщённый (дженерик) тип, который используется в методе `render(data?: Partial<T>)`, позволяя обновлять данные внутри компонента.

3. __Класс__ `EventEmitter` 
Помогает управлять событиями в коде. Позволяет подписываться на события, вызывать их и передавать данные.
В реализации моделей и отображений нам не требуется полный набор методов данного класса, поэтому используется упрощенный интерфейс `IEvent`, который позволяет вызвать слушателей при возникновении события.
Чтобы запустить событие и передать данные, используется один из методов интерфейса `IEvent` `emit<T extends object>(eventName: string, data?: T): void`. Дженерик <T> используется в данном методе. `T extends object` означает, что `<T>` должен быть объектом (а не примитивным типом, напр. string или number). Метод `emit` принимает данные типа T и передает их подписчикам.

## Компоненты модели данных (бизнес-логика)

1. __Класс__ `BasketModel`
Класс управляет состоянием корзины товаров, реализует интерфейс `IBasketModel`.
Он позволяет получить доступ к текущему состоянию корзины через публичное поле `items: Set<string>`.
Класс позволяет добавлять (`add`) и удалять (`remove`) товары из корзины, проверять их наличие (`isBasketProduct`), очищать корзину (`clear()`) и получать количество товаров (`countItems()`).
Конструктор `constructor(protected events: IEvents)`, где `events (IEvents)` — это объект для управления событиями, который в данном случае используется для генерации событий при изменении корзины.
_Поля класса:_
- `items: Set<string>` — множество, хранящее идентификаторы товаров, добавленных в корзину.
- `events: IEvents` — объект событий, позволяющий подписываться на изменения корзины.
_Ключевые методы:_
- `add(id: string): void` — добавляет товар в корзину и отправляет событие изменения состояния (`basket:change`);
- `remove(id: string): void` — удаляет товар из корзины и отправляет событие изменения состояния (`basket:change`);
- `isBasketProduct(id: string): boolean` — проверяет наличие товара в корзине (есть/нет);
- `clear(): void` — очищает корзину;
- `countItems(): number` — возвращает количества товаров в корзине.

2. __Класс__ `CatalogModel`
Класс управляет состоянием каталога товаров, реализует интерфейс `ICatalogModel`.
Он позволяет получить доступ к текущему набору товаров через публичное поле `items`, устанавливать превью товара (`preview`)
Класс позволяет устанавливать список товаров (`setItems`) и получать товар по его идентификатору (`getProduct`). 
Конструктор `constructor(protected events: IEvents)`, где `events (IEvents)` — это объект для управления событиями, который в данном случае используется для генерации событий при изменении каталога.
_Поля класса:_
- `items: IProduct[] = []` — массив товаров, содержащий текущий каталог.
- `preview: IProduct = null` — превью товара, который был выделен пользователем.
_Ключевые методы:_
- `setItems(items: IProduct[]): void` — обновляет список товаров и отправляет событие изменения состояния (`catalog:change`);
- `getProduct(id: string): IProduct` — ищет и возвращает товар по его идентификатору.
- `setPreview(item: IProduct): void` — устанавливает превью товара и отправляет событие обновления (`catalog:preview:change`).

3. __Класс__ `OrderModel`
Класс хранит данные о заказе, реализует интерфейс `IOrderModel`.
Класс позволяет обновлять (`update`) данные о заказе, сбрасывать (`reset`) информацию о заказе и получать (`getFinalOrder`) итоговые данные заказа. 
Конструктор `constructor(protected events: IEvents)`, где `events (IEvents)` — это объект для управления событиями, который в данном случае используется для генерации событий при изменении данных заказа.
_Поля класса:_
- `orderErrors: Partial<Record<keyof IPartialOrderData, string>>` — объект ошибок,
где ключами являются поля формы (`payment`, `email`, `phone`, `address`), а значениями — сообщения об ошибках.
_Ключевые методы_
- `update(upd: IPartialOrderData): void` — обновляет введенные покупателем данные (тип оплаты: карта/наличные, электронная почта, телефон и адрес), удаляет ошибки при корректном вводе и отправляет событие изменения состояния (`order:change`);
- `reset(items: string[], total: number): void` — очищает данные заказа, устанавливает новую общую сумму заказа и список товаров в заказе, а также сбрасывает ошибки.;
- `getFinalOrder(): IOrderData` — возвращает итоговую информацию о заказе.

## Компоненты представления

1. __Класс__ `Form<T>`
Помогает работать с HTML-формами. Отслеживает изменения в полях ввода, управляет кнопкой отправки и показывает ошибки.
_Параметры, которые принимает конструктор класса:_
- `container` — это HTML-форма (`HTMLFormElement`), с которой работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
При изменении данных в поле ввода класс отправляет событие `${this.container.name}.${String(field)}:change`.
При отправке формы класс отправляет событие `${this.container.name}:submit`.
_Методы класса:_
- `set valid(value: boolean)` — делает кнопку отправки активной или неактивной;
- `set errors(value: string)` — выводит сообщение об ошибке.
- `render(state: Partial<T> & IFormState): HTMLElement` п— озволяет заполнить форму начальными данными и управлять её состоянием.
Дженерик `<T>` используется для определения типа данных формы. Он позволяет типизировать поля формы, чтобы можно было работать с ними безопасно (например, если форма имеет поле email, то класс будет типизирован соответственно).

2. __Класс__ `OrderFormView`
Управляет формой оформления заказа. Позволяет выбирать способ оплаты (картой - кнопка с атрибутом `name="card"` или наличными - кнопка с атрибутом `name="cash"`) вводить адрес доставки (элемент `<input>` с атрибутом `name="address"`) и отправлять заказ.
Когда пользователь вводит адрес доставки, отправляется событие `order.address:change`, которое можно использовать для обновления данных.
Форма поддерживает два способа оплаты: картой и наличными. Если пользователь выбирает оплату картой, отправляется событие `order.payment:change` со значением `card`, а если наличными - отправляется событие `order.payment:change` со значением `cash`.
Когда пользователь нажимает кнопку отправки формы, генерируется событие `order:submit`.
_Параметры, которые принимает конструктор класса:_
- `container` — это HTML-форма (`HTMLFormElement` с классом `.order-form`), с которым работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `set address(value: string): void` — устанавливает значение в поле адреса доставки.
- `set payment(value: PaymentMethod): void` — изменяет выбранный способ оплаты.
Класс `OrderFormView` наследуется от `Form<RenderInput>`, где `RenderInput` — дженерик, который определяет структуру данных формы заказа (`payment?: PaymentMethod`, `address?: string`).

3. __Класс__ `ContactsFormView`
Отвечает за ввод и обработку контактных данных пользователя. Позволяет ввести email (элемент `<input>` с атрибутом `name="email"`) и номер телефона (элемент `<input>` с атрибутом `name="phone"`), а также отправить форму с контактными данными.
Когда пользователь вводит email, отправляется событие `contacts.email:change`. Его можно использовать, например, для проверки корректности почты.
Когда пользователь вводит номер телефона, отправляется событие `contacts.phone:change`.
Когда пользователь нажимает кнопку отправки формы, генерируется событие `contacts:submit`.
_Параметры, которые принимает конструктор класса:_
- `container` — это HTML-форма (`HTMLFormElement` с классом `.contacts-form`), с которым работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `set email(value: string): void` — устанавливает значение в поле электронной почты.
- `set phone(value: number): void` — устанавливает значение в поле номера телефона.
Класс `ContactsFormView` наследуется от `Form<RenderInput>`, где `RenderInput` — дженерик, который определяет структуру данных формы контактов (`email?: string`, `phone?: number`).

4. __Класс__ `Modal`
Предназначен для работы с модальными окнами. Позволяет открывать и закрывать модальное окно, добавлять в него содержимое и отправлять события при его открытии/закрытии.
_Параметры, которые принимает конструктор класса:_
- `container` — это элемент модального окна (`HTMLFormElement` с классом `.modal`), с которым работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `set content(value: HTMLElement)` — устанавливает содержимое модального окна, заменяя предыдущее;
- `open()` — открывает модальное окно, добавляя класс `modal_active`, и отправляет событие `modal:open`;
- `close()` — закрывает модальное окно, удаляя класс `modal_active`, очищает содержимое (`content = null`), отправляет событие `modal:close`. 
- `render(data: IModalData): HTMLElement` — позволяет управлять состоянием окна.
Модальное окно можно закрыть, кликнув по крестику (`HTMLButtonElement` с классом `.modal__close`) или за пределами содержимого.
Класс `Modal` реализует функциональность компонента через наследование от `Component<IModalData>`, где `IModalData` — дженерик, который определяет данные для модального окна.

5. __Класс__ `BasketView`
Выводит корзину, отображая список добавленных в нее товаров (элемент `<ul>` с классом `basket__list`), и итоговую стоимость заказа (элемент `<span>` с классом `basket__price`).
По клику на кнопку оформления заказа (кнопка с классом `basket__button`) генерируется событие `ui:order-initiate`.
_Параметры, которые принимает конструктор класса:_
- `container` — это корневой элемент корзины (`HTMLElement`).
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `render(data: RenderInput): HTMLElement` —  обновляет список товаров в корзине и итоговую стоимость.
Класс `BasketView` наследуется от `Component<RenderInput>`, где `RenderInput` — дженерик, который определяет структуру данных, используемых для отображения корзины (`items: HTMLElement[]` и `totalPrice: number`).

6. __Класс__ `BasketItemView`
Выводит один элемент товара в корзине, отображая его название (элемент `<span>` с классом `basket-item__title`) и цену (элемент `<span>` с классом `basket-item__price`).
По клику на кнопку удаления товара (кнопка с классом `basket-item__remove`) генерируется событие `ui:remove-from-basket` с идентификатором удаляемого товара.
_Параметры, которые принимает конструктор класса:_
- `container` — это корневой элемент карточки товара в корзине (`HTMLElement`).
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `render(data: RenderInput): HTMLElement` — обновляет название и цену товара;
Класс `BasketItemView` наследуется от `Component<RenderInput>`, где `RenderInput` — дженерик, который определяет структуру данных, используемых для отображения карточки товара в корзине (`id: string`, `title: string` и `price: number | null`).

7. __Класс__ `PageView`
Помогает управлять содержимым страницы: обновлять каталог товаров, отображать количество товаров в корзине.
При клике на иконку корзины (`.header__basket`) отправляется событие `ui:basket-open`, которое можно использовать для открытия модального окна.
_Параметры, которые принимает конструктор класса:_
- `container` — это HTML-элемент страницы (`HTMLElement` с классом `.page`), с которым работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `set counter(value: number)` — обновляет счетчик товаров в корзине, устанавливает текст в элементе `.header__basket-counter`, отображая актуальное число товаров.
- `set catalog(items: HTMLElement[])` — заменяет список товаров на странице, очищая контейнер `.gallery` и добавляет в него новые элементы.
Класс `PageView` наследуется от `Component<IPage>`, где `IPage` — дженерик, описывающий состояние страницы (`counter: number`, `catalog: HTMLElement[]`, `locked: boolean`).

8. __Класс__ `CatalogPreviewItemView`
Выводит подробное описание конкретного товара, отображая его название (элемент `<h2>` с классом `card__title`), описание (элемент `<p>` с классом `card__text`), картинку (элемент `<img>` с классом `card__image`), категорию (элемент `<span>` с классом `card__category`) и цену (элемент `<span>` с классом `card__price`).
По клику на кнопку добавления в корзину (кнопка с классом `card__button`) генерируется событие `ui:add-to-basket` с идентификатором добавляемого товара.
_Параметры, которые принимает конструктор класса:_
- `container` — это HTML-элемент (`HTMLElement`), с которым работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `render(data: RenderInput): HTMLElement` — обновляет содержимое карточки товара, устанавливая переданные данные товара.
Класс `CatalogPreviewItemView` наследуется от `Component<RenderInput>`, где `RenderInput` — дженерик, который определяет структуру данных, используемых для отображения товара (`id: string`, `title: string`, `description: string`, `image: string`, `category: string`, `price: number`).

9. __Класс__ `OrderResultView`
Отображает информацию с подтверждением заказа, включая итоговую стоимость заказа (элемент `<p>` с классом `order-success__description`).
По клику на кнопку "За новыми покупками!" (кнопка с классом `order-success__close`) модальное окно закрывается.
_Параметры, которые принимает конструктор класса:_
- `container` — это HTML-элемент (`HTMLElement` с классом `.order-success`), с которым работает класс.
- `events` — объект событий, реализующий интерфейс `IEvents`, для работы с событиями в классе.
_Методы класса:_
- `render(data: RenderInput)` — обновляет текстовое содержимое элемента с классом `.order-success__description`, отображая сумму заказа.
Класс `OrderResultView` наследуется от `Component<RenderInput>`, где `RenderInput` — дженерик, который определяет структуру передаваемых данных (`totalPrice: number`).

## Ключевые типы данных

1. `IProduct` — тип для товара:
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

2. `IOrderData` — тип для данных заказа:
```
type PaymentMethod: 'card' | 'cash';

interface IOrderData {
  payment: PaymentMethod;
  email: string;
  phone: number;
  address: string;
  total: number;
  items: string[];
}
```

3. `IOrderResult` — тип для результата оформления заказа:
```
interface IOrderResult {
  id: string;
  total: number;
}
```

## Взаимодействие с API
1. __Интерфейс__ `IShopAPI`
Предназначен для взаимодействия с API магазина (веб-ларька).
Он определяет основные функции для получения каталога товаров и оформления заказов.
_Ключевые методы:_
- `getProducts(): Promise<IProduct[]>` — получение каталога всех товаров в виде промиса, используется для загрузки каталога товаров в магазине.
- `orderProducts(order: IOrderData): Promise<IOrderResult>` - оформление заказа на основе переданных данных, возвращает результат в виде промиса.

## Список событий
- `basket:change` — вызывается, когда товар добавляется или удаляется из корзины `BasketModel`. В обработчик передаются обновленный список товаров и итоговая сумма.
- `ui:remove-from-basket` — вызывается при нажатии кнопки удаления товара в `BasketItemView`. В обработчик передается идентификатор удаляемого товара.
- `ui:basket-open` — вызывается, когда пользователь открывает корзину с главной страницы `PageView`.
- `catalog:change` — вызывается при обновлении списка товаров в каталоге (`CatalogModel`). В обработчик передается массив товаров.
- `catalog:preview:change` - вызывается при изменеии превью товара для показа в модальном окне.
- `ui:add-to-basket` — вызывается, когда пользователь нажимает кнопку добавления в корзину (`CatalogItemView`). В обработчик передается идентификатор добавленного товара.
- `order:change` — вызывается, когда изменяются данные заказа (`OrderModel`). В обработчик передается обновленный объект заказа.
- `order:submit` — вызывается, когда пользователь отправляет заказ в `OrderFormView`. В обработчик передаются все данные заказа.
- `order.address:change` — вызывается, когда пользователь вводит адрес доставки в `OrderFormView`. В обработчик передается новый адрес.
- `order.payment:change` — вызывается, когда пользователь выбирает способ оплаты в `OrderFormView`. В обработчик передается способ оплаты (`card` или `cash`).
- `ui:order-initiate` — вызывается, когда пользователь нажимает кнопку "Оформить заказ" в `BasketView`. Используется для отображения формы оформления заказа.
- `contacts.email:change` — вызывается, когда пользователь вводит email в `ContactsFormView`. В обработчик передается введенный email.
- `contacts.phone:change` — вызывается, когда пользователь вводит номер телефона в `ContactsFormView`. В обработчик передается введенный номер телефона.
- `contacts:submit` — вызывается, когда пользователь отправляет форму с контактными данными (`ContactsFormView`). В обработчик передаются email и телефон.
- `modal:open` — вызывается при открытии модального окна (`Modal`). В обработчик передается содержимое окна.
- `modal:close` — вызывается при закрытии модального окна (`Modal`). Используется для очистки контента и скрытия окна.