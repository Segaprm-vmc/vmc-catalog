import { List, Datagrid, TextField, NumberField, EditButton, ShowButton } from 'react-admin';

export const CategoryList = () => (
  <List title="Категории товаров" perPage={10}>
    <Datagrid rowClick="edit">
      <NumberField source="id" label="ID" />
      <TextField source="name" label="Название" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Описание" />
      <NumberField source="order" label="Порядок" />
      <NumberField source="products.length" label="Товаров" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
); 