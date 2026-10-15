import { specPactumJs } from "../../constants"
import { apiName } from "../../data/api.data"
import type { IParamsDefault } from "../../interface/global.interface"
import type { IProvisionTenant } from "../../interface/fixtures/IFixtures.interface"

/** Cabeçalho exigido por `TestFixturesSecretGuard` (antes de existir token de tenant). */
export const TEST_FIXTURES_SECRET_HEADER = "x-test-fixtures-secret"

/**
 * Provisiona organização e administrador principal (somente ambiente de teste)
 * @param payload - Corpo da requisição
 * @param paramsDefault - Parâmetros padrão da requisição
 * @returns Resposta de `POST /dashboard/test-fixtures/tenant`
 */
export default async function postProvisionTenant(
	payload: IProvisionTenant,
	paramsDefault: IParamsDefault,
) {
	const secret = process.env.TEST_FIXTURES_SECRET
	if (!secret) {
		throw new Error(
			"TEST_FIXTURES_SECRET não definida. A rota de provisionamento exige o segredo " +
				"compartilhado com a API (`TEST_FIXTURES_ENABLED=true`).",
		)
	}

	return await (
		specPactumJs()
			.post(`${process.env.BASE_URL}${apiName.dashboard}/test-fixtures/tenant`)
			.withHeaders(TEST_FIXTURES_SECRET_HEADER, secret)
			.withJson(payload)
			.expectStatus(
				paramsDefault.statusCode,
				`O status code da requisição POST /dashboard/test-fixtures/tenant não é o esperado.`,
			)
	)
}
