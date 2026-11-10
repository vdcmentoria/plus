# Frame+ Pro — Scrollytelling & Modular Section Composer Design System (`design.md`)

Este documento define a arquitetura técnica, os padrões de animação, os princípios de UI/UX do sistema e o catálogo dos **9 Temas Prontos de Scrollytelling + Compositor Modular de Dobras (Mix & Match)** do **Frame+ Pro**.

---

## 1. Princípios Globais de UI/UX & Identidade Visual Do Sistema

1. **Temas Escuro & Claro Consistentes**:
   - Todo o sistema (Painel CRM, Editor de Galerias, Construtor de Sites e Visualização Publicada) suporta alternância entre **Modo Escuro** (`dark`) e **Modo Claro** (`light`).
   - Ao transitar entre as abas do aplicativo (ex: de *Galerias* para *Site*), o modo de cor ativo é mantido estritamente, sem resets automáticos para efeito glassmorphism forçado.

2. **Tipografia & Densidade Visual Clean**:
   - Sem barras de rolagem brutas: Scrollbars ultra-finas e discretas (4px com bordas suaves) integradas ao tema.
   - Sem poluição visual ou sublinhados desnecessários: Descrições redundantes e marcadores decorativos pesados foram removidos das dobras para manter o foco total na fotografia do usuário.
   - Navegação retrátil: Painéis laterais e menus Sanfona/Accordion com recolhimento e persistência.

---

## 2. Referências Técnicas & Inspirações Arquiteturais de Scrollytelling

1. **Basement Studio (`@bsmnt/scrollytelling`) & Layered Pinning**
   - Referências: `https://scrollytelling.basement.studio/` e `https://stackblitz.com/edit/react-ts-uuwfed?file=App.tsx`
   - Padrão: Capítulos `sticky top-0 h-screen` com `pinSpacerHeight` (`100vh` a `400vh`) onde cada camada desliza sobre a anterior.

2. **GSAP ScrollTrigger & Framer Motion (`useScroll` + `useSpring` + `useTransform`)**
   - Referência: `https://gsap.com/scroll/`
   - Padrão: Progresso normalizado (`0 -> 1`) acoplado a física de mola (`useSpring`) controlando `scale`, `rotateX`, `rotateY`, `translate3d` e `clip-path`.

3. **Mecânica de Obturador de Câmera 35mm (`portalShape: 'shutter'`) & Portal Íris**
   - Efeito visual óptico inspirado em diafragmas fotográficos de 8 lâminas.
   - Utiliza matemática trigonométrica (`clip-path: polygon(...)`) acoplada ao scroll progress para abrir suavemente as lâminas de um diafragma fotográfico de 35mm (ou expansão circular de íris `'circle'`).

4. **Koreo & Coreografia Cinética Declarativa**
   - Referência: `https://github.com/thecont1/koreo`
   - Padrão: Cortinas duplas bipartidas (`Split Curtain`), faixas tipográficas cinéticas (`Kinetic Marquee`) e cascatas diagonais.

5. **Awesome Immersive Storytelling & Scrollytelling.ai**
   - Referências: `https://github.com/vaitko/awesome-immersive-storytelling` e `https://scrollytelling.ai/`
   - Padrão: Portais fotográficos em diafragma/obturador, revelação de câmara escura 35mm (*Darkroom Red-to-Color Develop*), e páginas duplas sobrepostas estilo revista (*Vogue Spread*).

---

## 3. Arquitetura Modular Mix & Match (`ScrollySectionBlock[]`)

Cada tema de Scrollytelling é composto por uma lista ordenada de **Blocos de Seção Independentes** (`scrollytellingSections: ScrollySectionBlock[]`). Isso permite dois fluxos simultâneos:

1. **Escolha com 1 Clique (9 Temas Prontos)**: Ao selecionar um tema (salvo em `theme_id` no site e sincronizado no objeto da coleção), o sistema carrega automaticamente a sequência de dobras, paleta de cores e tipografia daquele tema.
2. **Mesclagem Livre entre Temas (Mix & Match)**: O fotógrafo pode adicionar uma dobra do *Noir Cinema* (ex: `card_stacking_album`) dentro do tema *Lumina Editorial*, reordenar dobras, e customizar **individualmente em cada seção**:
   - **Fontes da Seção**: `headingFont` e `bodyFont` próprios por dobra.
   - **Cores da Seção**: `bgColor`, `textColor` e `accentColor` próprios por dobra.
   - **Mídias da Seção**: Upload direto de imagens e vídeos `.mp4` em loop para a mídia principal e para os cartões/frames da seção.
   - **Formatos de Portal**: Escolha entre Diafragma de Obturador de Câmera (`shutter`) ou Portal Íris Circular (`circle`).
   - **Estilos de Galeria**: `editorial_grid`, `masonry_flow`, `horizontal_lookbook`, `contact_sheet_35mm`, `cinema_widescreen` e proporção dos cards (`3:4`, `4:3`, `1:1`, `16:9`).

