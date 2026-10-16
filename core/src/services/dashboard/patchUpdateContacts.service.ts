import { specPactumJs } from "../../constants"
import { apiName } from "../../data/api.data"
import type { IParamsDefault } from "../../interface/global.interface"
import type { IUpdateTenantContacts } from "../../interface/dashboard/IDashboard.interface"

/**
 * Atualiza os contatos da organização
 * @param payload - Corpo da requisição
 * @param paramsDefault - Parâmetros padrão da requisição
 * @returns Resposta de `PATCH /dashboard/settings/contacts`
 */
export default async function patchUpdateContacts(
	payload: IUpdateTenantContacts,
	paramsDefault: IParamsDefault,
) {
	return await (
		specPactumJs()
			.patch(`${process.env.BASE_URL}${apiName.dashboard}/settings/contacts`)
			.withBearerToken(`${paramsDefault.token}`)
			.withJson(payload)
			.expectStatus(
				paramsDefault.statusCode,
				`O status code da requisição PATCH /dashboard/settings/contacts não é o esperado.`,
			)
	)
}
