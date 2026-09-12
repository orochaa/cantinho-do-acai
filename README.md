![image](https://github.com/user-attachments/assets/31998816-909f-4c5d-92db-78c90defe73f)

🔗 Acesse o Projeto Online: [cantinhodoacai.vercel.app](https://cantinhodoacai.vercel.app/)

# 🍧 Cantinho do Açaí

**Cantinho do Açaí** é um cardápio online interativo para pedidos de açaí, desenvolvido com foco em praticidade, visual moderno e uma experiência intuitiva para o usuário. Os clientes podem montar seu pedido com diversas combinações de produtos, adicionar ao carrinho e finalizar via WhatsApp.

## 🚀 Tecnologias

Este projeto foi desenvolvido utilizando:

- **React** – Biblioteca para construção da interface
- **TypeScript** – Tipagem estática para maior segurança e escalabilidade
- **TailwindCSS** – Estilização rápida e responsiva com utilitários CSS

## 🎯 Funcionalidades

- 📋 **Catálogo de produtos** com variedades de açaí, acompanhamentos e adicionais
- ➕ **Adição de itens ao carrinho**, com seleção personalizada de tamanhos e complementos
- 🛒 **Resumo do pedido** com preços atualizados em tempo real
- 💬 **Finalização do pedido via WhatsApp**, com envio automático da descrição dos itens
- 📱 **Design responsivo**, adaptado para dispositivos móveis

## Desenvolvimento

Inicie a aplicação com:

```sh
pnpm dev
```

Execute o Storybook para inspecionar os controles reutilizáveis isoladamente:

```sh
pnpm storybook
```

Gere uma versão estática para verificação ou hospedagem com:

```sh
pnpm build-storybook
```

O Storybook é configurado separadamente da entrada Vite de produção. A
pré-visualização importa o stylesheet Tailwind da aplicação, e
`.storybook/main.ts` fornece suporte ao React, Tailwind e ao alias de caminho
`@/` para as stories.