---

## 4. Catálogo dos 9 Temas Prontos de Scrollytelling

| ID (`theme_id`) | Nome do Tema | Foco / Nicho | Dobras Iniciais Inclusas |
| :--- | :--- | :--- | :--- |
| `lumina-editorial` | **1. Lumina Editorial** | Casamentos Fine Art & Luxo | `hero_curtain_reveal` → `sticky_story_split` → `horizontal_filmstrip` → `interactive_gallery_showcase` → `client_testimonials` → `instagram_feed_banner` → `custom_footer_section` |
| `noir-cinema` | **2. Noir Cinema** | Retratos, Moda & Filmmakers | `hero_3d_perspective` → `card_stacking_album` → `manifesto_word_reveal` → `interactive_gallery_showcase` → `client_testimonials` → `instagram_feed_banner` → `custom_footer_section` |
| `atelier-minimal` | **3. Atelier Minimal** | Arquitetura & Direção de Arte | `bento_zoom_mosaic` → `before_after_grading` → `floating_masonry_3col` → `interactive_gallery_showcase` → `client_testimonials` → `instagram_feed_banner` → `custom_footer_section` |
| `layered-pinning` | **4. Layered Pinning Studio** | Capítulos Imersivos `@bsmnt` | `layered_pinning_chapters` → `interactive_gallery_showcase` → `client_testimonials` → `instagram_feed_banner` → `custom_footer_section` |
| `koreo-kinetic` | **5. Koreo Kinetic** | Editorial Contemporâneo & Urbano | `koreo_split_curtain` → `horizontal_filmstrip` → `floating_masonry_3col` → `interactive_gallery_showcase` → `instagram_feed_banner` → `custom_footer_section` |
| `prism-webgl` | **6. Prism 3D Depth** | Fine Art Contemporâneo & Galerias | `hero_3d_perspective` → `circle_iris_portal` → `card_stacking_album` → `interactive_gallery_showcase` → `custom_footer_section` |
| `analog-chronicle` | **7. Analog Chronicle 35mm** | Fotografia Documental & Filme 35mm | `darkroom_color_develop` → `horizontal_filmstrip` → `sticky_story_split` → `interactive_gallery_showcase` (`contact_sheet_35mm`) → `client_testimonials` → `custom_footer_section` |
| `vogue-runway` | **8. Vogue Runway** | Alta Moda, Retratos & Editorial | `vogue_overlapping_spread` → `before_after_grading` → `card_stacking_album` → `interactive_gallery_showcase` (`horizontal_lookbook`) → `custom_footer_section` |
| `horizon-parallax` | **9. Horizon Deep Parallax** | Destination Weddings & Natureza | `circle_iris_portal` → `sticky_story_split` → `bento_zoom_mosaic` → `interactive_gallery_showcase` (`cinema_widescreen`) → `custom_footer_section` |

---

## 5. Biblioteca de Dobras Combináveis (`ScrollySectionType`)

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
12. **`circle_iris_portal`** *(Horizon / Prism)*: Máscara com transição selecionável entre **Obturador de Câmera 35mm (8 lâminas)** (`shutter`) e **Íris Circular** (`circle`).
13. **`darkroom_color_develop`** *(Analog 35mm)*: Simula a revelação química em câmara escura — a foto transita do filtro monocromático âmbar/vermelho para as cores originais conforme o scroll.
14. **`vogue_overlapping_spread`** *(Vogue Runway)*: Editorial de página dupla com tipografia serifada monumental sobrepondo retratos assimétricos em Parallax.
15. **`interactive_gallery_showcase`** *(Multi-Estilo)*: Dobra de portfólio/coleções com 5 estilos selecionáveis (`editorial_grid`, `masonry_flow`, `horizontal_lookbook`, `contact_sheet_35mm`, `cinema_widescreen`).
16. **`client_testimonials`** *(Depoimentos de Clientes)*: Layouts interativos (`video_story_bubbles` com reprodutor de vídeo em modal popup, bolhas de depoimento, estrelas de avaliação, `@instagramHandle` e botão com link direto para a galeria do cliente `gallerySlug`).
17. **`instagram_feed_banner`** *(Feed & Perfil Instagram)*: Grid de 6 fotos/reels com insígnia oficial do Instagram, `@handle` do fotógrafo, URL direta do perfil e botão de CTA "Siga no Instagram".
18. **`custom_footer_section`** *(Rodapé Autoral Customizado)*: Rodapé com marca do fotógrafo/estúdio, texto de copyright customizado, localização, botão de rolar ao topo e selos de associações internacionais (Bride Association, Inspiration Photographers, Fearless Photographers, Casamentos.com.br Pro).
19. **`cta_zoom_whatsapp`** *(Universal)*: Encerramento com zoom-out cinematográfico e agendamento direto via WhatsApp.

