import { Admin, Resource } from 'react-admin';
import { ProductList } from './products/ProductList';
import { ProductEdit } from './products/ProductEdit';
import { ProductCreate } from './products/ProductCreate';
import { ProductShow } from './products/ProductShow';
import { CategoryList } from './categories/CategoryList';
import { CategoryShow } from './categories/CategoryShow';
import { defaultTheme } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const baseDataProvider = jsonServerProvider('http://localhost:8000/api');

const dataProvider = {
  ...baseDataProvider,
  getList: (resource: string, params: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`http://localhost:8000/api/${resource}`, { headers })
      .then(response => response.json())
      .then(data => ({ data, total: data.length }));
  },
  getOne: (resource: string, params: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`http://localhost:8000/api/${resource}/${params.id}`, { headers })
      .then(response => response.json())
      .then(data => ({ data }));
  },
  update: (resource: string, params: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`http://localhost:8000/api/${resource}/${params.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(params.data),
    })
      .then(response => response.json())
      .then(data => ({ data }));
  },
  create: (resource: string, params: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`http://localhost:8000/api/${resource}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params.data),
    })
      .then(response => response.json())
      .then(data => ({ data }));
  },
  delete: (resource: string, params: any) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`http://localhost:8000/api/${resource}/${params.id}`, {
      method: 'DELETE',
      headers,
    })
      .then(() => ({ data: params.previousData }));
  },
};

const authProvider = {
  login: ({ username, password }: { username: string; password: string }) => {
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
  checkError: (error: any) => {
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
    <Admin 
      theme={theme} 
      dataProvider={dataProvider} 
      authProvider={authProvider}
      title="VMC Админка"
    >
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
        show={ProductShow}
      />
      <Resource 
        name="categories" 
        list={CategoryList} 
        show={CategoryShow}
      />
    </Admin>
  );
} 