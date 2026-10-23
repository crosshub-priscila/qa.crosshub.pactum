import { poolPassword } from "@core/env"

/**
 * Admins de tenant reservados a casos de permissão.
 *
 * Cada caso que **altera** `canViewSensitiveData` precisa do seu próprio admin:
 * a permissão é estado global do tenant, e dois casos mexendo no mesmo admin em
 * paralelo derrubariam um ao outro.
 *
 * O admin principal (`TENANT_EMAIL`) nunca entra aqui.
 */
export const adminAllocation: Record<string, string> = {
	"F-19": "Não lê respostas de formulário sensível",
	"F-20": "Não conta respostas sensíveis no agregado",
	"H-08": "Não vê dado sensível na Home",
	"MN-02": "Admin desativado durante a sessão",
	"MN-03": "Menu escondido não substitui a checagem da API",
	"ANL-05": "Não vê e-mail nem telefone na aba Clientes do Analytics",
}

/** Senha usada por todos os admins do pool; vem de `POOL_PASSWORD`. */
export const adminPassword = poolPassword

/**
 * E-mail determinístico do admin de um caso.
 * @param caseId - Chave em `adminAllocation` (ex.: `F-19`)
 */
export function adminEmailFor(caseId: string): string {
	return `qa-admin-${caseId.toLowerCase()}@example.com`
}

/** Arquivo onde o `preSetup` grava o pool de admins; não versionado. */
export const adminsFile = "preSetup/.admins.json"
