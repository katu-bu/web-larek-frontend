import { Form } from '../../components/common/view/form';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// интерфейс отображений - модальное окно с деталями заказа: телефон и email

interface RenderInput {
	email?: string;
	phone?: number;
}

export class ContactsFormView extends Form<RenderInput> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = ensureElement<HTMLInputElement>('[name="email"]');
		this._phone = ensureElement<HTMLInputElement>('[name="phone"]');

		// при вводе почты генерируется событие `contacts.email:change`
		// при вводе телефона генерируется событие `contacts.phone:change`
		// при сабмите формы генерируется событие `contacts:submit`
		// в связующем коде надо будет обработать закрытие модалки
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: number) {
		this._phone.value = value.toString();
	}
}
