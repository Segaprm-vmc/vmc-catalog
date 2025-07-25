import { List, Datagrid, TextField, NumberField, EditButton } from 'react-admin';

export const CategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" label="Название" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Описание" />
      <NumberField source="products.length" label="Товаров" />
      <EditButton />
    </Datagrid>
  </List>
); 