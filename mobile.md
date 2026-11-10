# Frame+ Pro — Diretrizes de Responsividade Mobile & Tablet (`mobile.md`)

Este documento estabelece as regras arquiteturais e de UI/UX para garantir que todas as telas, construções visuais, botões, fontes e templates de Scrollytelling do **Frame+ Pro** funcionem com precisão impecável em **smartphones** (`< 640px`) e **tablets** (`640px` a `1024px`).

---

## 1. Breakpoints e Filosofia de Design

| Dispositivo | Largura do Viewport | Prefixo Tailwind | Comportamento Principal |
| :--- | :--- | :--- | :--- |
| **Mobile Compacto** | `320px` — `390px` (iPhone SE, 13 mini) | Padrão (sem prefixo) | 1 coluna, tipografia contida, toque ergonômico |
| **Mobile Padrão** | `390px` — `640px` (iPhone 14/15/16 Pro, Galaxy S) | Padrão (sem prefixo) | 1 coluna, espaçamentos `px-4` a `px-6` |
| **Tablet / Foldable** | `640px` — `1024px` (iPad mini, iPad Air/Pro) | `sm:` e `md:` | 2 colunas em grids, proporção equilibrada |
| **Desktop / Laptop** | `>= 1024px` | `lg:` e `xl:` | Multi-colunas, pinning imersivo estendido |

---

## 2. Escala Tipográfica Fluida e Regra Anti-Overflow

### 🚨 Regra Absoluta: Fim dos Títulos Cortados
Em telas mobile (< 640px), palavras longas como **"FOTOGRAFIA"**, **"REGISTROS"** e **"ATEMPORAIS"** não cabem em fontes fixas de `text-5xl` ou `text-7xl`, vazando a borda direita da tela.

**Padrão Obrigatório para Títulos H1 e H2 de Destaque:**
```tsx
// ❌ PROIBIDO: quebra em telas de 375px
className="text-6xl sm:text-7xl md:text-8xl font-normal"

// ✅ CORRETO E HOMOLOGADO:
className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.08] break-words max-w-full px-2"
```

### Escala Padronizada por Nível Hierárquico:
1. **Hero H1 (Grandes Títulos Autorais)**:
   - Mobile: `text-2xl` a `text-3xl`
   - Tablet: `text-4xl` a `text-5xl`
   - Desktop: `text-6xl` a `text-7xl`
   - Modificadores essenciais: `break-words`, `leading-[1.08]`, `tracking-tight`.

2. **H2 de Seção (Capítulos, Dobras, Depoimentos)**:
   - Mobile: `text-xl` a `text-2xl`
   - Tablet: `text-3xl` a `text-4xl`
   - Desktop: `text-4xl` a `text-5xl`

3. **Subtítulos e Corpos de Texto**:
   - Mobile: `text-xs` a `text-sm`, `leading-relaxed`, `max-w-md`
   - Tablet/Desktop: `text-base` a `text-lg`

4. **Kickers, Selos e Etiquetas Mono**:
   - Mobile: `text-[10px]`, `tracking-[0.25em]`, `uppercase`
   - Desktop: `text-xs`, `tracking-[0.35em]`

---

## 3. Adaptação dos Templates de Scrollytelling no Mobile

### 1. `BlockHeroCurtainReveal` (Lumina Editorial)
- **Desafio**: A máscara inicial em `44%` reduzia a foto a uma tira muito estreita no mobile.
- **Otimização**: Máscara inicial adaptada para `68%` em mobile e `44%` em desktop, permitindo que os noivos/casal fiquem visíveis imediatamente.
- **Tipografia**: Título reduzido para `text-2xl sm:text-4xl md:text-6xl` com `break-words`.

### 2. `BlockCircleIrisPortal` (Horizon / Prism / Shutter)
- **Desafio**: Em telas verticais, anéis de foco circulares muito grandes (`66vh`) estouram a largura.
- **Otimização**: Anéis de lente contidos em `w-[54vw] h-[54vw] md:w-[66vh] md:h-[66vh]`.
- **Obturador 35mm**: Lâminas e máscara poligonais renderizadas com precisão em qualquer proporção de tela.

