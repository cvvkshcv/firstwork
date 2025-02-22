import { useForm } from "../../store/useForm";
import { FormItemProp, TFormItemOptions } from "../../types/Types"

const RenderTextField = (props: FormItemProp) => {
  const { formItem } = props;
    const { updateFormItem } = useForm();
  const { questionTitle, helperText } = formItem;
  const isParagraph = (formItem.options as TFormItemOptions<'text'>).isParagraph || false;

  const handleUpdateAnswer = (value: string) => {
    updateFormItem(formItem, {
      ...formItem,
      answer: value
    });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm m-5">
        <p className="block"><b>Question: </b> {questionTitle}</p>
        {
          isParagraph ?
            <textarea value={formItem?.answer} onChange={(e) => handleUpdateAnswer(e.target.value)} placeholder={helperText} className="w-full h-40 border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            :
            <input value={formItem?.answer} type="text" onChange={(e) => handleUpdateAnswer(e.target.value)} placeholder={helperText} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        }
        {formItem?.errors?.answer && <small className="block text-red-500">{formItem?.errors?.answer}</small>}
    </div>
  )
}

export default RenderTextField