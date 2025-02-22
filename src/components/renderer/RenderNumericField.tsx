import { useForm } from '../../store/useForm';
import { FormItemProp, TFormItemOptions } from '../../types/Types';

const RenderNumericField = (props: FormItemProp) => {
  const { formItem } = props;
  const { updateFormItem } = useForm();
  const { questionTitle, helperText } = formItem;
  const min = (formItem.options as TFormItemOptions<'number'>).min || 0;
  const max = (formItem.options as TFormItemOptions<'number'>).max || 100;

  const handleUpdateAnswer = (value: string) => {
    updateFormItem(formItem, {
      ...formItem,
      answer: value
    });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm m-5">
      <p className="block"><b>Question: </b> {questionTitle}</p>
      <input value={formItem?.answer} type="number" onChange={(e) => handleUpdateAnswer(e.target.value)} min={min} max={max} placeholder={helperText} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
      {formItem?.errors?.answer && <small className="block text-red-500">{formItem?.errors?.answer}</small>}
    </div>
  )
}

export default RenderNumericField