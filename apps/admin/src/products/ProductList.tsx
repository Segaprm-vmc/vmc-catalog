import { List, Datagrid, TextField, ReferenceField, BooleanField, EditButton } from 'react-admin';

export const ProductList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" label="Название" />
      <ReferenceField source="categoryId" reference="categories" label="Категория">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="description" label="Описание" />
      <BooleanField source="isActive" label="Активен" />
      <EditButton />
    </Datagrid>
  </List>
); 