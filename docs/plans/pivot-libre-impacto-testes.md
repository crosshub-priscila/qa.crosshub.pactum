# Pivot Libre (ADR-002) — impacto na estratégia e na automação

> **Base de código:** `dev.CrossHub` branch `staging` @ `8257a19` (15/10/2026)  
> **Decisão:** [ADR-002 — produto cliente único](https://github.com/pricaimiTech/dev.CrossHub/blob/staging/docs/spec/ADR-002-produto-cliente-unico.md)  
> **Fonte da estratégia:** `.doc/dashboard/estrategia-testes-dashboard.html` (HTML) → JSON via `npm run generate:strategy`

## O que mudou no produto (resumo para QA)

| Antes (SaaS) | Depois (Libre) |
| --- | --- |
| Super Admin (`apps/admin`, `/admin/*`, `platformAuth`) | **Removido** — sem login de plataforma |
| Planos, add-ons, paywall de Analytics | **Removido** — Analytics sempre disponível |
| `RequiresModuleGuard` / menu por plano | **Removido** — menu fixo; `enabled_modules` só legado no seed |
| Provisionamento via admin | **`POST /dashboard/test-fixtures/tenant`** (QA) ou `db:seed:libre` (ops) |
| App público por slug `{webAppUrl}/{slug}` | **Cliente único:** app na **raiz** do domínio (`tenantAppUrl` = base) |
| Gestão de admins pela plataforma | **Removido** — admin troca só a **própria** senha |

O **banco continua multi-tenant** (RLS, `tenant_id`). A suíte de QA **mantém** segundo tenant, isolamento e fixtures — isso não é “voltar a ser SaaS”, é provar que o RLS ainda segura dados entre organizações na mesma instância.

## Pirâmide (ordem de prioridade)

1. **Unitário** — `UNIT-*` + `*.pure.ts` / `apps/dashboard/lib` (`dev.CrossHub/__tests__/unit/`)
2. **Integração API** — Jest+supertest no monorepo + Pactum funcional neste repo
3. **Componente** — Vitest+RTL+MSW (`__tests__/component/dashboard/` — a criar no monorepo)
4. **E2E** — fatia pequena (~12–15 jornadas P0); Playwright ainda não no monorepo

---

## 1. Testes e casos a **remover** (ou arquivar)

| Item | Onde | Motivo |
| --- | --- | --- |
| Toda automação de **`/admin/*`** | Geradores em `scripts/generate-from-openapi.mjs`, referências em `CLAUDE.md`, `seed-demo-clinica.mjs` | Rotas e Super Admin saíram com ADR-002 |
| **`platformAuth` / `loginAsPlatformAdmin()`** | Estratégia, `build-case-map.mjs`, specs que ainda citarem | Não há `POST /auth/platform/login` no produto |
| Casos **`API-ANL-02`**, **`API-ANL-03`** (403 sem add-on), **`API-ANL-06`** | Estratégia (nunca automatizados após pivot) | Rotas `/dashboard/analytics/interest` e gate por add-on **não existem** no controller atual |
| **`E2E-ANL-01`** (pedido de interesse + admin plataforma) | HTML da estratégia | Fluxo comercial de add-on e console admin eliminados |
| Caso unitário **`UNIT-MN-03`** (`hasModule`, `showsContentGroup`) | Estratégia (linha retirada das tabelas unitárias) | Código removido: menu mostra todas as seções ([`navigation.ts`](../../../dev.CrossHub/apps/dashboard/lib/navigation.ts)) |
| Estratégia **`apps/admin`** | `.doc/admin/` (se existir), `README.md` | Console descontinuado — histórico em `dev.CrossHub/docs/archive/` |
| Pré-requisito “add-on ligado/desligado” | Seção 1.3 do HTML | Paywall de Analytics removido |
| Variação **`API-MN-02`** admin `isActive: false` via plataforma | Estratégia (já anotado) | Sem API para desativar admin |

**Tenants reservados obsoletos no `preSetup`:** remover de `data/tenants.data.ts` → `tenantAllocation` as chaves **`ANL-01`** (texto “com/sem add-on”), **`ANL-02`**, **`ANL-03`**, **`ANL-06`** — manter só **`ANL-03b`** e **`ANL-03c`** (ocupação).

---

## 2. Testes e casos a **alterar**

| Item | De → Para | Motivo |
| --- | --- | --- |
| **`UNIT-MN-01`** | `(webAppUrl, slug)` → `(webAppUrl)` só; sem slug | ADR-002: URL do app = base normalizada |
| **`E2E-MN-04`** | “Ver app” abre `{base}/{slug}` → abre **`{webAppUrl}`**; sem slug no storage | Mesmo motivo |
| **`API-AG-30`** | “gate verificado em ANL-03” → **só** `404` em `GET /dashboard/appointments/analytics` | Rota legada ausente; Analytics em `/dashboard/analytics/*` **sem 403 de entitlement** |
| **`API-ANL-01`** | Sessão sem `addons` + módulos habilitados | Já automatizado; reforça que **`enabledModules`** vem do seed completo, não de plano |
| **`ANL-01-F.test.ts`** | Manter asserção `addons` undefined | Regressão: paywall não pode voltar |
| **`API-AG-33` / AG-33-F** | Pré-condição “Add-on Analytics ativo” | Trocar por “tenant com seed normal” — analytics não depende de vínculo |
| **`E2E-AG-05`** | “indicadores respeitam add-on” → “**Analytics** abre as duas abas” | Sem gate |
| **`E2E-MN-03`** | Limpar `crosshub.tenantSlug` | Avaliar se slug ainda é persistido no dashboard Libre |
| **`generate-from-openapi.mjs`** | Remover mapeamentos `/admin/*` e `/dashboard/analytics/interest` | Evitar gerar clients mortos |
| **`openapi.json` (QA)** | Regenerar a partir de `staging` | Portão de rotas no CI do monorepo |
| Mapas **`mapa-casos-api.md`** | Tirar `platformAuth` da convenção de login | Alinhar ao contrato |

---

## 3. O que **implementar** (backlog pós-pivot)

### Monorepo `dev.CrossHub`

| Prioridade | Entrega |
| --- | --- |
| P0 | **`__tests__/component/dashboard/`** — painéis extraídos (home, privacy, branding, shop) com MSW |
| P0 | **`__tests__/e2e/`** + Playwright — smoke: login tenant, `E2E-MN-01`, `E2E-AG-01` |
| P1 | **`__tests__/unit/front/public/`** — extrair pure de `apps/web` (wizard de agenda) |
| P1 | Estratégia **App/PWA** espelhando SFDPOT em `docs/app/` (ainda sem HTML irmão no QA) |
| P2 | Casos de contrato faltantes citados na seção “Cobertura do contrato” (pagamentos/refunds agenda) |

### Repo `qa.crosshub.pactum`

| Prioridade | Entrega |
| --- | --- |
| P0 | Limpar **`tenantAllocation`** (ANL obsoletos) e rodar `pre-setup` |
| P0 | Atualizar **`openapi.json`** e `npm run generate:api` após limpar admin |
| P1 | **`E2E-*`** só jornadas cross-app (sem admin plataforma) |
| P2 | Documentar **`apps/web`** na estratégia (rotas `/public/**` já cobertas em AG/F/CAT) |

### Casos unitários novos (pós-remoção MN-03)

| ID sugerido | Alvo | Nota |
| --- | --- | --- |
| — | `analyticsTabs()` / `appointmentsTabs()` | Já coberto em `navegacao.test.ts` como **AN-04** — promover a **`UNIT-MN-04`** ou fundir com MN-02 na estratégia |

---

## 4. Comandos de manutenção

```bash
# No QA (após editar o HTML):
npm run generate:strategy    # .json
npm run generate:map         # carimbo + mapa API + mapa unitário

# No monorepo (portão CI):
node qa/scripts/build-unit-map.mjs "$PWD" --exigir
```

---

## 5. Critério de “estratégia alinhada ao staging”

- [ ] HTML sem referência operacional a Super Admin, add-ons ou `platformAuth`
- [ ] JSON regenerado e contagem do painel = soma das tabelas
- [ ] `openapi.json` do QA = `/docs-json` da API em staging
- [ ] Mapa API sem casos `platformAuth` ou rotas `/admin/*`
- [ ] Pactum verde em `localhost` com `TEST_FIXTURES_ENABLED` na API
