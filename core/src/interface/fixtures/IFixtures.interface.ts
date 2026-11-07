/**
 * Contratos do domínio `fixtures` gerados de `openapi.json`.
 * Regerar com `npm run generate:api`.
 */
export interface IBackdate {
	entity: "person" | "reservation" | "form_submission" | "appointment"
	id: string
	/** Novo instante de criação (ou de envio, para respostas de formulário). */
	at: string
}

export interface IBackdateResult {
	entity: "person" | "reservation" | "form_submission" | "appointment"
	id: string
	at: string
}

export interface IProvisionTenant {
	name: string
	slug: string
	adminEmail: string
	adminPassword: string
	enabledModules?: Array<
		| "branding"
		| "banners"
		| "people"
		| "access_codes"
		| "appointments"
		| "appointment_packages"
		| "shop"
		| "forms"
		| "groups"
		| "privacy"
	>
}

export interface IProvisionTenantResult {
	tenantId: string
	slug: string
	adminUserId: string
	enabledModules: string[]
	created: boolean
}

/** BUG-30 — tipos que a API de criação não aceita mais; só via fixture. */
export interface ISeedLegacyForm {
	title: string
	type: "TEAM_FORMATION"
	groupingGroupCount?: number
	groupingGroupSize?: number
	groupingStrategy?: "random" | "similar"
}

export interface ISeedLegacyFormResult {
	id: string
	title: string
	type: string
	status: string
}
