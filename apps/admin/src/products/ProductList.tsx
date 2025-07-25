import { List, Datagrid, TextField, ReferenceField, BooleanField, EditButton, ShowButton, NumberField } from 'react-admin';

export const ProductList = () => (
  <List title="Товары VMC" perPage={25}>
    <Datagrid rowClick="edit">
      <NumberField source="id" label="ID" />
      <TextField source="name" label="Название" />
      <ReferenceField source="categoryId" reference="categories" label="Категория">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="description" label="Описание" />
      <NumberField source="order" label="Порядок" />
      <BooleanField source="isActive" label="Активен" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
); 