import {
	appointmentsBusiness,
	assertTs,
	authBusiness,
	availabilityBuilder,
	describeName,
	professionalBuilder,
	serviceBuilder,
	serviceProfessionalLinkBuilder,
} from "@core/constants"
import type { IParamsDefault } from "@core/interfaces/global.interface"
import { availabilityAroundNow, timeInTenantTimezone } from "@core/utils/date.utils"
import { calendarAG04 } from "@appointments-data/calendar.data"

describe(describeName.dashboard, () => {
	describe("[AG-04-F] janelas passadas omitidas no dia corrente", () => {
		let adminParams: IParamsDefault
		let serviceId: string
		let window: { startTime: string; endTime: string }
		let skipReason: string | undefined

		before("Agenda em torno do horário atual do tenant", async function () {
			const around = availabilityAroundNow({
				durationMinutes: calendarAG04.durationMinutes,
				pastSlots: 2,
				futureSlots: 2,
			})
			if (around.skipReason) {
				skipReason = around.skipReason
				console.warn(skipReason)
				return
			}
			window = { startTime: around.startTime!, endTime: around.endTime! }

			adminParams = await authBusiness.loginAsTenantAdmin(
				`${process.env.TENANT_SLUG}`,
				`${process.env.TENANT_EMAIL}`,
				`${process.env.TENANT_PASSWORD}`,
				calendarAG04.loginParams,
			)

			await appointmentsBusiness.cleanupByPrefix(calendarAG04.casePrefix, adminParams)

			const bookable = await appointmentsBusiness.createBookableService(
				serviceBuilder.withName(calendarAG04.casePrefix).build(),
				professionalBuilder.withName(calendarAG04.casePrefix).build(),
				serviceProfessionalLinkBuilder
					.withDurationMinutes(calendarAG04.durationMinutes)
					.withIntervalMinutes(0)
					.withCapacity(calendarAG04.capacity)
					.build(),
				availabilityBuilder
					.reset()
					.withRule(calendarAG04.weekday, window.startTime, window.endTime)
					.build(),
				adminParams,
			)

			serviceId = bookable.serviceId
		})

		it("[AG-04-F] - Janelas que já começaram não aparecem na consulta do dia corrente", async function () {
			if (skipReason) {
				this.skip()
				return
			}

			const slots = await appointmentsBusiness.adminSlots(
				serviceId,
				calendarAG04.date,
				calendarAG04.paramsDefault200(adminParams.token),
			)

			const agora = timeInTenantTimezone(new Date().toISOString())

			const passadas = slots
				.map((slot) => timeInTenantTimezone(slot.startsAt))
				.filter((horario) => horario < agora)

			assertTs.deepEqual(
				passadas,
				[],
				`A agenda de hoje ainda oferece janelas que já começaram (agora são ${agora}; regra ${window.startTime}–${window.endTime}).`,
			)
		})
	})

	it("[AG-04-F] - Perto da meia-noite a montagem da regra pula com motivo explícito", () => {
		const perto = availabilityAroundNow({
			durationMinutes: calendarAG04.durationMinutes,
			pastSlots: 2,
			futureSlots: 2,
			now: "2026-11-07T22:32:00-03:00",
		})
		assertTs.isString(perto.skipReason)
		assertTs.include(perto.skipReason!, "não comporta")

		const cedo = availabilityAroundNow({
			durationMinutes: calendarAG04.durationMinutes,
			pastSlots: 2,
			futureSlots: 2,
			now: "2026-11-07T10:15:00-03:00",
		})
		assertTs.isUndefined(cedo.skipReason)
		assertTs.ok(cedo.startTime! < "10:00", `startTime esperado antes de 10:00, veio ${cedo.startTime}`)
		assertTs.ok(cedo.endTime! > "12:00", `endTime esperado depois de 12:00, veio ${cedo.endTime}`)
	})
})
