import {
	assertTs,
	authBusiness,
	describeName,
	formBuilder,
	formsBusiness,
	groupBuilder,
	groupsBusiness,
	questionsBuilder,
} from "@core/constants"
import type { IParamsDefault } from "@core/interfaces/global.interface"
import getListGroups from "@core/services/groups/getListGroups.service"
import patchUpdateGroup from "@core/services/groups/patchUpdateGroup.service"
import { endUsersFor } from "@core/utils/endUser.utils"
import { groupsG12 } from "@groups-data/groups.data"

describe(describeName.dashboard, () => {
	let adminParams: IParamsDefault
	let groupId: string
	let groupName: string
	let memberPersonId: string
	let otherPersonId: string

	before("Grupo gerado a partir de formulário encerrado", async () => {
		adminParams = await authBusiness.loginAsTenantAdmin(
			`${process.env.TENANT_SLUG}`,
			`${process.env.TENANT_EMAIL}`,
			`${process.env.TENANT_PASSWORD}`,
			groupsG12.loginParams,
		)

		await formsBusiness.cleanupByPrefix(groupsG12.casePrefix, adminParams)

		const [member, other] = endUsersFor(groupsG12.caseId)

		const closed = await formsBusiness.createClosedAnsweredForm(
			formBuilder.withTitle(groupsG12.casePrefix).build(),
			questionsBuilder.reset().withShortText().build(),
			member,
			`${process.env.TENANT_SLUG}`,
			groupsG12.answer,
			1,
			adminParams,
		)

		memberPersonId = closed.personId
		otherPersonId = other.personId

		const grupos = await groupsBusiness.createGroups(
			groupBuilder
				.withName(groupsG12.casePrefix)
				.withForm(closed.formId)
				.build(),
			groupsG12.paramsDefault201(adminParams.token),
		)

		groupId = grupos[0].id
		groupName = grupos[0].name
	})

	it("[G-12-F] - Grupo de formulário recusa incluir outra pessoa (BUG-46)", async () => {
		const rejected = await patchUpdateGroup(
			groupId,
			{
				name: groupName,
				status: "draft",
				personIds: [memberPersonId, otherPersonId],
			},
			groupsG12.paramsDefault400(adminParams.token),
		)

		assertTs.equal(
			rejected.json.message,
			groupsG12.sealedMembersMessage,
			"Incluir outra pessoa deveria ser barrado com a mensagem de composição imutável.",
		)
	})

	it("[G-12b-F] - Mesmo conjunto de integrantes responde 200 e não altera a composição (BUG-01/46)", async () => {
		const { json } = await patchUpdateGroup(
			groupId,
			{ name: groupName, status: "draft", personIds: [memberPersonId] },
			groupsG12.paramsDefault200(adminParams.token),
		)

		assertTs.deepEqual(
			json.participantIds,
			[memberPersonId],
			"Reenviar o mesmo integrante não deveria mudar a composição.",
		)

		const { json: list } = await getListGroups(
			groupsG12.paramsDefault200(adminParams.token),
		)
		const row = (Array.isArray(list) ? list : list.items).find(
			(group: { id: string }) => group.id === groupId,
		)
		assertTs.exists(row, "O grupo deveria continuar na listagem.")
		assertTs.deepEqual(
			row!.participantIds,
			[memberPersonId],
			"A listagem deveria manter o único integrante original.",
		)
	})

	it("[G-12-F] - Grupo de formulário aceita edição dos demais campos", async () => {
		const { json } = await patchUpdateGroup(
			groupId,
			{ name: groupsG12.newName, status: "draft" },
			groupsG12.paramsDefault200(adminParams.token),
		)

		assertTs.equal(
			json.name,
			groupsG12.newName,
			"O nome de um grupo de formulário não pôde ser editado, mas deveria.",
		)
	})
})
