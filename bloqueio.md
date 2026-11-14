# Listas de Domínios de E-Mails Descartáveis (Blocklist Master)

Este arquivo documenta as fontes oficiais e listas globais utilizadas pelo sistema para o bloqueio automático de provedores de e-mail temporários, descartáveis e de uso único (incluindo `maildrop.cc` e seus subdomínios dinâmicos).

## Fontes Oficiais Utilizadas (Links Diretos RAW)

1. **Lista Master Consolidada (+120.000 domínios)**:
   - URL: [https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt](https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt)

2. **Lista Oficial Curada (+4.500 domínios principais sem falsos positivos)**:
   - URL: [https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf](https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf)

3. **Lista Secundária de Alta Frequência (+35.000 domínios)**:
   - URL: [https://raw.githubusercontent.com/FGRibreau/mailchecker/master/list.txt](https://raw.githubusercontent.com/FGRibreau/mailchecker/master/list.txt)

## Políticas de Segurança Aplicadas no Backend

- **Normalização de E-mail (`normalizeEmail`)**:
  - Remove qualquer alias contendo o caractere `+` (ex: `usuario+fp9786@gmail.com` -> `usuario@gmail.com`).
  - Para provedores Google (`gmail.com`, `googlemail.com`), remove todos os pontos `.` na parte local (ex: `m.a.t.a.g.oliveira@gmail.com` -> `matagoliveira@gmail.com`).
- **Bloqueio de Subdomínios Dinâmicos**:
  - Verifica tanto o domínio exato (ex: `maildrop.cc`) quanto qualquer subdomínio (ex: `abc.xyz.maildrop.cc`).
- **Banimento Permanente de IP e Dispositivo**:
  - Qualquer tentativa de cadastro ou acesso com e-mails na blocklist (ou variações de `matagoliveira@gmail.com`) resulta no banimento imediato e permanente do IP e do navegador do atacante.
