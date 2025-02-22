import { useEffect } from 'react';
import { useForm } from './store/useForm'
import FormBuilder from './components/builder/FormBuilder';
import FormRenderer from './components/renderer/FormRenderer';

function App() {
  
  const { addItem, preFillItems, changeMode, mode } = useForm();


  const handleMode = () => {
    if (mode === 'view') {
      changeMode('edit');
    } else {
      changeMode('view');
    }
  }

  useEffect(() => {
    try {
      const formItem = localStorage.getItem('formItems');
      if (formItem) {
        const prefillValue = JSON.parse(formItem);
        preFillItems(Object.values(prefillValue));
      }
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error in localStorage:", error)
    }
  }, [preFillItems]);

  return (
    <>
      <button className='bg-amber-200 px-3 py-1 cursor-pointer mr-2 disabled:opacity-50 disabled:cursor-not-allowed' onClick={addItem} disabled={mode === 'view'}>Add Item</button>
      <button className='bg-amber-200 px-3 py-1 cursor-pointer mr-2' onClick={handleMode}>Toggle mode</button>

      <h3>Current mode: {mode}</h3>
      <hr className='my-5' />
      {
        mode === 'view' ? <FormRenderer /> : <FormBuilder />
      }
    </>
  )
}

export default App
