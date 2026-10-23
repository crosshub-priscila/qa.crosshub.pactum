import { assertTs, authBusiness, describeName } from "@core/constants"
import type { IParamsDefault } from "@core/interfaces/global.interface"
import getSession from "@core/services/dashboard/getSession.service"
import { analyticsANL01 } from "@analytics-data/analytics.data"

describe(describeName.dashboard, () => {
	let adminParams: IParamsDefault

	before("Admin principal do tenant da suíte (seed CI)", async () => {
		adminParams = await authBusiness.loginAsTenantAdmin(
			`${process.env.TENANT_SLUG}`,
			`${process.env.TENANT_EMAIL}`,
			`${process.env.TENANT_PASSWORD}`,
			analyticsANL01.loginParams,
		)
	})

	it("[ANL-01-F] - A sessão lista os módulos da organização e não declara add-on nenhum", async () => {
		const { json } = await getSession(
			analyticsANL01.paramsDefault200(adminParams.token),
		)

		assertTs.isArray(
			json.enabledModules,
			"A sessão não devolveu a lista de módulos habilitados.",
		)

		// O campo saiu com o fim dos add-ons: a asserção existe para que ele não
		// ressuscite junto de um paywall que o produto não tem mais.
		assertTs.isUndefined(
			json.addons,
			"A sessão voltou a declarar `addons`, que saiu com o fim dos add-ons.",
		)
	})
})
