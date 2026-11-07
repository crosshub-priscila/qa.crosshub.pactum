import { specPactumJs } from "../../constants"
import { apiName } from "../../data/api.data"
import type { IParamsDefault } from "../../interface/global.interface"
import type { ISeedLegacyForm } from "../../interface/fixtures/IFixtures.interface"

/**
 * Grava formulário de tipo legado (ex.: TEAM_FORMATION) direto no banco.
 * A API normal recusa criar esse tipo (BUG-30). Só com TEST_FIXTURES_ENABLED.
 * @param payload - Corpo da requisição
 * @param paramsDefault - Parâmetros padrão da requisição (Bearer do admin)
 * @returns Resposta de `POST /dashboard/test-fixtures/forms`
 */
export default async function postSeedLegacyForm(
	payload: ISeedLegacyForm,
	paramsDefault: IParamsDefault,
) {
	return await (
		specPactumJs()
			.post(`${process.env.BASE_URL}${apiName.dashboard}/test-fixtures/forms`)
			.withBearerToken(`${paramsDefault.token}`)
			.withJson(payload)
			.expectStatus(
				paramsDefault.statusCode,
				`O status code da requisição POST /dashboard/test-fixtures/forms não é o esperado.`,
			)
	)
}
