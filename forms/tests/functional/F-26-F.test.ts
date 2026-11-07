import {
	assertTs,
	authBusiness,
	describeName,
	formBuilder,
	formsBusiness,
} from "@core/constants"
import type { IParamsDefault } from "@core/interfaces/global.interface"
import type { IForm } from "@core/interface/forms/IForms.interface"
import getListForms from "@core/services/forms/getListForms.service"
import postCreateForm from "@core/services/forms/postCreateForm.service"
import postSeedLegacyForm from "@core/services/fixtures/postSeedLegacyForm.service"
import { formsF26 } from "@forms-data/forms.data"

describe(describeName.dashboard, () => {
	let adminParams: IParamsDefault
	let teamFormationId: string
	let surveyId: string

	before("Formação de grupos legado (fixture) e SURVEY de contraste", async () => {
		adminParams = await authBusiness.loginAsTenantAdmin(
			`${process.env.TENANT_SLUG}`,
			`${process.env.TENANT_EMAIL}`,
			`${process.env.TENANT_PASSWORD}`,
			formsF26.loginParams,
		)

		await formsBusiness.cleanupByPrefix(formsF26.casePrefix, adminParams)

		const created201 = formsF26.paramsDefault201(adminParams.token)
		const team = await postSeedLegacyForm(
			{
				title: formsF26.casePrefix,
				type: "TEAM_FORMATION",
				groupingGroupCount: formsF26.groupingGroupCount,
				groupingGroupSize: formsF26.groupingGroupSize,
				groupingStrategy: formsF26.groupingStrategy,
			},
			created201,
		)
		teamFormationId = team.json.id

		const survey = await postCreateForm(
			formBuilder.withTitle(`${formsF26.casePrefix} pesquisa`).withType("SURVEY").build(),
			created201,
		)
		surveyId = survey.json.id
	})

	it("[F-26-F] - GET /dashboard/forms expõe grouping* configurado em TEAM_FORMATION", async () => {
		const { json } = await getListForms(formsF26.paramsDefault200(adminParams.token))
		const row = json.find((form: IForm) => form.id === teamFormationId)

		assertTs.exists(row, "O formulário TEAM_FORMATION deveria aparecer na listagem.")

		assertTs.equal(
			row!.groupingGroupCount,
			formsF26.groupingGroupCount,
			"A listagem deveria expor groupingGroupCount gravado (BUG-11).",
		)
		assertTs.equal(
			row!.groupingGroupSize,
			formsF26.groupingGroupSize,
			"A listagem deveria expor groupingGroupSize gravado (BUG-11).",
		)
		assertTs.equal(
			row!.groupingStrategy,
			formsF26.groupingStrategy,
			"A listagem deveria expor groupingStrategy gravado (BUG-11).",
		)

		const surveyRow = json.find((form: IForm) => form.id === surveyId)
		assertTs.exists(surveyRow, "O formulário SURVEY deveria aparecer na listagem.")

		assertTs.isNull(
			surveyRow!.groupingGroupCount,
			"Formulário sem composição não deveria herdar default na listagem.",
		)
		assertTs.isNull(surveyRow!.groupingGroupSize, "groupingGroupSize deveria ser null em SURVEY.")
		assertTs.isNull(surveyRow!.groupingStrategy, "groupingStrategy deveria ser null em SURVEY.")
	})
})
