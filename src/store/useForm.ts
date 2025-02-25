import { create } from 'zustand';
import { TFormItem, FormAction, FormState, TFormItemOptions } from '../types/Types';
import { devtools } from 'zustand/middleware';
import { validateAnswerField, validateBuilderField } from '../utils/formutils';

const formInitalState: TFormItem = {
  id: Math.random().toString().slice(-6),
  questionTitle: '',
  questionType: '',
  isRequired: false,
  isHidden: false,
  helperText: '',
  options: undefined,
}

let i = 0;

export const useForm = create<FormState & FormAction>()(
  devtools(
    (set, get) => ({
      // State
      formItems: [
        {...formInitalState}
      ],
      mode: 'edit',

      // Actions
      preFillItems: (items: TFormItem[]) => set(() => {
        return {
          formItems: [...items]
        };
      }),
      addItem: () => set((state) => {
        const idStr = Math.random().toString().slice(-6);
        return {
          formItems: [...state.formItems, {...formInitalState, id: idStr}]
        };
      }),
      addFormItem: (item: TFormItem) => {
        set((state) => ({
          formItems: [...state.formItems, {...item}]
        }))
      },

      deleteFormItem: (id: string) => {
        set((state) => {
          state.deleteFormula(id);
          return {
            formItems: state.formItems.filter(formItem => formItem.id !== id)
          }
        })
      },

      updateFormItem: (currentItem: TFormItem, updatedItem: TFormItem) => {
        let promise: Promise<void> | undefined;
        let hasError = false;
        set((state) => {
          const updatedItems = state.formItems.map(formItem => {
            if (formItem.id === currentItem.id) {
              const errors = validateBuilderField(updatedItem);
              if (!errors && !updatedItem['answer']) {
                promise = state.saveFormula(updatedItem);
                return {...updatedItem, errors: null };
              }
              hasError = true;
              return { ...updatedItem, errors };
            }
            return formItem;
          });

          const updatedStore: Partial<FormState> = {
            formItems: updatedItems as TFormItem[],
          }
          if (!hasError) {
            updatedStore['saveProgress'] = { ...state.saveProgress, [currentItem.id]: 'progress'};
          }
          return updatedStore;
        });

        if (promise) {
          promise.then(() => {
            set({ saveProgress: { ...get().saveProgress, [currentItem.id]: 'success'} });
          }).catch(() => {
            set({ saveProgress: { ...get().saveProgress, [currentItem.id]: 'failed'} });
          });
        }
      },

      updateOptionsField: async (currentItem: TFormItem, updatedOptions: TFormItemOptions<TFormItem['questionType']>) => {
        let promise: Promise<void> | undefined;
        let hasError = false;

        set((state) => {
          const updatedItems = state.formItems.map(formItem => {
            if (formItem.id === currentItem.id) {
              const updatedItem = {
                ...formItem,
                options: {
                  ...updatedOptions
                }
              };

              const errors = validateBuilderField(updatedItem);
              if (!errors) {
                promise = state.saveFormula(updatedItem);
                return {...updatedItem, errors: undefined};
              }
              hasError = true;
              return { ...updatedItem, errors };
            }
            return formItem;
          });


          const updatedStore: Partial<FormState> = {
            formItems: updatedItems as TFormItem[],
          }
          if (!hasError) {
            updatedStore['saveProgress'] = { ...state.saveProgress, [currentItem.id]: 'progress'};
          }
          return updatedStore;
        });

        if (promise) {
          promise.then(() => {
            set({ saveProgress: { ...get().saveProgress, [currentItem.id]: 'success'} });
          }).catch(() => {
            set({ saveProgress: { ...get().saveProgress, [currentItem.id]: 'failed'} });
          });
        }
      },

      saveFormula: (item: TFormItem) => {
        i += 1;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (i % 5 === 0) {
              return reject('Failed to save');
            }
            const localFormItem = localStorage.getItem('formItems') || '{}';
            const formItems = JSON.parse(localFormItem);
            formItems[item.id] = item;
            localStorage.setItem('formItems', JSON.stringify(formItems));

            const updatedItems = get().formItems.map(formItem => {
              if (formItem.id === item.id) {
                return {...formItem };
              }
              return formItem;
            });
            set({ formItems: updatedItems });
            resolve();
          }, 1000);

        });
      },

      deleteFormula: (id: string) => {
        const localFormItem = localStorage.getItem('formItems') || '{}';
        const formItems = JSON.parse(localFormItem);
        delete formItems[id];
        localStorage.setItem('formItems', JSON.stringify(formItems));
      },

      changeMode: (mode: 'view' | 'edit') => {
        set(() => ({ mode }))
      },

      validateAnswer: () => {
        let hasError = false;
        const validatedFields = get().formItems.filter(item => !item.isHidden).map(formItem => {
          const error = validateAnswerField(formItem);
          if (error) {
            hasError = true;
          }
          return { ...formItem, errors: { answer: error } };
        });
        set({ formItems: validatedFields as TFormItem[] });
        return hasError;
      }

    })
  )
);
