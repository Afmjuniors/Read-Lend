# 🏗️ Arquitetura do App Library

## 📁 Estrutura de Pastas

```
src/
├── assets/           # Imagens, fontes, ícones
├── components/       # Componentes reutilizáveis
├── screens/          # Telas do app (1 pasta por feature)
├── navigators/       # Navegação (stack, tab, drawer)
├── services/         # Chamadas HTTP, integração com API, DTOs
├── store/           # Estado global (Redux, Zustand, Context API)
├── hooks/           # Hooks customizados
├── utils/           # Helpers, validadores, máscaras
├── constants/       # Strings fixas, cores, temas
├── i18n/           # Internacionalização (opcional)
├── types/           # Interfaces, enums e tipagens globais
└── config/         # Configurações iniciais, axios, env, tema
```

## 🧩 Padrões Implementados

### ✅ **Separação de Responsabilidades**
- **UI Logic**: Componentes focados apenas na apresentação
- **Business Logic**: Hooks e serviços isolam a lógica de negócio
- **Data Layer**: Serviços padronizados para chamadas de API

### ✅ **Modularização**
- **Services**: Separados por entidade (`authService`, `bookService`, `organizationService`)
- **Hooks**: Customizados para cada domínio (`useAuth`, `useBooks`, `useOrganizations`)
- **Components**: Reutilizáveis e genéricos

### ✅ **TypeScript**
- **Strong Typing**: Todas as interfaces e tipos definidos
- **Type Safety**: Validação em tempo de compilação
- **IntelliSense**: Autocomplete e detecção de erros

## 🚀 Serviços Implementados

### **AuthService**
```typescript
- login(credentials: LoginRequest): Promise<AuthResponse>
- signup(userData: SignupRequest): Promise<AuthResponse>
- logout(): Promise<void>
- getCurrentUser(): Promise<User>
- updateProfile(userData: Partial<User>): Promise<User>
```

### **BookService**
```typescript
- getBooks(params?: SearchBookParams): Promise<Book[]>
- getBookById(bookId: number): Promise<Book>
- createBook(bookData: CreateBookRequest): Promise<Book>
- updateBook(bookData: UpdateBookRequest): Promise<Book>
- deleteBook(bookId: number): Promise<void>
- requestLoan(bookId: number): Promise<void>
- returnBook(bookId: number): Promise<void>
```

### **OrganizationService**
```typescript
- getOrganizations(): Promise<ExtendedOrganization[]>
- getOrganizationById(organizationId: number): Promise<ExtendedOrganization>
- createOrganization(orgData: CreateOrganizationRequest): Promise<ExtendedOrganization>
- updateOrganization(orgData: UpdateOrganizationRequest): Promise<ExtendedOrganization>
- deleteOrganization(organizationId: number): Promise<void>
- joinOrganization(organizationId: number): Promise<void>
- leaveOrganization(organizationId: number): Promise<void>
```

## 🎣 Hooks Customizados

### **useAuth**
```typescript
- user: User | null
- loading: boolean
- error: string | null
- login(email, password): Promise<void>
- signup(name, email, password): Promise<void>
- logout(): Promise<void>
- updateProfile(userData): Promise<User>
- isAuthenticated: boolean
```

### **useBooks**
```typescript
- books: Book[]
- loading: boolean
- error: string | null
- fetchBooks(params): Promise<void>
- createBook(bookData): Promise<Book>
- updateBook(bookData): Promise<Book>
- deleteBook(bookId): Promise<void>
- requestLoan(bookId): Promise<void>
- returnBook(bookId): Promise<void>
```

### **useOrganizations**
```typescript
- organizations: ExtendedOrganization[]
- loading: boolean
- error: string | null
- fetchOrganizations(): Promise<void>
- createOrganization(orgData): Promise<ExtendedOrganization>
- updateOrganization(orgData): Promise<ExtendedOrganization>
- deleteOrganization(organizationId): Promise<void>
- joinOrganization(organizationId): Promise<void>
- leaveOrganization(organizationId): Promise<void>
```

## 🧭 Navegação

### **AuthNavigator**
- Login
- Signup (futuro)

### **AppNavigator**
- Home (Livros)
- Notifications
- Organizations
- Profile

## ⚙️ Configurações

### **API Config**
```typescript
- baseURL: process.env.EXPO_PUBLIC_API_URL
- timeout: 10000ms
- interceptors para token de autenticação
- tratamento de erros 401
```

### **Theme Config**
```typescript
- colors: COLORS
- spacing: SPACING
- fontSizes: FONT_SIZES
- fontWeights: FONT_WEIGHTS
- borderRadius: BORDER_RADIUS
- shadows: SHADOWS
```

## 📦 Benefícios da Arquitetura

### ✅ **Escalabilidade**
- Fácil adição de novas features
- Componentes reutilizáveis
- Separação clara de responsabilidades

### ✅ **Manutenibilidade**
- Código organizado e documentado
- Padrões consistentes
- Fácil localização de arquivos

### ✅ **Testabilidade**
- Lógica isolada em hooks
- Serviços mockáveis
- Componentes testáveis

### ✅ **Performance**
- Lazy loading de componentes
- Otimização de re-renders
- Cache de dados

## 🔄 Próximos Passos

1. **Implementar React Navigation** com os navegadores criados
2. **Adicionar testes unitários** para hooks e serviços
3. **Implementar internacionalização** (i18n)
4. **Adicionar validação de formulários** com Yup ou Zod
5. **Implementar cache de dados** com React Query ou SWR
6. **Adicionar tratamento de erros** global
7. **Implementar loading states** e skeletons
8. **Adicionar animações** e transições 