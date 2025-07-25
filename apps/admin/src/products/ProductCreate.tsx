import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, BooleanInput, ArrayInput, SimpleFormIterator } from 'react-admin';

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Название" />
      <TextInput source="slug" label="Slug" />
      <TextInput source="description" label="Описание" multiline rows={3} />
      <ReferenceInput source="categoryId" reference="categories" label="Категория">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="isActive" label="Активен" defaultValue={true} />
      <ArrayInput source="images" label="Изображения">
        <SimpleFormIterator>
          <TextInput source="" label="URL изображения" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="videoUrls" label="Видео">
        <SimpleFormIterator>
          <TextInput source="" label="URL видео" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
); 