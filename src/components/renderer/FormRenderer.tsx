import { useForm } from "../../store/useForm";
import RenderNumericField from "./RenderNumericField";
import RenderSelectField from "./RenderSelectField";
import RenderTextField from "./RenderTextField";


const FormRenderer = () => {
  const { formItems, validateAnswer } = useForm();

  const validFormItems = formItems.filter(formItem => formItem.options && !formItem.isHidden);
  if (validFormItems.length === 0) return <p>No form items to render</p>;

  const handleSubmit = () => {
    const isValid = validateAnswer();
    if (isValid) {
      // Save form
    }
  };

  return (
    <div>
      <h1 className="m-5">Questions form</h1>
      {
        validFormItems.map(formItem => {
          switch (formItem.questionType) {
            case 'select':
              return <RenderSelectField key={formItem.id} formItem={formItem} />
            case 'number':
              return <RenderNumericField key={formItem.id} formItem={formItem} />
            case 'text':
              return <RenderTextField key={formItem.id} formItem={formItem} />
            default:
              return <p key={formItem.id}>Unknown field</p>
          }
        })
      }
      <button
        className="bg-green-700 text-white p-3 rounded mr-5 float-end cursor-pointer"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}

export default FormRenderer;
