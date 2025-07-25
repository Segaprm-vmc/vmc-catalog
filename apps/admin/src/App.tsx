import { Admin, Resource } from 'react-admin';
import { ProductList } from './products/ProductList';
import { ProductEdit } from './products/ProductEdit';
import { ProductCreate } from './products/ProductCreate';
import { CategoryList } from './categories/CategoryList';
import { defaultTheme } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const baseDataProvider = jsonServerProvider('http://localhost:8000/api');

const dataProvider = {
  ...baseDataProvider,
  getList: (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return fetch(`http://localhost:8000/api/${resource}`, { headers })
      .then(response => response.json())
      .then(data => ({ data, total: data.length }));
  },
  getOne: (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return fetch(`http://localhost:8000/api/${resource}/${params.id}`, { headers })
      .then(response => response.json())
      .then(data => ({ data }));
  },
  update: (resource, params) => {
    const token = localStorage.getItem('token');
    return fetch(`http://localhost:8000/api/${resource}/${params.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(params.data),
    })
      .then(response => response.json())
      .then(data => ({ data }));
  },
  create: (resource, params) => {
    const token = localStorage.getItem('token');
    return fetch(`http://localhost:8000/api/${resource}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(params.data),
    })
      .then(response => response.json())
      .then(data => ({ data }));
  },
  delete: (resource, params) => {
    const token = localStorage.getItem('token');
    return fetch(`http://localhost:8000/api/${resource}/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => ({ data: params.previousData }));
  },
};

const authProvider = {
  login: ({ username, password }) => {
    return fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    })
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(({ token }) => {
        localStorage.setItem('token', token);
      });
  },
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
};

const theme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: '#EC2834',
    },
    secondary: {
      main: '#1E1E1E',
    },
  },
};

export default function App() {
  return (
    <Admin theme={theme} dataProvider={dataProvider} authProvider={authProvider}>
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
      />
      <Resource name="categories" list={CategoryList} />
    </Admin>
  );
} 