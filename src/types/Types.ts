
export type TFormItemOptions<T extends TFormItem['questionType']> = 
  T extends 'number' ? { value: string, min: number; max: number } :
  T extends 'text' ? { isParagraph: boolean } :
  T extends 'select' ? { value: string[]} :
  never;

export type TFormItem = {
  id: string;
  questionTitle: string;
  questionType: 'number' | 'text' | 'select' | '';
  isRequired: boolean
  isHidden: boolean;
  helperText?: string;
  options?: TFormItemOptions<'number' | 'text' | 'select'>;
  errors?: { [key: string]: string } | undefined | null;
  isSaving?: 'progress' | 'failed' | 'success';
  isExplaned?: boolean
  answer?: string;
};
export type FormState = {
  formItems: TFormItem[];
  mode: 'view' | 'edit';
  saveProgress: { [key: string]: 'progress' | 'failed' | 'success' };
}

export type FormAction = {
  addItem: () => void;
  addFormItem: (item: TFormItem) => void;
  updateFormItem: (id: TFormItem, updatedItem: TFormItem) => void;
  updateOptionsField: (id: TFormItem, updatedOptions: TFormItemOptions<TFormItem['questionType']>) => void;
  deleteFormItem: (id: string) => void;
  preFillItems: (items: TFormItem[]) => void;
  saveFormula: (item: TFormItem) => Promise<void>;
  deleteFormula: (id: string) => void;
  changeMode: (mode: 'view' | 'edit') => void;
  validateAnswer: () => boolean;
}

export type FormItemProp = {
  formItem: TFormItem;
}
export type FormRendererProp = {
  formItems: TFormItem[];
}