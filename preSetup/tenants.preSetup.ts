import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { provisionTenant } from "@core/utils/testFixtures.utils"
import {
	secondTenant,
	secondTenantExtraAdmin,
	secondTenantFile,
} from "@shared-data/tenants.data"

/**
 * Garante o segundo tenant usado pelos casos de isolamento.
 *
 * Idempotente pelo slug. Rodar com `npm run pre-setup`.
 */
describe("preSetup", () => {
	it("Garante o segundo tenant para os casos de isolamento", async function () {
		this.timeout(120000)

		const primary = await provisionTenant({
			name: secondTenant.name,
			slug: secondTenant.slug,
			adminEmail: secondTenant.adminEmail,
			adminPassword: secondTenant.adminPassword,
		})

		// Segundo admin do tenant B: o caso LGPD-01 compara com o primeiro.
		// A fixture só cria usuários via e-mail; flags de Principal ainda são
		// limitação conhecida até existir endpoint de admin secundário.
		const extra = await provisionTenant({
			name: secondTenant.name,
			slug: secondTenant.slug,
			adminEmail: secondTenantExtraAdmin.email,
			adminPassword: secondTenantExtraAdmin.password,
		})

		writeFileSync(
			resolve(process.cwd(), secondTenantFile),
			`${JSON.stringify(
				{
					tenantId: primary.tenantId,
					adminId: primary.adminUserId,
					extraAdminId: extra.adminUserId,
					...secondTenant,
				},
				null,
				2,
			)}\n`,
		)
	})
})
