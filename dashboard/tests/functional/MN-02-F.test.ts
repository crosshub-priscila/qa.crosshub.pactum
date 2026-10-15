import { assertTs, describeName } from "@core/constants"
import getSession from "@core/services/dashboard/getSession.service"
import { menuMN02 } from "@dashboard-data/menu.data"

describe(describeName.dashboard, () => {
	it("[MN-02-F] - Token adulterado é recusado com 401", async () => {
		const { json } = await getSession(
			menuMN02.paramsDefault401(menuMN02.tamperedToken),
		)

		assertTs.equal(
			json.statusCode,
			401,
			"Um token adulterado não deveria abrir sessão no Dashboard.",
		)
	})
})
