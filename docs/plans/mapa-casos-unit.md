# Mapa dos casos unitários

Rastreabilidade entre os **46 casos `UNIT-*`** de `.doc/dashboard/estrategia-testes-dashboard.json` (22 deles P0) e os specs de `__tests__/unit/` do repo de desenvolvimento.

Estratégia gerada em 2026-10-16 · mapa gerado por `npm run generate:unit-map` — não editar à mão.

| Convenção | Valor |
|---|---|
| Árvore de testes | `../dev.CrossHub-ci-staging` (argumento de linha de comando) |
| Casamento | ID citado em `describe(...)` — não pelo nome do arquivo |
| Escopo | superfície `dashboard`; `admin/` e `comum/` respondem a outra estratégia |

## AG — Agendamentos (11/11)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-AG-01 | P0 | slots() → extrair generateSlots(regra, duracao, intervalo) · appointments.service.ts:73 | API-AG-01, API-AG-02, API-AG-03 | — | `__tests__/unit/api/dashboard/agendamentos/grade-de-horarios.spec.ts:17` |
| UNIT-AG-02 | P0 | passo do cursor na mesma função · cursor += (duracao + intervalo) | API-AG-02 | — | `__tests__/unit/api/dashboard/agendamentos/grade-de-horarios.spec.ts:41` |
| UNIT-AG-03 | P0 | predicado de bloqueio block.startsAt < slotEnd && block.endsAt > cursor | API-AG-24, API-AG-25 | — | `__tests__/unit/api/dashboard/agendamentos/grade-de-horarios.spec.ts:63` |
| UNIT-AG-04 | P0 | predicado de ocupação — conjunto occupying · appointments.service.ts:10 | API-AG-17, API-AG-18 | — | `__tests__/unit/api/dashboard/agendamentos/estados-e-datas.spec.ts:24` |
| UNIT-AG-05 | P0 | at(date, time) · appointments.service.ts:86 | API-AG-04 · _divergência a decidir_ | — | `__tests__/unit/api/dashboard/agendamentos/estados-e-datas.spec.ts:43` |
| UNIT-AG-06 | P0 | localDate(value) · appointments.service.ts:87 | API-AG-07, API-AG-08 | — | `__tests__/unit/api/dashboard/agendamentos/estados-e-datas.spec.ts:57` |
| UNIT-AG-07 | P0 | dayBoundary(date, timezone, end) · appointments.service.ts:88 | API-AG-04, API-H-03 | — | `__tests__/unit/api/dashboard/agendamentos/estados-e-datas.spec.ts:73`<br>`__tests__/unit/api/dashboard/agendamentos/mensagem-cota-diaria.spec.ts:11` |
| UNIT-AG-08 | P1 | holidays(year) · appointments.service.ts:89 | API-AG-27, API-AG-28 | — | `__tests__/unit/api/dashboard/agendamentos/estados-e-datas.spec.ts:100` |
| UNIT-AG-09 | P0 | saldo de restorePackageCredit() → extrair saldoDevolvivel(entradas) · appointments.service.ts:79 | API-AG-31 | — | `__tests__/unit/api/dashboard/agendamentos/credito-e-cancelamento.spec.ts:10` |
| UNIT-AG-10 | P0 | prazo de cancelamento de cancelByClient() → extrair podeCancelar(inicio, agora, horas) · appointments.service.ts:65 | API-AG-19, API-AG-20 | — | `__tests__/unit/api/dashboard/agendamentos/credito-e-cancelamento.spec.ts:56` |
| UNIT-AG-11 | P1 | buildPackagePayload() · apps/dashboard/lib/package-payload.ts | BUG-37 · _Regressão do valor com milhar no cadastro de pacote._ | — | `__tests__/unit/front/dashboard/agendamentos/package-payload.test.ts:18` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/agendamentos/`

## F — Formulários (6/6)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-F-01 | P0 | hasAnswerValue(type, answer) · forms.service.ts:1143 | API-F-17 | — | `__tests__/unit/api/dashboard/formularios/respostas.spec.ts:34` |
| UNIT-F-02 | P0 | normalizeAnswerRows(question, answer) · forms.service.ts:1153 | API-F-17 | — | `__tests__/unit/api/dashboard/formularios/respostas.spec.ts:74` |
| UNIT-F-03 | P1 | normalizeAnswerRows — ramo CONSENT | API-F-17 · _LGPD_ | — | `__tests__/unit/api/dashboard/formularios/respostas.spec.ts:121` |
| UNIT-F-04 | P2 | estimateMinutes(questionCount) · forms.service.ts:1095 | — | — | `__tests__/unit/api/dashboard/formularios/respostas.spec.ts:157` |
| UNIT-F-05 | P1 | isFormActiveForResponses , isFormClosedForResponses e formStatusPresentation · forms-panel.tsx:228, 232, 317 | API-F-02 | — | `__tests__/unit/front/dashboard/formularios/painel-de-formularios.test.ts:20` |
| UNIT-F-06 | P2 | formatDurationSeconds e renderStarRating · forms-panel.tsx:192, 199 | API-F-23 | — | `__tests__/unit/front/dashboard/formularios/painel-de-formularios.test.ts:55` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/formularios/`

