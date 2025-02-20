export function determineCategoryClass(categoryName: string): string {
	if (categoryName === 'другое') {
		return 'card__category_other';
	}
	if (categoryName === 'софт-скил') {
		return 'card__category_soft';
	}
	if (categoryName === 'дополнительное') {
		return 'card__category_additional';
	}
	if (categoryName === 'кнопка') {
		return 'card__category_button';
	}
	if (categoryName === 'хард-скил') {
		return 'card__category_hard';
	}
	return 'card__category_other';
}
