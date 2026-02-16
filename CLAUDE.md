# CLAUDE.md

Contexto, regras e instruções para o Claude Code neste projeto.

---

## Visão Geral do Projeto

Este é o **AtenXP Mobile App** (v4.3.13), um fork customizado do **Chatwoot Mobile App** pela **WAXP**. É uma aplicação React Native (Expo) que permite agentes de suporte visualizar e gerenciar conversas de clientes pelo celular.

- **Nome interno:** AtenXP
- **Base:** Chatwoot Mobile App
- **Customização:** WAXP
- **Bundle IDs:** `com.waxp.atendxp` (iOS/Android)
- **EAS Project ID:** `0afb2e98-ef49-4bbb-93e5-424eaa53da85`

---

## Stack Tecnológico

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | React Native 0.76.9 + Expo 52 |
| Linguagem | TypeScript 5.1 (strict) |
| Package Manager | pnpm |
| Styling | Tailwind CSS via `twrnc` 4.5 |
| State | Redux Toolkit 2.5 + Redux Persist |
| Navigation | React Navigation 6.x (native-stack + bottom-tabs) |
| Animations | React Native Reanimated 3.16 |
| Bottom Sheets | @gorhom/bottom-sheet 5.1 |
| Forms | React Hook Form 7.52 |
| HTTP | Axios 1.12 |
| WebSocket | ActionCable |
| i18n | i18n-js 3.8 (45+ idiomas via Crowdin) |
| Push | Notifee 9.1 + Firebase |
| Monitoring | Sentry 6.10 |
| Testing | Jest 29.6 |
| Linting | ESLint 8.57 + Prettier 3.3 |
| Storybook | Storybook React Native 8.6 |

---

## Estrutura do Projeto

```
src/
├── App.tsx                   # Root component
├── components-next/          # Componentes reutilizáveis (UI)
│   ├── common/               # icon, search, swipeable, filters, spinner
│   ├── button/               # Variantes de botão
│   ├── label-section/        # Labels management
│   ├── list-components/      # Listas genéricas
│   └── sheet-components/     # Bottom sheet components
├── constants/                # Constantes da app
├── context/                  # React Context providers
├── hooks/                    # Custom hooks (useThemeColors, useAppSelector, etc.)
├── i18n/                     # Internacionalização (YAML)
├── navigation/               # Stack + Bottom Tabs navigation
├── screens/                  # Telas da aplicação
│   ├── auth/                 # Login, MFA, ForgotPassword, ConfigURL
│   ├── chat-screen/          # Chat principal (messages, reply-box, macros)
│   ├── conversations/        # Lista de conversas
│   ├── contact-details/      # Detalhes do contato
│   ├── dashboard/            # Dashboard
│   ├── inbox/                # Inbox
│   └── settings/             # Configurações
├── services/                 # Camada de API
├── store/                    # Redux slices (auth, conversation, contact, etc.)
├── svg-icons/                # Ícones SVG como componentes React
├── theme/                    # Tailwind config + cores (light/dark)
├── types/                    # Type definitions
└── utils/                    # Funções utilitárias
```

---

## Comandos Principais

```bash
pnpm install              # Instalar dependências
pnpm start                # Dev server Expo
pnpm ios                  # Rodar no iOS Simulator
pnpm android              # Rodar no Android Emulator
pnpm start:storybook      # Storybook
pnpm test                 # Testes Jest
pnpm lint                 # ESLint
pnpm build:android        # Build Android (EAS)
pnpm build:ios            # Build iOS (EAS)
```

---

## Padrões Importantes

### Theming (Dark/Light Mode)
- O app usa `useColorScheme()` do React Native para detectar o tema
- Hook customizado: `useThemeColors()` retorna `{ getThemedColor, theme }`
- Cores do tema usam classes Tailwind flat: `brand-primary`, `brand-background`, `brand-background-dark`
- Para `handleIndicatorStyle` de BottomSheets, usar objetos JS (não tailwind classes):
  ```tsx
  handleIndicatorStyle={{
    backgroundColor: colorScheme === 'dark'
      ? 'hsla(0, 0%, 100%, 0.169)'
      : 'hsla(0, 0%, 0%, 0.133)',
    overflow: 'hidden',
    width: 32,
    height: 4,
    borderRadius: 11,
  }}
  ```
- `tailwind.style()` retorna `Style` (tipo complexo) - para propriedades que esperam `string`, usar `as string`
- `tailwind.color()` retorna `string | undefined` - sempre adicionar fallback

### SVG Icons
- Ícones aceitam `IconProps` com `stroke`, `fill`, `strokeWidth`
- **Não** usar valores default hardcoded nos ícones - o tema deve definir as cores
- Tipo `IconProps` definido em `src/types/index.ts`

### BottomSheetModal
- NUNCA duplicar a prop `style` em BottomSheetModal
- Padrão correto: `handleIndicatorStyle` → `handleStyle` → `style` (uma vez só)

### State Management
- Redux Toolkit com slices por domínio
- Selectors com `createSelector` (reselect)
- `useAppSelector` e `useAppDispatch` tipados

### Dependências Nativas
- **OBRIGATÓRIO:** `npx expo install <package>` para pacotes com código nativo
- `pnpm add <package>` apenas para dependências JS puras

### Commits
- Conventional Commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`
- Versão pre-1.0.0 (0.y.z)

---

## Configuração de Código

### Prettier
- Print width: 100
- Single quotes
- Trailing commas: all
- Arrow parens: avoid
- JSX bracket same line

### TypeScript
- Strict mode habilitado
- Path aliases: `@/*` → `src/*`
- Extends: `expo/tsconfig.base`

---

## Notas

- **Idioma de resposta:** Sempre responder em Português Brasileiro
- **Plataformas suportadas:** iOS 13.4+, Android 6.0+ (SDK 24+, target 35)
- **Backend compatível:** Chatwoot 3.13.0+
- Deep linking: scheme `chatwootapp`
