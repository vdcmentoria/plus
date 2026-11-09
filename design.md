# Frame+ Pro — Scrollytelling & Modular Section Composer Design System (`design.md`)

Este documento define a arquitetura técnica, os padrões de animação e o catálogo dos **9 Temas Prontos de Scrollytelling + Compositor Modular de Dobras (Mix & Match)** do **Frame+ Pro**.

---

## 1. Referências Técnicas & Inspirações Arquiteturais

1. **Basement Studio (`@bsmnt/scrollytelling`) & Layered Pinning**
   - Referências: `https://scrollytelling.basement.studio/` e `https://stackblitz.com/edit/react-ts-uuwfed?file=App.tsx`
   - Padrão: Capítulos `sticky top-0 h-screen` com `pinSpacerHeight` (`100vh` a `400vh`) onde cada camada desliza sobre a anterior.
2. **GSAP ScrollTrigger & Framer Motion (`useScroll` + `useSpring` + `useTransform`)**
   - Referência: `https://gsap.com/scroll/`
   - Padrão: Progresso normalizado (`0 -> 1`) acoplado a física de mola (`useSpring`) controlando `scale`, `rotateX`, `rotateY`, `translate3d` e `clip-path`.
3. **Koreo & Coreografia Cinética Declarativa**
   - Referência: `https://github.com/thecont1/koreo`
   - Padrão: Cortinas duplas bipartidas (`Split Curtain`), faixas tipográficas cinéticas (`Kinetic Marquee`) e cascatas diagonais.
4. **Awesome Immersive Storytelling & Scrollytelling.ai**
   - Referências: `https://github.com/vaitko/awesome-immersive-storytelling` e `https://scrollytelling.ai/`
   - Padrão: Portais em íris circular (`clip-path: circle()`), revelação de câmara escura 35mm (*Darkroom Red-to-Color Develop*), e páginas duplas sobrepostas estilo revista (*Vogue Spread*).

---

## 2. Arquitetura Modular Mix & Match (`ScrollySectionBlock[]`)

Cada tema de Scrollytelling é composto por uma lista ordenada de **Blocos de Seção Independentes** (`scrollytellingSections: ScrollySectionBlock[]`). Isso permite dois fluxos simultâneos:

1. **Escolha com 1 Clique (9 Temas Prontos)**: Ao selecionar um tema (salvo em `theme_id` no site e sincronizado no objeto da coleção), o sistema carrega automaticamente a sequência de dobras, paleta de cores e tipografia daquele tema.
2. **Mesclagem Livre entre Temas (Mix & Match)**: O fotógrafo pode adicionar uma dobra do *Noir Cinema* (ex: `card_stacking_album`) dentro do tema *Lumina Editorial*, reordenar dobras, e customizar **individualmente em cada seção**:
   - **Fontes da Seção**: `headingFont` e `bodyFont` próprios por dobra.
   - **Cores da Seção**: `bgColor`, `textColor` e `accentColor` próprios por dobra.
   - **Mídias da Seção**: Upload direto de imagens e vídeos `.mp4` em loop para a mídia principal e para os cartões/frames da seção.
   - **Estilos de Galeria**: `editorial_grid`, `masonry_flow`, `horizontal_lookbook`, `contact_sheet_35mm`, `cinema_widescreen` e proporção dos cards (`3:4`, `4:3`, `1:1`, `16:9`).

---

## 3. Catálogo dos 9 Temas Prontos de Scrollytelling