### 3. `BlockHero3DPerspective` (Noir Cinema)
- **Desafio**: A tipografia monumental em `text-[13vw]` causava scroll horizontal forçado.
- **Otimização**: Contêiner com `overflow-hidden` obrigatório e texto em `text-[11vw] md:text-[13vw]`. Satélites laterais 3D ocultos em mobile (`hidden md:block`) para focar 100% no cartão central do fotógrafo.

### 4. `BlockCardStackingAlbum` (Noir)
- **Desafio**: Cartões com altura fixa `84vh` sobrepunham textos no mobile.
- **Otimização**: Espaçamento dinâmico no topo (`index * 8px` em mobile vs `index * 14px` em desktop) e botões "Abrir Galeria" reposicionados com alinhamento flexível.

### 5. `BlockBentoZoomMosaic` (Atelier Minimal)
- **Desafio**: O grid de 3x3 ficava ilegível em telas de smartphone.
- **Otimização**: Grid com gap compacto (`gap-2 sm:gap-4`) e zoom inicial suavizado de `2.4x` no mobile (em vez de `3.2x`) para manter fluidez tátil.

### 6. `BlockKoreoSplitCurtain` (Koreo Kinetic)
- **Desafio**: As portas bipartidas dividiam palavras ao meio se fossem muito grandes.
- **Otimização**: Portas com textos em `text-xl sm:text-3xl md:text-5xl` e marquee com `text-[7vw]` contido.

### 7. `BlockInteractiveGalleryShowcase`
- **Grid de Coleções**:
  - `editorial_grid`: 1 coluna em mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
  - `contact_sheet_35mm`: 2 colunas em mobile (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4`).
  - `cinema_widescreen`: Proporção `aspect-[16/9]` adaptada para tela cheia vertical.

### 8. `BlockClientTestimonials` (Depoimentos de Clientes)
- **Responsividade**: 1 coluna no mobile, 2 em tablet, 3 em desktop.
- **Modal de Vídeo**: Reprodutor responsivo `max-w-lg mx-4` com controles touch nativos (`playsinline`, `controls`).

### 9. `BlockInstagramFeedBanner`
- **Grid de Fotos/Reels**: 2 colunas no mobile (`grid-cols-2 sm:grid-cols-3 md:grid-cols-6`), botões com largura total no mobile (`w-full sm:w-auto`).

### 10. `BlockCustomFooterSection`
- **Selos de Associações**: `flex-wrap justify-center sm:justify-start`, cartões táteis de selo com tamanho mínimo de `40px` de altura.

---

## 4. Alvos de Toque (Touch Targets) e Ergonomia Mobile

1. **Tamanho Mínimo de Botão**: Nenhum botão ou link clicável deve ter menos de `44px` de altura em mobile (`py-3 px-6`).
2. **Espaçamento entre Ações**: Distância mínima de `8px` entre botões adjacentes para evitar toques acidentais.
3. **Modais e Drawers**: Todos os modais devem possuir:
   - Botão de fechar (`X`) com pelo menos `40px x 40px` no canto superior direito.
   - Fechamento ao tocar no backdrop escurecido.
   - Bloqueio de rolagem do body quando aberto (`overflow-hidden`).

---

## 5. Checklist para Novas Telas e Componentes

- [ ] A tela foi testada mentalmente e no código para `375px` (iPhone padrão)?
- [ ] Nenhum elemento gera barra de rolagem horizontal indesejada (`overflow-x: hidden` no wrapper correto)?
- [ ] Títulos longos possuem `break-words` e escala `text-2xl sm:text-4xl md:text-6xl`?
- [ ] As imagens utilizam `object-cover` e proporções preservadas (`aspect-[3/4]`, `aspect-[16/9]`, `aspect-square`)?
- [ ] Os botões de ação e links têm padding adequado para o polegar?
- [ ] As animações de scroll funcionam suavemente sem travamentos de frame?
