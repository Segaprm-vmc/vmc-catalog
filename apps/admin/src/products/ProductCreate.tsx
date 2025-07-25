import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, BooleanInput, NumberInput, ArrayInput, SimpleFormIterator } from 'react-admin';
import { CharacteristicsEditor } from './CharacteristicsEditor';

export const ProductCreate = () => (
  <Create title="Создать товар">
    <SimpleForm>
      <TextInput source="name" label="Название" fullWidth />
      <TextInput source="slug" label="Slug" fullWidth />
      <TextInput source="description" label="Описание" multiline rows={3} fullWidth />
      <ReferenceInput source="categoryId" reference="categories" label="Категория">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="order" label="Порядок" />
      <BooleanInput source="isActive" label="Активен" />
      <ArrayInput source="images" label="Изображения">
        <SimpleFormIterator>
          <TextInput source="" label="URL изображения" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="videoUrls" label="Видео (YouTube/VK)">
        <SimpleFormIterator>
          <TextInput source="" label="URL видео" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
      <CharacteristicsEditor />
    </SimpleForm>
  </Create>
); 