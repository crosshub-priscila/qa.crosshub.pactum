import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { provisionTenant } from "@core/utils/testFixtures.utils"
import { emptyTenant, emptyTenantFile } from "@shared-data/tenants.data"

/**
 * Garante um tenant que **nunca recebe massa** (`H-10`).
 *
 * Idempotente. Rodar com `npm run pre-setup`.
 */
describe("preSetup", () => {
	it("Garante o tenant vazio para o caso da Home sem dados", async function () {
		this.timeout(120000)

		const result = await provisionTenant({
			name: emptyTenant.name,
			slug: emptyTenant.slug,
			adminEmail: emptyTenant.adminEmail,
			adminPassword: emptyTenant.adminPassword,
		})

		writeFileSync(
			resolve(process.cwd(), emptyTenantFile),
			`${JSON.stringify(
				{
					tenantId: result.tenantId,
					adminId: result.adminUserId,
					...emptyTenant,
				},
				null,
				2,
			)}\n`,
		)
	})
})
