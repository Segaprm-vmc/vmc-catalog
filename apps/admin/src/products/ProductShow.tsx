import { Show, SimpleShowLayout, TextField, ReferenceField, BooleanField, NumberField, ArrayField, Datagrid } from 'react-admin';

export const ProductShow = () => (
  <Show title="Просмотр товара">
    <SimpleShowLayout>
      <NumberField source="id" label="ID" />
      <TextField source="name" label="Название" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Описание" />
      <ReferenceField source="categoryId" reference="categories" label="Категория">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="order" label="Порядок" />
      <BooleanField source="isActive" label="Активен" />
      <ArrayField source="images" label="Изображения">
        <Datagrid>
          <TextField source="" label="URL" />
        </Datagrid>
      </ArrayField>
      <ArrayField source="videoUrls" label="Видео">
        <Datagrid>
          <TextField source="" label="URL" />
        </Datagrid>
      </ArrayField>
      <ArrayField source="characteristics" label="Характеристики">
        <Datagrid>
          <TextField source="name" label="Название" />
          <TextField source="value" label="Значение" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
); 