## C — Clientes (6/6)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-C-01 | P1 | generateCode() · people.service.ts:129 | API-C-05 | — | `__tests__/unit/api/dashboard/clientes/codigo-de-acesso.spec.ts:10` |
| UNIT-C-02 | P0 | lookupHash(code) · people.service.ts:150 | API-C-09, API-C-10 | — | `__tests__/unit/api/dashboard/clientes/codigo-de-acesso.spec.ts:29` |
| UNIT-C-03 | P0 | normalização de e-mail de assertEmailAvailable() → extrair normalizeEmail() · people.service.ts:136 | API-C-02 | — | `__tests__/unit/api/dashboard/clientes/codigo-de-acesso.spec.ts:74` |
| UNIT-C-04 | P1 | initials(name) e avatarColor(name) · console-utils.ts:14, 35 | E2E-C-03 | — | `__tests__/unit/front/dashboard/clientes/apresentacao-de-clientes.test.ts:17` |
| UNIT-C-05 | P1 | personCodeStatus , personCodeStatusLabel e personCodeStatusTone · people-panel.tsx:76, 80, 88 | API-C-06, API-C-08 | — | `__tests__/unit/front/dashboard/clientes/apresentacao-de-clientes.test.ts:66` |
| UNIT-C-06 | P2 | formatPersonPublicId e formatMaskedAccessCode · people-panel.tsx:64, 68 | API-C-07 | — | `__tests__/unit/front/dashboard/clientes/apresentacao-de-clientes.test.ts:120` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/clientes/`

## H — Home (5/5)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-H-01 | P0 | localDateKey(date) · dashboard.service.ts:25 | API-H-03 | — | `__tests__/unit/api/dashboard/home/montagem-da-home.spec.ts:31` |
| UNIT-H-02 | P0 | janelas de home() → extrair homeWindows(now) · dashboard.service.ts:45-48 | API-H-01, API-H-02, API-H-09 | — | `__tests__/unit/api/dashboard/home/montagem-da-home.spec.ts:48` |
| UNIT-H-03 | P1 | montagem da lista de ações → extrair a partir de home() | API-H-04, API-H-05 | — | `__tests__/unit/api/dashboard/home/montagem-da-home.spec.ts:101` |
| UNIT-H-04 | P1 | montagem do feed → extrair a partir de home() | API-H-06, API-H-07 | — | `__tests__/unit/api/dashboard/home/montagem-da-home.spec.ts:171` |
| UNIT-H-05 | P1 | formatActivityTime(date) · home-panel.tsx:533 | E2E-H-01 | — | `__tests__/unit/front/dashboard/home/tempo-de-atividade.test.ts:16` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/home/`

