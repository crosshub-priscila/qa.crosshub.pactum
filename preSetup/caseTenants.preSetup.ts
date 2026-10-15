import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { provisionTenant } from "@core/utils/testFixtures.utils"
import {
	caseTenantPassword,
	caseTenantSlug,
	caseTenantsFile,
	tenantAllocation,
} from "@shared-data/tenants.data"

/** Tenant reservado a um caso. */
interface IPooledTenant {
	tenantId: string
	slug: string
	adminEmail: string
	adminPassword: string
}

/**
 * Garante um tenant por caso que escreve estado global do tenant.
 *
 * Idempotente. Rodar com `npm run pre-setup`.
 */
describe("preSetup", () => {
	it("Garante os tenants dos casos de estado global", async function () {
		this.timeout(300000)

		const pool: Record<string, IPooledTenant> = {}

		for (const [caseId, purpose] of Object.entries(tenantAllocation)) {
			const slug = caseTenantSlug(caseId)
			const adminEmail = `qa-${caseId.toLowerCase()}@example.com`

			const result = await provisionTenant({
				name: `[${caseId}] ${purpose}`,
				slug,
				adminEmail,
				adminPassword: caseTenantPassword,
			})

			pool[caseId] = {
				tenantId: result.tenantId,
				slug,
				adminEmail,
				adminPassword: caseTenantPassword,
			}
		}

		writeFileSync(
			resolve(process.cwd(), caseTenantsFile),
			`${JSON.stringify(pool, null, 2)}\n`,
		)
	})
})
