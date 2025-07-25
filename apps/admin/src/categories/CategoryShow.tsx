import { Show, SimpleShowLayout, TextField, NumberField, ArrayField, Datagrid, ReferenceField } from 'react-admin';

export const CategoryShow = () => (
  <Show title="Просмотр категории">
    <SimpleShowLayout>
      <NumberField source="id" label="ID" />
      <TextField source="name" label="Название" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Описание" />
      <NumberField source="order" label="Порядок" />
      <ArrayField source="products" label="Товары в категории">
        <Datagrid>
          <NumberField source="id" label="ID" />
          <TextField source="name" label="Название" />
          <TextField source="description" label="Описание" />
          <NumberField source="order" label="Порядок" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
); 