import { Form } from '../../components/common/view/form';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// интерфейс отображений - модальное окно с деталями заказа: телефон и email

interface RenderInput {
	email?: string;
	phone?: string;
}

export class ContactsFormView extends Form<RenderInput> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = ensureElement<HTMLInputElement>('[name="email"]', container);
		this._phone = ensureElement<HTMLInputElement>('[name="phone"]', container);

		// при вводе почты генерируется событие `contacts.email:change`
		// при вводе телефона генерируется событие `contacts.phone:change`
		// при сабмите формы генерируется событие `contacts:submit`
	}

	handleFormErrors(formErrors: Partial<Record<keyof RenderInput, string>>) {
		super.valid = !formErrors.email && !formErrors.phone;
	}

	makeEmailRequired() {
		this._email.required = true;
	}

	makePhoneRequired() {
		this._phone.required = true;
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}
}
