import { useForm } from '../../store/useForm';
import type { FormItemProp, TFormItem, TFormItemOptions } from '../../types/Types'
import { getOptionObject } from '../../utils/formutils';


const FormItem = (props: FormItemProp) => {
  const { formItem, } = props;
  const {
    questionTitle,
    questionType,
    isRequired,
    isHidden,
    helperText,
    errors,
    isSaving,
  } = formItem;
  const { saveProgress, updateFormItem, deleteFormItem, updateOptionsField } = useForm();

  const handleDeleteFormItem = () => {
    deleteFormItem(formItem.id);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, fieldName: keyof TFormItem) => {
    let value;
    if (['isRequired', 'isHidden'].includes(fieldName)) {
      value = (e.target as HTMLInputElement).checked; // Checked is a boolean
    } else {
      value = e.target.value; // Input box value
    }
    let newOptions: TFormItem['options'] | undefined;
    if (fieldName === 'questionType') {
      newOptions = getOptionObject(value as TFormItem['questionType']) as TFormItemOptions<TFormItem['questionType']>; // Get the options based on the question type
    } else {
      newOptions = formItem.options;
    }
    updateFormItem(formItem, {
      ...formItem,
      [fieldName]: value,
      options: newOptions,
    });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof TFormItemOptions<TFormItem['questionType']> | string, i?: number) => {
    if (!formItem.options) return;
    let value;
    if (fieldName === 'isParagraph') {
      value = (e.target as HTMLInputElement).checked; // Checked is a boolean
    } else if (['min', 'max'].includes(fieldName)) {
      value = e.target.valueAsNumber;
    } else {
      value = e.target.value; // Input box value
    }

    if (questionType === 'select' && i !== undefined) {
      const newOptions = formItem.options as TFormItemOptions<'select'>;
      const updatedOptions = [...newOptions.value] as string[];
      updatedOptions[i] = value as string;
      updateOptionsField(formItem, { value: updatedOptions});
    } else {
      const newOptions = getOptionObject(questionType) as TFormItemOptions<TFormItem['questionType']>;
      const updatedOptions = {
        ...newOptions,
        ...formItem.options,
        [fieldName]: value,
      } as TFormItemOptions<TFormItem['questionType']>;
      updateOptionsField(formItem, updatedOptions);
    }
  };

  const handleAddSelectOption = () => {
    const formOptions = formItem.options as TFormItemOptions<'select'>;;
    if (!formOptions || questionType !== 'select') return;
    const updatedOptions = [
      ...formOptions.value,
      'Option',
    ];
    updateOptionsField(formItem, { value: updatedOptions });
  };

  const handleDeleteSelectOption = (index: number) => {
    const formOptions = formItem.options as TFormItemOptions<'select'>;
    if (!formOptions || questionType !== 'select') return;
    const updatedOptions = [
      ...formOptions.value,
    ];
    updatedOptions.splice(index, 1);
    updateOptionsField(formItem, { value: updatedOptions });
  };

  const renderOptions = () => {
    if (questionType === 'select') {
      const options = formItem.options as TFormItemOptions<'select'>;
      return (
        <>
          <hr className='my-3' />
          {
            (options.value).map((option, index) => {
              return (
                <div key={index}>
                  <label htmlFor="options" className="block mb-2 text-sm font-medium text-gray-900">Option {index + 1}</label>
                  <div className='flex'>
                    <input
                      type="text"
                      autoFocus
                      value={option}
                      onChange={(e) => handleOptionChange(e, 'value', index)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    <button
                      onClick={() => handleDeleteSelectOption(index)}
                      aria-label='delete-select-option'
                      className='bg-rose-500 px-3 ml-2 rounded-md text-white cursor-pointer'
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )
            })
          }
          { errors?.value !== undefined && <p className='text-red-500'>{errors.value}</p> }
          <button
            onClick={handleAddSelectOption}
            className='disabled:opacity-50 bg-blue-400 text-white p-2 rounded-lg mt-3'
            disabled={(formItem.options  as TFormItemOptions<'select'>).value.findIndex(val => val.trim() === '') > -1}
          >
            Add option +
          </button>
        </>
      )
    } else if (questionType === 'number') {
      const options = formItem.options as TFormItemOptions<'number'>;
      return (
        <div className='flex gap-5 mt-3'>
          <div className='flex-1'>
            <label htmlFor="min" className="block mb-2 text-sm font-medium text-gray-900">Min</label>
            <input
              id="min"
              type="number"
              value={options?.min}
              onChange={(e) => handleOptionChange(e, 'min')} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className='flex-1'>
            <label htmlFor="max" className="block mb-2 text-sm font-medium text-gray-900">Max</label>
            <input
              id="max"
              type="number"
              value={options?.max}
              onChange={(e) => handleOptionChange(e, 'max')} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors?.min !== undefined && <p className='text-red-500'>{errors.min}</p>}
            {errors?.max !== undefined && <p className='text-red-500'>{errors.max}</p>}
            {errors?.error !== undefined && <p className='text-red-500'>{errors.error}</p>}
          </div>
        </div>
      )
    } else if (questionType === 'text') {
      const options = formItem.options as TFormItemOptions<'text'>;
      return (
        <div>
          <input type='checkbox' onChange={(e) => handleOptionChange(e, 'isParagraph')} checked={options?.isParagraph} /> is paragraph
        </div>
      )
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm m-5 p-6'>
      <div>
        {/* {isSaving && <p className='text-blue-500'>Saving...</p>}
        {saveProgress?.[formItem?.id] && <p className='text-green-500'>{saveProgress[formItem.id]}</p>} */}
        <div className='flex w-full relative'>
          <div className='flex-1'>
            <label htmlFor="question_name" className="block mb-2 text-sm font-medium text-gray-900">Question</label>
            <input
              type="text"
              value={questionTitle}
              id="question_name"
              onChange={(e) => handleNameChange(e, 'questionTitle')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors?.questionTitle !== undefined && <p className='text-red-500'>{errors.questionTitle}</p>}
          </div>
          <button className='bg-rose-500 px-3 py-2 ml-2 rounded-md text-white cursor-pointer self-end' onClick={handleDeleteFormItem}>&times;</button>
          <div className='absolute right-[0px] top-[-10px] text-right'>
            {saveProgress?.[formItem?.id] === 'progress' && <p className='text-green-500'>Saving...</p>}
            {saveProgress?.[formItem?.id] === 'failed' && <p className='text-red-500'>Failed to save in db</p>}
            {saveProgress?.[formItem?.id] === 'success' && <p className='text-green-500'>Saved</p>}
          </div>
        </div>

        <div className='flex gap-5 mt-3 items-center'>
          <div className='flex-1'>
            <label htmlFor="question_title" className="block mb-2 text-sm font-medium text-gray-900">Type</label>
            <select onChange={(e) => handleNameChange(e, 'questionType')} value={questionType} id="question_title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">Select an option</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>
            {errors?.questionType !== undefined && <p className='text-red-500'>{errors.questionType}</p>}
          </div>

          <div className='flex mt-3 items-center'>
            <label htmlFor="isRequired" className="block mb-2 text-sm font-medium text-gray-900">
              <input id="isRequired" type='checkbox' onChange={(e) => handleNameChange(e, 'isRequired')} checked={isRequired} /> Required
            </label>
            
            <label htmlFor="isHidden" className="block mb-2 text-sm font-medium text-gray-900">
              <input id="isHidden" type='checkbox' onChange={(e) => handleNameChange(e, 'isHidden')} checked={isHidden} /> Hidden
            </label>
          </div>
        </div>

        <div className='mt-3'>
          <label htmlFor="helperText" className="block mb-2 text-sm font-medium text-gray-900">Helper text</label>
          <input
            type="text"
            value={helperText}
            id="helperText"
            onChange={(e) => handleNameChange(e, 'helperText')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
      </div>

      {renderOptions()}
    </div>
  )
}

export default FormItem;
