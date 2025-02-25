import { useForm } from '../../store/useForm';
import FormItem from './FormItem';

const FormBuilder = () => {
  const { formItems } = useForm();
  return (
    <ul>
      {
        formItems.map((formItem, i) => {
          return <FormItem key={formItem.id} index={i} formItem={formItem} />
        })
      }
    </ul>
  )
}

export default FormBuilder;
