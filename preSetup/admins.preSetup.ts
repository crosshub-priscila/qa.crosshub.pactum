import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { authBusiness, preSetup } from "@core/constants"
import getProfessionals from "@core/services/privacy/getProfessionals.service"
import patchSensitiveDataAccess from "@core/services/privacy/patchSensitiveDataAccess.service"
import { provisionTenant } from "@core/utils/testFixtures.utils"
import {
	adminAllocation,
	adminEmailFor,
	adminPassword,
	adminsFile,
} from "@shared-data/admins.data"

/** Admin de tenant reservado a um caso. */
interface IPooledAdmin {
	adminId: string
	email: string
	password: string
}

/**
 * Garante um admin de tenant por caso de permissão, todos **sem**
 * `canViewSensitiveData`.
 *
 * Idempotente: reprovisiona pelo slug da organização principal e realinha senha
 * e restrição de dado sensível.
 *
 * Rodar com `npm run pre-setup`.
 */
describe("preSetup", () => {
	it("Garante o pool de admins dos casos de permissão", async function () {
		this.timeout(300000)

		const slug = `${process.env.TENANT_SLUG}`
		const tenantName = `${process.env.TENANT_NAME || "Organização da suíte"}`

		let tenantId = ""

		for (const [caseId, purpose] of Object.entries(adminAllocation)) {
			const result = await provisionTenant({
				name: `[${caseId}] ${purpose}`,
				slug,
				adminEmail: adminEmailFor(caseId),
				adminPassword,
			})
			tenantId = result.tenantId
		}

		const tenantParams = await authBusiness.loginAsTenantAdmin(
			slug,
			`${process.env.TENANT_EMAIL}`,
			`${process.env.TENANT_PASSWORD}`,
			preSetup.preSetupParamsDefault(200, 5, 500),
		)
		const tenant200 = preSetup.preSetupParamsDefault200(
			5,
			500,
			tenantParams.token,
		)

		const professionals = await getProfessionals(tenant200)
		const pool: Record<string, IPooledAdmin> = {}

		for (const caseId of Object.keys(adminAllocation)) {
			const email = adminEmailFor(caseId)
			const found = (
				professionals.json as Array<{ id: string; email: string }>
			).filter((admin) => admin.email === email)

			const adminId = found[0]?.id
			if (!adminId) {
				throw new Error(
					`Admin "${email}" do caso ${caseId} não apareceu em GET /dashboard/privacy/professionals após o provisionamento.`,
				)
			}

			await patchSensitiveDataAccess(adminId, { allowed: false }, tenant200)
			pool[caseId] = { adminId, email, password: adminPassword }
		}

		writeFileSync(
			resolve(process.cwd(), adminsFile),
			`${JSON.stringify({ tenantId, admins: pool }, null, 2)}\n`,
		)
	})
})
