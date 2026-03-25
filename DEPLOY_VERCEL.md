# 🚀 Guia de Deploy no Vercel

Seu web app Checklist Cardans está pronto para ser deployado no Vercel!

## Opção 1: Deploy com GitHub (Recomendado)

### 1. Prepare o repositório

```bash
git init
git add .
git commit -m "Initial commit: Cardans Checklist App"
```

### 2. Adicione ao GitHub

1. Crie um repositório em [github.com/new](https://github.com/new)
2. Siga os comandos fornecidos para fazer push

```bash
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### 3. Deploy com Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Escolha seu repositório do GitHub
5. Clique em "Deploy"

**Pronto!** Seu app estará online em poucos segundos.

## Opção 2: Deploy com Vercel CLI

```bash
# Instale o CLI
npm install -g vercel

# Faça login
vercel login

# Deploy
vercel
```

Siga as instruções do CLI. Seu projeto será deployado automaticamente.

## Opção 3: Deploy do ZIP

1. Comprima a pasta `webapp`
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Faça upload do ZIP
5. Clique em "Deploy"

## ⚙️ Variáveis de Ambiente (Opcional)

Se quiser usar Firebase para sincronização entre dispositivos:

1. No painel Vercel, vá para "Settings" > "Environment Variables"
2. Adicione as variáveis do Firebase:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Clique em "Save"
4. Redeploy a application

## 🧪 Teste Local Antes de Deploy

```bash
# Build da produção
npm run build

# Execute a build de produção locally
npm start
```

Abra [http://localhost:3000](http://localhost:3000) para testar.

## 📊 Domínio Personalizado (Vercel)

1. No painel Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio
3. Configure o DNS conforme indicado
4. Pronto! Seu app está em seu domínio

## 🆘 Troubleshooting

### Build falha no Vercel
- Verifique se o `package.json` está correto
- Certifique-se de que não há erros de TypeScript
- Verifique o log de build no painel Vercel

### App não carrega dados
- Verifique se localStorage está habilitado
- Verifique o console do navegador para erros

### PDF não gera online
- Vercel suporta jsPDF sem problemas
- Verifique se não há muitos dados na memória

## 📝 Notas Importantes

- ✅ Todos os dados ficam no localStorage do navegador (não há servidor)
- ✅ Sem custo adicional de banco de dados
- ✅ Deploy automático em cada push no GitHub
- ✅ SSL automático (HTTPS)

## 🔐 Segurança

O app é 100% client-side:
- Nenhum dado é enviado para servidor
- Nenhuma cookies ou rastreamento
- Totalmente privado

---

**Sucesso!** Seu app agora está online e acessível globalmente! 🎉
