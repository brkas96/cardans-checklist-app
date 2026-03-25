# 📁 Estrutura do Projeto

## Diretórios

```
webapp/
├── app/
│   ├── layout.tsx           # Layout raiz da aplicação
│   ├── page.tsx             # Página principal
│   ├── globals.css          # Estilos globais
│   └── favicon.ico
├── components/
│   ├── Header.tsx           # Header com botões de export/import
│   ├── ServiceForm.tsx      # Formulário para novo serviço
│   ├── ServiceCard.tsx      # Card individual de serviço
│   └── ServiceList.tsx      # Lista de serviços com filtros
├── lib/
│   ├── types.ts             # Tipos TypeScript
│   ├── firebase.ts          # Configuração Firebase (opcional)
│   ├── useServices.ts       # Hook para gerenciar serviços
│   └── pdfExport.ts         # Funções de exportação PDF
├── public/                  # Arquivos estáticos
├── .env.local              # Variáveis de ambiente (não fazer commit)
├── .gitignore              # Arquivos ignorados pelo git
├── eslint.config.mjs       # Configuração ESLint
├── next.config.ts          # Configuração Next.js
├── package.json            # Dependências
├── tailwind.config.ts      # Configuração Tailwind CSS
├── tsconfig.json           # Configuração TypeScript
├── postcss.config.mjs      # Configuração PostCSS
├── README.md               # Documentação principal
├── DEPLOY_VERCEL.md        # Guia de deploy
└── PROJECT_STRUCTURE.md    # Este arquivo
```

## 🛠️ Componentes Principais

### 1. **Header.tsx**
- Botões para exportação em PDF
- Botão para importação de JSON
- Botão para gerar relatório completo
- Design responsivo com ícones

### 2. **ServiceForm.tsx**
- Formulário para criar novo serviço
- Campo de nome obrigatório
- Campo de descrição (opcional)
- Seleção de itens do checklist (customizáveis)
- Adicionar novos itens personalizados
- Submit cria novo serviço e reseta formulário

### 3. **ServiceCard.tsx**
- Exibe informações do serviço
- Barra de progresso visual
- Lista de checkboxes para marcar itens
- Seção de notas editável
- Buttons para exportar PDF e deletar
- Status visual (concluído/pendente)

### 4. **ServiceList.tsx**
- Lista todos os serviços
- Barra de busca por nome/descrição
- Filtro por status (todos/pendentes/concluídos)
- Ordenação (por data/nome)
- Estatísticas agregadas
- Mensagem vazia quando sem serviços

## 📚 Hooks Customizados

### `useServices()`
Gerencia todo o estado do app:
- `services`: Array de serviços
- `isLoaded`: Flag se localStorage foi carregado
- `addService()`: Cria novo serviço
- `updateService()`: Atualiza serviço existente
- `toggleItemCompletion()`: Marca/desmarca item
- `deleteService()`: Deleta serviço
- `exportAsJSON()`: Exporta todos os dados
- `importFromJSON()`: Importa dados de arquivo

## 🔧 Utilitários

### `pdfExport.ts`
- `exportServiceToPDF()`: Exporta card de serviço como PDF
- `generateServiceSummaryPDF()`: Gera relatório com todos os serviços

### `firebase.ts`
- Configuração do Firebase (opcional para sincronização)
- Inicializa aplicação Firebase
- Exporta referência do banco de dados

### `types.ts`
- Interface `Service`: Estrutura de um serviço
- Interface `ServiceItem`: Estrutura de item do checklist
- Type `SortOption`: Opções de ordenação

## 📦 Dependências

```json
{
  "dependencies": {
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "firebase": "latest",
    "jspdf": "latest",
    "html2canvas": "latest",
    "lucide-react": "latest",
    "qrcode.react": "latest"
  }
}
```

## 🎨 Design & Estilo

- **Framework CSS**: Tailwind CSS v4
- **Ícones**: Lucide React
- **Tipagem**: TypeScript
- **Responsividade**: Mobile-first
- **Cores**: Azul/Verde/Laranja/Vermelho

## 🔄 Fluxo de Dados

```
User Input
    ↓
Component Event Handler
    ↓
useServices Hook
    ↓
localStorage Update
    ↓
State Update (React)
    ↓
Component Re-render
    ↓
UI Update
```

## 💾 Persistência

- **Storage Principal**: localStorage do navegador
- **Backup**: JSON exportável
- **Sincronização** (opcional): Firebase Realtime Database
- **Dados Salvos**: Automático ao fazer qualquer alteração

## 🚀 Performance

- Build otimizado com Turbopack
- Code splitting automático
- Lazy loading de componentes
- Imagens otimizadas
- CSS crítico inlined

## 🔐 Segurança

- ✅ Client-side only (sem backend)
- ✅ Sem envio de dados para servidor
- ✅ localStorage é isolado por origem
- ✅ HTTPS obrigatório no Vercel
- ✅ CORS não é problema (sem chamadas externas)

---

**Versão**: 1.0.0
**Última atualização**: 2024
