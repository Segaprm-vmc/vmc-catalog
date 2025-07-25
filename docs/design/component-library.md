 # Component Library - VMC Учебник

## Обзор библиотеки компонентов

Библиотека компонентов VMC Учебника построена на базе Tailwind UI с кастомизацией под фирменный стиль VMC.

### Технологический стек
- **React** + TypeScript
- **Tailwind CSS** для стилизации
- **Headless UI** для интерактивных компонентов
- **Lucide React** для иконок
- **Framer Motion** для анимаций

## Основные компоненты

### 1. Layout Components

#### Header
```tsx
interface HeaderProps {
  showSearch?: boolean;
  sticky?: boolean;
}

function Header({ showSearch = true, sticky = true }: HeaderProps) {
  return (
    <header className={`bg-white border-b border-gray-200 ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <VMCLogo />
          <Navigation />
          {showSearch && <SearchBar />}
        </div>
      </div>
    </header>
  );
}
```

#### Footer
```tsx
function Footer() {
  return (
    <footer className="bg-vmc-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FooterSection title="О VMC" links={aboutLinks} />
          <FooterSection title="Товары" links={productLinks} />
          <FooterSection title="Поддержка" links={supportLinks} />
        </div>
      </div>
    </footer>
  );
}
```

#### Container
```tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function Container({ children, size = 'xl', className = '' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

### 2. Product Components

#### ProductCard
```tsx
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'detailed';
  showCategory?: boolean;
}

function ProductCard({ product, variant = 'default', showCategory = true }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-vmc-red-light transition-all duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img 
          src={product.mainImage} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        {showCategory && (
          <span className="text-sm text-vmc-gray-dark">{product.category.name}</span>
        )}
        <h3 className="font-semibold text-vmc-black mt-1 mb-2">{product.name}</h3>
        
        <div className="space-y-1 text-sm text-vmc-gray-dark">
          <KeyCharacteristic label="Объем" value={`${product.displacement} см³`} />
          <KeyCharacteristic label="Серия" value={product.series} />
        </div>
        
        <Button variant="outline" size="sm" className="mt-3 w-full">
          Подробнее
        </Button>
      </div>
    </div>
  );
}
```

#### ProductGallery
```tsx
interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

function ProductGallery({ images, productName, className = '' }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Основное изображение */}
      <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={images[currentImage]} 
          alt={`${productName} - фото ${currentImage + 1}`}
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Превью */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`aspect-w-16 aspect-h-12 rounded-md overflow-hidden border-2 transition-colors ${
              currentImage === index ? 'border-vmc-red' : 'border-gray-200'
            }`}
          >
            <img src={image} alt={`Превью ${index + 1}`} className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### CharacteristicsTable
```tsx
interface CharacteristicsTableProps {
  characteristics: ProductCharacteristic[];
  searchable?: boolean;
}

function CharacteristicsTable({ characteristics, searchable = true }: CharacteristicsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCharacteristics = characteristics.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {searchable && (
        <SearchInput 
          placeholder="Поиск по характеристикам..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      )}
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Характеристика
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Значение
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCharacteristics.map((char, index) => (
              <tr key={char.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {char.displayName || char.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {char.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 3. UI Components

#### Button
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled = false,
  loading = false,
  onClick 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vmc-red focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-vmc-red text-white hover:bg-vmc-red-dark disabled:bg-gray-300',
    secondary: 'bg-vmc-black text-white hover:bg-vmc-black-light disabled:bg-gray-300',
    outline: 'border border-vmc-red text-vmc-red hover:bg-vmc-red hover:text-white disabled:border-gray-300 disabled:text-gray-300',
    ghost: 'text-vmc-red hover:bg-vmc-red hover:text-white disabled:text-gray-300'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}
```

#### SearchBar
```tsx
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

function SearchBar({ placeholder = 'Поиск товаров...', onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-vmc-red focus:border-vmc-red"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </form>
  );
}
```

#### Modal
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full`}>
          {title && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            </div>
          )}
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Category Components

#### CategoryGrid
```tsx
interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

function CategoryGrid({ categories, className = '' }: CategoryGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/${category.slug}`}
          className="group block"
        >
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-vmc-red-light transition-all duration-300">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-vmc-red to-vmc-red-dark">
              <div className="flex items-center justify-center">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-vmc-gray-dark mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-vmc-red font-medium">
                  {category.productsCount} товаров
                </span>
                <ArrowRight className="w-4 h-4 text-vmc-gray group-hover:text-vmc-red transition-colors" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

### 5. Form Components

#### FormField
```tsx
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, error, required = false, children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-vmc-red ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

#### Input
```tsx
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error = false, 
  disabled = false, 
  className = '' 
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
        error 
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
          : 'border-gray-300 focus:ring-vmc-red focus:border-vmc-red'
      } ${disabled ? 'bg-gray-50 text-gray-500' : ''} ${className}`}
    />
  );
}
```

### 6. Navigation Components

#### Breadcrumbs
```tsx
interface BreadcrumbsProps {
  items: Array<{
    name: string;
    href?: string;
  }>;
  className?: string;
}

function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mr-4" />
              )}
              {item.href ? (
                <Link href={item.href} className="text-sm font-medium text-vmc-red hover:text-vmc-red-dark">
                  {item.name}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-500">{item.name}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

#### Pagination
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

#### Pagination
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <nav className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`}>
      <div className="flex w-0 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="mr-3 h-5 w-5 text-gray-400" />
          Назад
        </button>
      </div>
      
      <div className="hidden md:flex">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              page === currentPage
                ? 'border-vmc-red text-vmc-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${page === '...' ? 'cursor-default' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
          <ArrowRight className="ml-3 h-5 w-5 text-gray-400" />
        </button>
      </div>
    </nav>
  );
}
```

### 7. Utility Components

#### Loading
```tsx
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Loading({ size = 'md', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-vmc-red ${sizeClasses[size]} ${className}`} />
  );
}
```

#### Badge
```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
```

#### EmptyState
```tsx
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      )}
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 8. Comparison Components

#### ProductComparison
```tsx
interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  className?: string;
}

function ProductComparison({ products, onRemoveProduct, className = '' }: ProductComparisonProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="Нет товаров для сравнения"
        description="Добавьте товары для сравнения их характеристик"
      />
    );
  }

  const allCharacteristics = products.reduce((acc, product) => {
    product.characteristics.forEach(char => {
      if (!acc.find(c => c.name === char.name)) {
        acc.push({ name: char.name, displayName: char.displayName || char.name });
      }
    });
    return acc;
  }, [] as Array<{ name: string; displayName: string }>);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Характеристика
            </th>
            {products.map(product => (
              <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="space-y-2">
                  <img src={product.mainImage} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Удалить
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allCharacteristics.map(char => (
            <tr key={char.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {char.displayName}
              </td>
              {products.map(product => {
                const characteristic = product.characteristics.find(c => c.name === char.name);
                return (
                  <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {characteristic?.value || '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 9. Admin Components

#### DataTable
```tsx
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  className?: string;
}

function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  loading = false, 
  className = '' 
}: DataTableProps<T>) {
  if (loading) {
    return <Loading size="lg" className="mx-auto" />;
  }

  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th key={String(column.key)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map(column => (
                <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-vmc-red hover:text-vmc-red-dark"
                    >
                      Редактировать
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 10. Icons

#### VMCLogo
```tsx
function VMCLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <img
      src="https://static.tildacdn.com/tild3861-3564-4539-b862-666630643037/VMC_logo_rgb_Text_Al.svg"
      alt="VMC"
      className={className}
    />
  );
}
```

## Композиция компонентов

### Пример использования в странице товара
```tsx
function ProductPage({ product }: { product: Product }) {
  return (
    <Container>
      <Breadcrumbs 
        items={[
          { name: 'Главная', href: '/' },
          { name: product.category.name, href: `/${product.category.slug}` },
          { name: product.name }
        ]} 
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductGallery 
          images={product.images} 
          productName={product.name} 
        />
        
        <div className="space-y-6">
          <div>
            <Badge variant="default">{product.category.name}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>
          
          <CharacteristicsTable 
            characteristics={product.characteristics}
            searchable={true}
          />
        </div>
      </div>
    </Container>
  );
}
```

## Стандарты разработки

### Именование компонентов
- **PascalCase** для названий компонентов
- **camelCase** для props и функций
- **Descriptive names** - название должно четко отражать назначение

### Структура компонента
```tsx
// 1. Импорты
import React, { useState } from 'react';
import { Button } from './Button';

// 2. Типы и интерфейсы
interface ComponentProps {
  // props definition
}

// 3. Компонент
function Component(props: ComponentProps) {
  // логика компонента
  return (
    // JSX
  );
}

// 4. Экспорт
export default Component;
```

### Реюзабельность
- Компоненты должны быть максимально переиспользуемыми
- Избегать жестко заданных стилей внутри компонентов
- Предоставлять гибкие props для кастомизации
- Использовать composition pattern где возможно

Эта библиотека компонентов обеспечивает консистентный пользовательский интерфейс для VMC Учебника с фокусом на изучение мототехники.
