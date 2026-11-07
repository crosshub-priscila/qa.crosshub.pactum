import {
	assertTs,
	authBusiness,
	describeName,
	formsBusiness,
} from "@core/constants"
import postDuplicate from "@core/services/forms/postDuplicate.service"
import postSeedLegacyForm from "@core/services/fixtures/postSeedLegacyForm.service"
import type { IParamsDefault } from "@core/interfaces/global.interface"
import { formsF38b } from "@forms-data/forms.data"

/** Mensagem oficial do BUG-30 ao criar/duplicar TEAM_FORMATION. */
const TEAM_FORMATION_DISCONTINUED =
	'O tipo "Formação de grupos" não está mais disponível para novos formulários. Para formar grupos, use o assistente da seção Grupos.'

describe(describeName.dashboard, () => {
	let adminParams: IParamsDefault
	let teamFormationId: string

	before("TEAM_FORMATION legado 3×4 via fixture (BUG-30)", async () => {
		adminParams = await authBusiness.loginAsTenantAdmin(
			`${process.env.TENANT_SLUG}`,
			`${process.env.TENANT_EMAIL}`,
			`${process.env.TENANT_PASSWORD}`,
			formsF38b.loginParams,
		)

		await formsBusiness.cleanupByPrefix(formsF38b.casePrefix, adminParams)

		const team = await postSeedLegacyForm(
			{
				title: formsF38b.casePrefix,
				type: "TEAM_FORMATION",
				groupingGroupCount: formsF38b.groupingGroupCount,
				groupingGroupSize: formsF38b.groupingGroupSize,
				groupingStrategy: formsF38b.groupingStrategy,
			},
			formsF38b.paramsDefault201(adminParams.token),
		)
		teamFormationId = team.json.id
	})

	it("[F-38b-F] - Duplicar TEAM_FORMATION responde 400 (BUG-30)", async () => {
		const duplicated = await postDuplicate(
			teamFormationId,
			formsF38b.paramsDefault400(adminParams.token),
		)

		assertTs.equal(
			duplicated.json.message,
			TEAM_FORMATION_DISCONTINUED,
			"A duplicação de Formação de grupos deveria ser barrada com a mensagem do BUG-30.",
		)
	})
})
