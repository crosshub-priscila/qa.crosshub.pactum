import { preSetup } from "../constants"
import type { IProvisionTenant } from "../interface/fixtures/IFixtures.interface"
import type { IProvisionTenantResult } from "../interface/fixtures/IFixtures.interface"
import postProvisionTenant from "../services/fixtures/postProvisionTenant.service"

/**
 * Garante uma organização idempotente pelo slug, via `POST /dashboard/test-fixtures/tenant`.
 * Substitui `POST /admin/tenants` + admin, removidos com o Super Admin (ADR-002).
 */
export async function provisionTenant(
	payload: IProvisionTenant,
): Promise<IProvisionTenantResult> {
	const params = preSetup.preSetupParamsDefault(201, 5, 500)
	const response = await postProvisionTenant(payload, params)
	return response.json as IProvisionTenantResult
}
