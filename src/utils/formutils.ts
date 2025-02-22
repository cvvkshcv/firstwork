import { TFormItem, TFormItemOptions } from "../types/Types";

export const getOptionObject = (questionType: TFormItem['questionType']) => {
  switch (questionType) {
    case 'number':
      return { value: '', min: 0, max: 100 };
    case 'text':
      return { isParagraph: false };
    case 'select':
      return { value: [''] };
    default:
      return {};
  }
};


export const validateBuilderField = (formItem: TFormItem) => {
  const errors: { [key: string]: string } = {};
  if (formItem.questionTitle.trim() === '') {
    errors['questionTitle'] = 'Question title is required';
  }
  if (formItem.questionType.trim() === '') {
    errors['questionType'] = 'Question type is required';
  }

  if (formItem.questionType === 'number') {
    const option = formItem.options as TFormItemOptions<'number'>;
    if (!option || option.min < 0) {
      errors['min'] = 'Min value should be more than or equal to 0';
    }
    if (option.min < 0 || option.max < 0) {
      errors['max'] = 'Max value should be more than or equal to 0';
    }
    if (option.min > option.max) {
      errors['error'] = 'Min should be less than max';
    }
  }

  if (formItem.questionType === 'select') {
    if (!formItem.options
        || !(formItem.options as TFormItemOptions<'select'>).value
        || (formItem.options  as TFormItemOptions<'select'>).value.length < 2
      ) {
      errors['value'] = 'Atleast 2 options are required';
    }
    if ((formItem.options  as TFormItemOptions<'select'>).value.findIndex(val => val.trim() === '') > -1) {
      errors['value'] = 'Option value cannot be empty';
    }
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

export const validateAnswerField = (formItem: TFormItem) => {
  if (!formItem.isRequired) {
    return null;
  }
  if (formItem.questionType === 'number') {
    if (formItem.isRequired && (formItem?.answer?.trim() === '' || isNaN(Number(formItem.answer)))) {
      return 'Answer is required and should be a number';
    }
    const option = formItem.options as TFormItemOptions<'number'>;
    if (Number(formItem.answer) < option.min || Number(formItem.answer) > option.max) {
      return `Answer should be between ${option.min} and ${option.max}`;
    }
  }

  if (formItem.questionType === 'select') {
    if (formItem?.answer?.trim() === '') {
      return 'Answer is required';
    }
  }

  if (formItem.questionType === 'text') {
    if (formItem?.answer?.trim() === '') {
      return 'Answer is required';
    }
  }
  return null;
}