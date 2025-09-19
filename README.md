# 📚 Read&Lend

Um aplicativo móvel para gerenciamento de bibliotecas comunitárias, desenvolvido em React Native com Expo.

## 🚀 Funcionalidades

- **Autenticação**: Login e registro de usuários
- **Gestão de Livros**: Cadastro, edição e busca de livros
- **Empréstimos**: Sistema de solicitação e devolução de livros
- **Organizações**: Criação e participação em bibliotecas comunitárias
- **Perfil**: Gerenciamento de dados pessoais do usuário
- **Notificações**: Sistema de alertas para empréstimos e devoluções

## 🛠️ Tecnologias

- **React Native** com **Expo**
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **Redux Toolkit** para gerenciamento de estado
- **Axios** para requisições HTTP
- **Expo Image Picker** para seleção de imagens
- **Expo Secure Store** para armazenamento seguro

## 📱 Plataformas Suportadas

- iOS
- Android
- Web

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular e escalável:

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas do aplicativo
├── navigators/     # Configuração de navegação
├── services/       # Serviços de API e lógica de negócio
├── hooks/          # Hooks customizados
├── store/          # Estado global (Redux)
├── types/          # Definições de tipos TypeScript
├── utils/          # Funções utilitárias
└── config/         # Configurações do app
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd ReadAndLend

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

### Comandos Disponíveis
```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
```

## 📋 Funcionalidades Principais

### 🔐 Autenticação
- Login com email e senha
- Registro de novos usuários
- Gerenciamento de sessão

### 📖 Gestão de Livros
- Cadastro de livros com informações detalhadas
- Upload de capas de livros
- Sistema de busca e filtros
- Categorização por gênero

### 🏢 Organizações
- Criação de bibliotecas comunitárias
- Participação em organizações existentes
- Definição de regras e políticas

### 📚 Empréstimos
- Solicitação de empréstimos
- Controle de devoluções
- Histórico de empréstimos
- Sistema de lista de espera

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```
EXPO_PUBLIC_API_URL=sua-url-da-api
```


