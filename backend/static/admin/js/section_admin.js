<<<<<<< HEAD
'use strict';

const SECTION_FIELDS = {
    hero:     ['field-title', 'field-subtitle', 'field-image', 'field-image_alt', 'field-button_text', 'field-button_url'],
    text:     ['field-title', 'field-subtitle', 'field-content', 'field-image', 'field-image_alt'],
    gallery:  ['field-title', 'field-subtitle'],
    contacts: ['field-title', 'field-content'],
    cta:      ['field-title', 'field-subtitle', 'field-content', 'field-button_text', 'field-button_url'],
    custom:   ['field-title', 'field-extra_data'],
};

const ALL_FIELDS = [
    'field-title', 'field-subtitle', 'field-content',
    'field-image', 'field-image_alt',
    'field-button_text', 'field-button_url', 'field-extra_data',
];

function toggleFields(inlineRow, selectedType) {
    const visibleFields = SECTION_FIELDS[selectedType] || ALL_FIELDS;

    ALL_FIELDS.forEach(function(fieldClass) {
        const field = inlineRow.querySelector('.' + fieldClass);
        if (!field) return;
        field.style.display = visibleFields.includes(fieldClass) ? '' : 'none';
    });

    inlineRow.querySelectorAll('.inline-group').forEach(function(carouselBlock) {
        carouselBlock.style.display = selectedType === 'gallery' ? '' : 'none';
    });
}

function initRow(row) {
    const select = row.querySelector('select[name$="-section_type"]');
    if (!select) return;
    toggleFields(row, select.value);
    select.addEventListener('change', function() {
        toggleFields(row, this.value);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.inline-related:not(.empty-form)').forEach(initRow);

    document.addEventListener('formset:added', function(event) {
        initRow(event.target);
    });
=======
'use strict';

const SECTION_FIELDS = {
    hero:     ['field-title', 'field-subtitle', 'field-image', 'field-image_alt', 'field-button_text', 'field-button_url'],
    text:     ['field-title', 'field-subtitle', 'field-content', 'field-image', 'field-image_alt'],
    gallery:  ['field-title', 'field-subtitle'],
    contacts: ['field-title', 'field-content'],
    cta:      ['field-title', 'field-subtitle', 'field-content', 'field-button_text', 'field-button_url'],
    custom:   ['field-title', 'field-extra_data'],
};

const ALL_FIELDS = [
    'field-title', 'field-subtitle', 'field-content',
    'field-image', 'field-image_alt',
    'field-button_text', 'field-button_url', 'field-extra_data',
];

function toggleFields(inlineRow, selectedType) {
    const visibleFields = SECTION_FIELDS[selectedType] || ALL_FIELDS;

    // Показуємо/ховаємо поля
    ALL_FIELDS.forEach(function(fieldClass) {
        const field = inlineRow.querySelector('.' + fieldClass);
        if (!field) return;
        field.style.display = visibleFields.includes(fieldClass) ? '' : 'none';
    });

    // Карусель — тільки для gallery
    inlineRow.querySelectorAll('.inline-group').forEach(function(carouselBlock) {
        carouselBlock.style.display = selectedType === 'gallery' ? '' : 'none';
    });
}

function initRow(row) {
    const select = row.querySelector('select[name$="-section_type"]');
    if (!select) return;
    toggleFields(row, select.value);
    select.addEventListener('change', function() {
        toggleFields(row, this.value);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.inline-related:not(.empty-form)').forEach(initRow);

    document.addEventListener('formset:added', function(event) {
        initRow(event.target);
    });
>>>>>>> c9df572 (add user model with RBAC, update reports/events, add page builder with dynamic sections)
});