## G — Grupos (7/7)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-G-01 | P0 | distributeGroupParticipants(total, groupCount, groupSize) · create-group-wizard.tsx:206 | API-G-09 | — | `__tests__/unit/api/dashboard/grupos/divisao-status-e-formato.spec.ts:21`<br>`__tests__/unit/front/dashboard/grupos/divisao-de-participantes.test.ts:19` |
| UNIT-G-02 | P0 | equivalência entre o wizard e o laço sizes de create() · groups.service.ts:174 | API-G-09, E2E-G-02 | — | `__tests__/unit/front/dashboard/grupos/divisao-de-participantes.test.ts:79` |
| UNIT-G-03 | P0 | validateStatusTransition(current, next, memberCount) · groups.service.ts:27 | API-G-10, API-G-14 | — | `__tests__/unit/api/dashboard/grupos/divisao-status-e-formato.spec.ts:95` |
| UNIT-G-04 | P2 | strategyLabel(input) · groups.service.ts:34 | API-G-08 | — | `__tests__/unit/api/dashboard/grupos/divisao-status-e-formato.spec.ts:145` |
| UNIT-G-05 | P1 | toRecord(group, members) · groups.service.ts:205 | API-G-01 | — | `__tests__/unit/api/dashboard/grupos/divisao-status-e-formato.spec.ts:176` |
| UNIT-G-06 | P1 | allowedStatusTransitions(current) · group-record.ts · groupStatusOptions(current) · dashboard/lib/groups.ts | API-G-14 | — | `__tests__/unit/api/dashboard/grupos/divisao-status-e-formato.spec.ts:61`<br>`__tests__/unit/front/dashboard/grupos/divisao-de-participantes.test.ts:111` |
| UNIT-G-07 | P2 | defaultGroupDescription(input) · groups.service.ts | API-G-01 | — | `__tests__/unit/api/dashboard/grupos/divisao-status-e-formato.spec.ts:69` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/grupos/`

## CAT — Catálogo (3/3)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-CAT-01 | P0 | validateReservationTransition(current, next) · catalog.service.ts:29 | API-CAT-11 | — | `__tests__/unit/api/dashboard/catalogo/transicao-de-reserva.spec.ts:28` |
| UNIT-CAT-02 | P0 | conversão de preço — formatPrice(priceCents) · shop-panel.tsx:991 e o parse do formulário | API-CAT-06 | — | `__tests__/unit/front/dashboard/catalogo/preco-e-reserva.test.ts:15` |
| UNIT-CAT-03 | P2 | formatReservationDate e statusChoice · shop-panel.tsx:995, 964 | E2E-CAT-01 | — | `__tests__/unit/front/dashboard/catalogo/preco-e-reserva.test.ts:64` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/catalogo/`

## MK — Marca e aparência (3/3)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-MK-01 | P0 | validação de cor hexadecimal — branding.controller.ts e o toUpperCase de branding-panel.tsx:624 | API-MK-03 | — | `__tests__/unit/api/dashboard/marca/cor-de-destaque.spec.ts:14`<br>`__tests__/unit/front/dashboard/marca/cor-de-destaque.test.ts:26` |
| UNIT-MK-02 | P1 | publicUrl(key) · r2-storage.service.ts:40 | API-MK-09 | — | `__tests__/unit/api/dashboard/marca/urls-de-ativo.spec.ts:10` |
| UNIT-MK-03 | P1 | withUrls(settings) · branding.service.ts:34 | API-MK-09 | — | `__tests__/unit/api/dashboard/marca/urls-de-ativo.spec.ts:10` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/marca/`

## BN — Banners (3/3)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-BN-01 | P0 | guarda de presignUpload() e upload() · r2-storage.service.ts:20, 29 | API-BN-03, API-MK-07, API-C-13, API-CAT-08 | — | `__tests__/unit/api/dashboard/banners/upload-de-ativo.spec.ts:18` |
| UNIT-BN-02 | P1 | validação do formato do link do banner | API-BN-04 | — | `__tests__/unit/api/dashboard/banners/link-do-banner.spec.ts:22` |
| UNIT-BN-03 | P2 | withUrl(banner) · banners.service.ts:19 | API-BN-01 | — | `__tests__/unit/api/dashboard/banners/upload-de-ativo.spec.ts:64`<br>`__tests__/unit/api/dashboard/marca/urls-de-ativo.spec.ts:10` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/banners/`

## MN — Menu e navegação (2/2)

| Caso | Prio | Alvo | Relação | Extrair | Teste |
|---|---|---|---|---|---|
| UNIT-MN-01 | P1 | tenantAppUrl(webAppUrl) · apps/dashboard/lib/tenant-app-url.ts | E2E-MN-04 | — | `__tests__/unit/front/dashboard/menu/navegacao.test.ts:12` |
| UNIT-MN-02 | P1 | appointmentsTabs() · analyticsTabs() · navigation.ts | API-MN-03 | — | `__tests__/unit/front/dashboard/menu/navegacao.test.ts:47` |

Pasta sugerida: `__tests__/unit/<api|front>/dashboard/menu/`

## Casos sem teste

Nenhum. Todo caso unitário da estratégia tem `describe` no disco.

