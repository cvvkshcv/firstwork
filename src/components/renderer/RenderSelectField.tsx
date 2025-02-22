import { useForm } from "../../store/useForm";
import { FormItemProp, TFormItemOptions } from "../../types/Types"

const RenderSelectField = (props: FormItemProp) => {
  const { formItem } = props;
  const { updateFormItem } = useForm();
  const { questionTitle, helperText } = formItem;
  const value = (formItem.options as TFormItemOptions<'select'>).value || [''];

  const handleUpdateAnswer = (value: string) => {
    updateFormItem(formItem, {
      ...formItem,
      answer: value
    });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm m-5">
        <p className="block"><b>Question: </b> {questionTitle}</p>
        <small className="block italic">{helperText}</small>
        <select value={formItem?.answer} onChange={(e) => handleUpdateAnswer(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500">
          <option value={''}>Select</option>
          {value.map((option: string, i: number) => {
            return <option key={i} value={option}>{option}</option>
          })}
        </select>
        {formItem?.errors?.answer && <small className="block text-red-500">{formItem?.errors?.answer}</small>}
    </div>
  )
}

export default RenderSelectField