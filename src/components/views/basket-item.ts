import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// отображение элемента корзины

interface RenderInput {
	id: string;
	title: string;
	price: number | null;
}

export class BasketItemView extends Component<RenderInput> {
	protected _title: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _removeButton: HTMLButtonElement;

	protected _id: string | null = null;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._title = ensureElement<HTMLSpanElement>('.basket-item__title', container);
		this._price = ensureElement<HTMLSpanElement>('.basket-item__price', container);
		this._removeButton = ensureElement<HTMLButtonElement>(
			'.basket-item__remove'
		);

		this._removeButton.addEventListener('click', () => {
			this.events.emit('ui:remove-from-basket', { id: this._id });
		});
	}

	render(data: RenderInput) {
		this._id = data.id;
		this._title.textContent = data.title;
		this._price.textContent = data.price.toString();
		return this.container;
	}
}
