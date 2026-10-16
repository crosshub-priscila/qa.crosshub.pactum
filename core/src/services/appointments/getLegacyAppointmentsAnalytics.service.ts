import { specPactumJs } from "../../constants"
import { apiName } from "../../data/api.data"
import type { IParamsDefault } from "../../interface/global.interface"

/**
 * Indicadores legados na agenda — **rota citada pela estratégia, ausente do
 * contrato** desde a migração para `/dashboard/analytics/*` (ADR-002).
 *
 * Existe para o caso `AG-30` provar `404`. Escrito à mão; o gerador não produz
 * porque a rota não está no `openapi.json`.
 * @param paramsDefault - Parâmetros padrão da requisição
 * @rotaAusente GET /dashboard/appointments/analytics
 * @returns Resposta da rota inexistente, esperada como 404
 */
export default async function getLegacyAppointmentsAnalytics(
	paramsDefault: IParamsDefault,
) {
	return await specPactumJs()
		.get(
			`${process.env.BASE_URL}${apiName.dashboardAppointments}/analytics`,
		)
		.withBearerToken(`${paramsDefault.token}`)
		.expectStatus(
			paramsDefault.statusCode,
			`O status code da requisição GET /dashboard/appointments/analytics não é o esperado.`,
		)
		.retry({
			count: paramsDefault.retry.count,
			delay: paramsDefault.retry.delay,
			strategy: ({ res }) => res.statusCode === paramsDefault.statusCode,
		})
}
