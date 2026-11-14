# Documento de Segurança e Blindagem do Sistema (Security.md)

Este documento estabelece as diretrizes de segurança, arquitetura de defesa e contramedidas implementadas no **Frame+**, fundamentadas nas melhores práticas do mercado e nos repositórios de referência mundial em segurança ofensiva e defensiva:
- [SecLists](https://github.com/danielmiessler/seclists) (Dicionários de payloads, diretórios, fuzzing e bypass)
- [OWASP Cheat Sheet Series](https://github.com/owasp/cheatsheetseries) (Diretrizes oficiais de engenharia segura)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/payloadsallthethings) (Guia prático de vetores de ataque e remediações)

---

## 1. Mapeamento de Vetores de Ataque e Contramedidas Implementadas

### A. Injeção (SQL Injection, NoSQLi & Command Injection)
* **Riscos (PayloadsAllTheThings / SecLists):** Tentativas de injetar comandos SQL (`' OR 1=1 --`, `UNION SELECT`), operadores NoSQL ou execução de comandos de sistema operacional (`; cat /etc/passwd`, `| curl`).
* **Blindagem no Frame+:**
  - Uso de ORM e consultas parametrizadas em todas as interações de banco de dados e arquivos JSON locais.
  - Validação estrita de tipos de dados em todas as entradas (`req.body`, `req.query`, `req.params`).
  - Nenhuma execução dinâmica de comandos via shell (`child_process` desativado para entradas de usuário).

### B. Cross-Site Scripting (XSS - Reflected, Stored & DOM-based)
* **Riscos (SecLists XSS Vectors):** Injeção de tags `<script>` ou eventos maliciosos (`onerror`, `onload`) em campos de texto, títulos de galerias, nomes de perfis ou formulários de orçamento.
* **Blindagem no Frame+:**
  - Sanitização e escape automático de strings no React (JSX).
  - Sanitização de URLs de avatares e imagens (`sanitizeAvatarUrl`, `encodeURI`).
  - Cabeçalhos HTTP de segurança implementados no Express (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`).

### C. Quebra de Controle de Acesso e IDOR (Insecure Direct Object References)
* **Riscos:** Acesso a recursos de outros usuários alterando IDs de coleções, URLs ou parâmetros de requisição.
* **Blindagem no Frame+:**
  - Validação de propriedade (`ownerId`) em todas as rotas de API de coleções, mídias e sites.
  - Proteção de rotas administrativas e verificação do status de assinatura ativa com dias remanescentes para impedir bypass de clientes inadimplentes.

### D. Ataques de Autenticação, Brute Force e Credential Stuffing
* **Riscos:** Tentativas massivas de login automatizado em rotas de autenticação.
* **Blindagem no Frame+:**
  - Rate limiting inteligente baseado em IP (`LOGIN_WINDOW_MS = 15 minutos`, `MAX_LOGIN_ATTEMPTS = 8`).
  - Bloqueio automático de IP e banimento permanente de dispositivos ao detectar padrões de ataque ou uso de e-mails descartáveis.
  - Isenção estrita e blindada para contas de Administradores Master (`MASTER_ADMIN_EMAILS`), garantindo que administradores nunca sejam bloqueados por engano.

### E. E-mails Descartáveis e Ataques de Botnets (SecLists Disposable Emails)
* **Riscos:** Criação automatizada de milhares de contas falsas com domínios temporários (`maildrop.cc`, `10minutemail.com`, etc.) para esgotar recursos de armazenamento e abusar de períodos de teste (*trial*).
* **Blindagem no Frame+:**
  - Base de dados integrada com mais de 3.700 domínios de e-mails descartáveis.
  - Normalização avançada de e-mails com remoção de *plus-addressing* (`+`) e normalização de pontos em endereços Gmail (`.`), impedindo tentativas de burlar o bloqueio com aliases.
  - Banimento instantâneo de IP e salvamento em `banned_ips.json` na primeira tentativa de registro com e-mail bloqueado.

### F. Server-Side Request Forgery (SSRF) e Path Traversal
* **Riscos:** Inclusão de caminhos maliciosos (`../../etc/passwd`) ou URLs externas em uploads/downloads.
* **Blindagem no Frame+:**
  - Uso de `path.resolve` e `path.basename` seguros para armazenamento de arquivos em disco e no Cloudflare R2.
  - Restrição de origens SSO permitidas para comunicação estrita com o ecossistema oficial FramePro (`crm.framepro.click`).

---

## 2. Padrões de Resposta a Incidentes

1. **Detecção:** Qualquer requisição contendo e-mails descartáveis, asteriscos maliciosos ou payloads suspeitos ativa os middlewares de segurança em `server.ts`.
2. **Ação:** O IP do cliente é registrado em `banned_ips.json` com o motivo e carimbo de data/hora (`bannedAt`).
3. **Bloqueio:** O cliente recebe uma resposta HTTP `403 Forbidden` com a página oficial de acesso bloqueado permanentemente.
4. **Exceção Master Admin:** O sistema garante que administradores master possuem privilégios de auto-recuperação (`/api/auth/unban-self`) e proteção contra falsos positivos.