---

## 6. Padrões de Responsividade Mobile & Tablet (Consolidação de `mobile.md`)

1. **Anti-Overflow Tipográfico Rigoroso**:
   - Todos os títulos H1 e H2 utilizam escala fluida (`text-2xl sm:text-4xl md:text-6xl lg:text-7xl`) combinados com `break-words` e `max-w-full px-2`, eliminando qualquer vazamento de texto em telas de 375px a 420px.
   - Títulos de portas bipartidas e kinetic marquees adaptam-se para evitar corte de palavras.

2. **Alvos de Toque e Ergonomia**:
   - Botões e seletores possuem altura mínima de `44px` no mobile.
   - Modais de vídeo e galerias expandem-se de forma centrada com fechamento por toque no backdrop ou ícone `X` destacado.

3. **Obturador Mecânico Adaptativo**:
   - O obturador fotográfico de 8 lâminas (`shutter`) e o portal íris (`circle`) ajustam o raio do barril de lente de acordo com o viewport (`w-[82vw]` em mobile vs `sm:w-[68vh]` em desktop), garantindo que as marcações de abertura f/stop fiquem sempre visíveis e alinhadas.

---

## 7. Arquitetura do Editor: Centralização no Menu Esquerdo e Cascatas da Dobra 01 (Hero)

1. **Centralização Única no Menu Mais à Esquerda**:
   - A lista de dobras ativas do site reside **exclusivamente no menu lateral esquerdo**, numeradas sequencialmente (`01.`, `02.`, `03.`...).
   - Cada dobra conta com: número de ordenação, tag do tema de origem, alternador de visibilidade (olho), setas de subida/descida para reordenação, botão de exclusão e seletor rápido no topo para inserir novas dobras da biblioteca.
   - O painel duplicado que existia na gaveta intermediária foi removido, eliminando redundância visual e confusão cognitiva.

2. **Organização em Cascatas da Dobra 01 (Hero)**:
   Ao clicar na Dobra 01 (Hero), todas as configurações pertinentes à primeira dobra são exibidas na gaveta intermediária organizadas em **5 Cascatas Acordeão**:
   - **Cascata 1: 🧭 Menu de Navegação & Identidade (Navbar)**:
     - Logo do Fotógrafo / Marca (preview, upload direto PNG/WEBP/SVG, URL manual, remoção).
     - Seletor de estilo da Navbar (`floating_pill`, `minimal_top`, `centered_logo`, `dark_editorial`, `modern_split`).
     - Transparência do cabeçalho (`glass` Vidro Fumê com Blur, `transparent` 100% sobreposto, `solid` Fundo Escuro Sólido).
     - Rótulo do botão CTA do menu (ex: "ORÇAMENTO", "AGENDAR").
   - **Cascata 2: ✍️ Textos & Tipografia da Hero**:
     - Kicker superior (pré-título / chapéu).
     - Título principal da hero com seletor de escala (`lg`: 48px, `xl`: 64px, `2xl`: 80px, `3xl`: 96px, `cinema`: 112px).
     - Subtítulo / narrativa de impacto com seletor de tamanho (`sm`, `base`, `lg`).
     - Famílias tipográficas de título e corpo.
   - **Cascata 3: 🎨 Cores, Transparências & Efeitos Visuais**:
     - Seletor de cores da hero (fundo, texto, cor destaque / accent).
     - Opacidade da máscara escura / overlay (0% pura até 85% cinema).
     - Efeitos visuais de fundo (`none`, `parallax`, `ken_burns`, `particles`, `film_grain`, `vignette`).
   - **Cascata 4: 🎬 Imagens, Vídeos & Formato da Dobra**:
     - Imagem principal com upload + slider de enquadramento vertical (Y-offset 0% a 100%).
     - Vídeo teaser cinematográfico opcional (MP4/WebM).
     - Segunda imagem para cortina bipartida / contraste.
     - Formato do mecanismo óptico (Obturador de 8 Lâminas vs Círculo Íris).
   - **Cascata 5: 🔘 Botões de Ação da Hero (CTAs)**:
     - Botão principal: ativação, texto e destino (WhatsApp, âncora `#portfolio`, âncora `#contato`, link externo).
     - Botão secundário opcional: ativação, texto e link.

