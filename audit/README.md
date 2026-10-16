# audit/ (reservado)

Não há suíte própria nesta pasta. A trilha de auditoria é verificada nos módulos que disparam o evento, via arranjo com `GET /dashboard/audit-logs`:

- `API-C-15` — `people/`
- `API-F-21` — `forms/`
- `API-LGPD-13` — `privacy/`

O cliente HTTP da rota fica em `core/src/services/audit/getList.service.ts` (gerado do contrato). Casos dedicados em `audit/tests/` só entram quando a estratégia exigir (ex. `API-AN-04`, issue #98).