| ID (`theme_id`) | Nome do Tema | Foco / Nicho | Dobras Iniciais Inclusas |
| :--- | :--- | :--- | :--- |
| `lumina-editorial` | **1. Lumina Editorial** | Casamentos Fine Art & Luxo | `hero_curtain_reveal` → `sticky_story_split` → `horizontal_filmstrip` → `interactive_gallery_showcase` → `cta_zoom_whatsapp` |
| `noir-cinema` | **2. Noir Cinema** | Retratos, Moda & Filmmakers | `hero_3d_perspective` → `card_stacking_album` → `manifesto_word_reveal` → `interactive_gallery_showcase` → `cta_zoom_whatsapp` |
| `atelier-minimal` | **3. Atelier Minimal** | Arquitetura & Direção de Arte | `bento_zoom_mosaic` → `before_after_grading` → `floating_masonry_3col` → `interactive_gallery_showcase` → `cta_zoom_whatsapp` |
| `layered-pinning` | **4. Layered Pinning Studio** | Capítulos Imersivos `@bsmnt` | `layered_pinning_chapters` → `interactive_gallery_showcase` → `cta_zoom_whatsapp` |
| `koreo-kinetic` | **5. Koreo Kinetic** *(Novo)* | Editorial Contemporâneo & Urbano | `koreo_split_curtain` → `horizontal_filmstrip` → `floating_masonry_3col` → `interactive_gallery_showcase` → `cta_zoom_whatsapp` |
| `prism-webgl` | **6. Prism 3D Depth** *(Novo)* | Fine Art Contemporâneo & Galerias | `hero_3d_perspective` → `circle_iris_portal` → `card_stacking_album` → `interactive_gallery_showcase` → `cta_zoom_whatsapp` |
| `analog-chronicle` | **7. Analog Chronicle 35mm** *(Novo)* | Fotografia Documental & Filme 35mm | `darkroom_color_develop` → `horizontal_filmstrip` → `sticky_story_split` → `interactive_gallery_showcase` (`contact_sheet_35mm`) → `cta_zoom_whatsapp` |
| `vogue-runway` | **8. Vogue Runway** *(Novo)* | Alta Moda, Retratos & Editorial | `vogue_overlapping_spread` → `before_after_grading` → `card_stacking_album` → `interactive_gallery_showcase` (`horizontal_lookbook`) → `cta_zoom_whatsapp` |
| `horizon-parallax` | **9. Horizon Deep Parallax** *(Novo)* | Destination Weddings & Natureza | `circle_iris_portal` → `sticky_story_split` → `bento_zoom_mosaic` → `interactive_gallery_showcase` (`cinema_widescreen`) → `cta_zoom_whatsapp` |

---

## 4. Biblioteca de 12 Tipos de Dobras Combináveis (`ScrollySectionType`)

1. **`hero_curtain_reveal`** *(Lumina)*: Moldura central (`46%`) que abre até `100vw x 100vh` conforme o scroll.
2. **`sticky_story_split`** *(Lumina)*: Coluna esquerda fixa (`sticky`) com história + coluna direita com 4 fotos em Parallax.
3. **`horizontal_filmstrip`** *(Lumina / Analog)*: Faixa horizontal de 6 fotogramas com Pinning vertical e contador `01/06`.
4. **`hero_3d_perspective`** *(Noir / Prism)*: Retrato ou vídeo inclinado em 3D (`rotateX`) sobre tipografia monumental em Parallax reverso.
5. **`card_stacking_album`** *(Noir)*: 4 projetos em tela cheia (`sticky top-0`) que empilham fisicamente como um álbum folheado.
6. **`manifesto_word_reveal`** *(Noir)*: Manifesto fotográfico onde cada palavra acende progressivamente durante o scroll.
7. **`bento_zoom_mosaic`** *(Atelier)*: Mosaico 3x3 de 7 fotos que inicia com zoom `3.15x` na foto central e revela o grid ao rolar.
8. **`before_after_grading`** *(Atelier / Vogue)*: Comparador de edição RAW vs. Color Graded controlado automaticamente pelo scroll (`clip-path`).
9. **`floating_masonry_3col`** *(Atelier / Koreo)*: Grid de 3 colunas onde as laterais e o centro sobem em velocidades opostas.
10. **`layered_pinning_chapters`** *(Basement `@bsmnt`)*: 4 capítulos `100vh` fixados no topo alternando fundo escuro e cor da marca.
11. **`koreo_split_curtain`** *(Koreo Kinetic)*: Duas metades fotográficas que se abrem horizontalmente no scroll revelando o filme/retrato central e marquee cinético.
12. **`circle_iris_portal`** *(Horizon / Prism)*: Máscara circular (`clip-path: circle(14% -> 100%)`) que expande do centro para tela cheia.
13. **`darkroom_color_develop`** *(Analog 35mm)*: Simula a revelação química em câmara escura — a foto transita do filtro monocromático âmbar/vermelho para as cores originais conforme o scroll.
14. **`vogue_overlapping_spread`** *(Vogue Runway)*: Editorial de página dupla com tipografia serifada monumental sobrepondo retratos assimétricos em Parallax.
15. **`interactive_gallery_showcase`** *(Multi-Estilo)*: Dobra de portfólio/coleções com 5 estilos selecionáveis (`editorial_grid`, `masonry_flow`, `horizontal_lookbook`, `contact_sheet_35mm`, `cinema_widescreen`).
16. **`cta_zoom_whatsapp`** *( Universal)*: Encerramento com zoom-out cinematográfico e agendamento direto via WhatsApp.