3. **Cascatas para as Demais Dobras (Dobra 02, 03, 04...)**:
   - 1. Textos & Títulos desta Dobra
   - 2. Tipografia & Cores desta Dobra
   - 3. Opções Exclusivas deste Tipo de Dobra (vitrine de galeria, depoimentos em vídeo, feed instagram, rodapé)
   - 4. Mídias, Vídeos & Cards desta Dobra (upload e legendas de cards individuais).

---

## 8. Categorização dos 19 Efeitos de Scrollytelling & Calibração Fina na Hero (Dobra 01)

1. **4 Categorias Estruturadas de Efeitos Scrollytelling (`SCROLLY_CATEGORIES`)**:
   - **I. Aberturas & Portais Hero (`portais` - 6 Efeitos)**:
     - `koreo_split_curtain` (Cortina Bipartida + Marquee Cinético)
     - `circle_iris_portal` (Obturador de Câmera / Portal Íris)
     - `hero_curtain_reveal` (Abertura Cortina Mask Reveal)
     - `hero_3d_perspective` (Hero Perspectiva 3D + Texto Gigante)
     - `darkroom_color_develop` (Revelação Câmara Escura 35mm)
     - `bento_zoom_mosaic` (Mosaico Bento Grid Zoom-Out)
   - **II. Narrativas & Álbuns Fixos (`narrativas` - 5 Efeitos)**:
     - `card_stacking_album`, `sticky_story_split`, `layered_pinning_chapters`, `manifesto_word_reveal`, `vogue_overlapping_spread`
   - **III. Vitrines & Movimento (`vitrines` - 4 Efeitos)**:
     - `interactive_gallery_showcase`, `horizontal_filmstrip`, `floating_masonry_3col`, `before_after_grading`
   - **IV. Prova Social & Encerramentos (`conversao` - 4 Efeitos)**:
     - `client_testimonials`, `instagram_feed_banner`, `custom_footer_section`, `cta_zoom_whatsapp`

2. **Aplicação de Qualquer Efeito Diretamente na Hero (Cascata 0)**:
   - Na Dobra 01 (Hero), a **Cascata 0 (`0. Efeito de Scrollytelling da Hero & Detalhes Finos`)** permite alternar entre as 4 categorias e aplicar **qualquer um dos 19 efeitos** diretamente na primeira dobra preservando títulos, fotos e cores.
   - Na aba **Temas Visuais**, o **Catálogo Categorizado de Efeitos Scrollytelling** oferece dois botões rápidos para cada efeito: **"Usar na Hero (1ª Dobra)"** e **"+ Nova Dobra"**.

3. **Edição de Cada Detalhe Fino por Efeito**:
   - **Cortina Bipartida (`koreo_split_curtain`)**: Velocidade das portas (`slow`, `normal`, `fast`), opacidade do marquee cinético (`0-100%`), texto personalizado do marquee superior e inferior.
   - **Obturador / Portal Íris (`circle_iris_portal`)**: Mecanismo óptico (`shutter` vs `circle`), número de lâminas (`6`, `8` ou `12` lâminas), abertura inicial (`closed`, `f/8`, `f/5.6`, `f/2.8`, `f/1.4`) e exibição do anel f-stop.
   - **Cortina Mask Reveal (`hero_curtain_reveal`)**: Largura inicial da moldura (`32%`, `44%`, `60%`, `75%`), formato das bordas (`pill`, `curved`, `sharp`) e texto do selo guia de rolagem.
   - **Perspectiva 3D (`hero_3d_perspective`)**: Ângulo de inclinação inicial 3D (`12°`, `22°`, `35°`), profundidade óptica (`700px`, `1100px`, `1600px`) e palavra monumental de fundo.
   - **Câmara Escura 35mm (`darkroom_color_develop`)**: Banho químico inicial (`red_safelight`, `amber_vintage`, `cyanotype`, `monochrome_cold`) e selo do laboratório.
   - **Mosaico Bento Zoom-Out (`bento_zoom_mosaic`)**: Fator de zoom inicial (`2.2x`, `3.15x`, `4.0x`) e espaçamento do grid (`gap-2`, `gap-4`, `gap-6`).

