import { assertTs, authBusiness, describeName } from "@core/constants"
import type { IParamsDefault } from "@core/interfaces/global.interface"
import getLegacyAppointmentsAnalytics from "@core/services/appointments/getLegacyAppointmentsAnalytics.service"
import { calendarAG30 } from "@appointments-data/calendar.data"

describe(describeName.dashboard, () => {
	let adminParams: IParamsDefault

	before("Admin autenticado no tenant principal", async () => {
		adminParams = await authBusiness.loginAsTenantAdmin(
			`${process.env.TENANT_SLUG}`,
			`${process.env.TENANT_EMAIL}`,
			`${process.env.TENANT_PASSWORD}`,
			calendarAG30.loginParams,
		)
	})

	it("[AG-30-F] - A rota legada de indicadores na agenda não existe mais e responde 404", async () => {
		const { json } = await getLegacyAppointmentsAnalytics(
			calendarAG30.paramsDefault404(adminParams.token),
		)

		assertTs.equal(
			json.statusCode,
			404,
			"GET /dashboard/appointments/analytics deveria responder 404 — os indicadores vivem em /dashboard/analytics/*.",
		)
	})
})