## IDs em teste sem caso na estratégia

Nenhum. Todo ID declarado em `describe` existe na estratégia.

## Arquivos unitários sem ID de caso

48 de 71 specs do escopo dashboard não citam caso nenhum. São testes legítimos que a estratégia não conhece — pedem um caso, não bloqueiam.

- `__tests__/unit/api/dashboard/agendamentos/block-conflict-list.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/bloqueio-com-conflito.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/conclusao-e-falta-no-horario.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/contato-do-profissional.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/escolha-do-profissional.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/exclusao-de-servico.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/fase-zero.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/motivo-cota-diaria-disponibilidade.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/nome-repetido.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/pessoa-inexistente.spec.ts` (jest)
- `__tests__/unit/api/dashboard/agendamentos/validacao-de-dto.spec.ts` (jest)
- `__tests__/unit/api/dashboard/clientes/validacao-de-pessoa.spec.ts` (jest)
- `__tests__/unit/api/dashboard/formularios/duplicar-formacao-grupos.spec.ts` (jest)
- `__tests__/unit/api/dashboard/formularios/exclusao-com-respostas.spec.ts` (jest)
- `__tests__/unit/api/dashboard/formularios/lista-formacao-grupos.spec.ts` (jest)
- `__tests__/unit/api/dashboard/formularios/nps-escala-1-a-5.bug-29.spec.ts` (jest)
- `__tests__/unit/api/dashboard/formularios/tempo-de-preenchimento.bug-29.spec.ts` (jest)
- `__tests__/unit/api/dashboard/formularios/tipo-formacao-descontinuado.bug-30.spec.ts` (jest)
- `__tests__/unit/api/dashboard/grupos/agrupamento-por-afinidade.spec.ts` (jest)
- `__tests__/unit/api/dashboard/grupos/patch-parcial.spec.ts` (jest)
- `__tests__/unit/api/dashboard/marca/marca-de-fabrica.spec.ts` (jest)
- `__tests__/unit/api/dashboard/marca/url-assinada.spec.ts` (jest)
- `__tests__/unit/front/dashboard/console-url-state.bug-24.test.ts` (vitest)
- `__tests__/unit/front/dashboard/foto-assinada-50-min.bug-42.test.ts` (vitest)
- `__tests__/unit/front/dashboard/refresh-keys-on-focus-change.bug-09.test.ts` (vitest)
- `__tests__/unit/front/dashboard/section-focus-keys.bug-09.test.ts` (vitest)
- `__tests__/unit/front/dashboard/strip-credential-query.bug-47.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/acoes-por-status.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/conflito-com-bloqueio.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/contato-do-profissional.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/cor-do-servico.bug-22.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/grade-cartoes-lado-a-lado.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/grade-do-dia.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/horarios-livres.test.ts` (vitest)
- `__tests__/unit/front/dashboard/agendamentos/preco-digitado.test.ts` (vitest)
- `__tests__/unit/front/dashboard/analytics/periodo.test.ts` (vitest)
- `__tests__/unit/front/dashboard/banners/link-do-banner.test.ts` (vitest)
- `__tests__/unit/front/dashboard/clientes/busca-por-telefone.bug-27.test.ts` (vitest)
- `__tests__/unit/front/dashboard/clientes/ultimo-acesso-bug-17.test.ts` (vitest)
- `__tests__/unit/front/dashboard/console/section-status-notice.test.ts` (vitest)
- `__tests__/unit/front/dashboard/formularios/bug-13-audiencia-visualizacao.test.ts` (vitest)
- `__tests__/unit/front/dashboard/formularios/perguntas-do-formulario.test.ts` (vitest)
- `__tests__/unit/front/dashboard/formularios/publicacao-do-wizard.test.ts` (vitest)
- `__tests__/unit/front/dashboard/formularios/rotulos-de-tipo-de-formulario.bug-30.test.ts` (vitest)
- `__tests__/unit/front/dashboard/grupos/edicao-de-grupo.test.ts` (vitest)
- `__tests__/unit/front/dashboard/grupos/origem-e-lote.bug-25-28.test.ts` (vitest)
- `__tests__/unit/front/dashboard/home/aviso-para-remarcar.test.ts` (vitest)
- `__tests__/unit/front/dashboard/marca/salvar-marca.test.ts` (vitest)

## Selos `extrair` a remover da estratégia

Nenhum.

