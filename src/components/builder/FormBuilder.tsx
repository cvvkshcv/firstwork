import { useForm } from '../../store/useForm';
import FormItem from './FormItem';

const FormBuilder = () => {
  const { formItems } = useForm();
  return (
    <ul>
      {
        formItems.map(formItem => {
          return <FormItem key={formItem.id} formItem={formItem} />
        })
      }
    </ul>
  )
}

export default FormBuilder;
