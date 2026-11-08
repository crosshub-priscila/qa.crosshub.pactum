import moment from "moment-timezone"

/**
 * Fuso do tenant sob teste. A API devolve horários em UTC, mas as regras de
 * disponibilidade são cadastradas no horário local do tenant — sem converter,
 * toda asserção de janela erra por três horas.
 */
export function tenantTimezone(): string {
	return process.env.TENANT_TIMEZONE || "America/Sao_Paulo"
}

/**
 * Data no formato `YYYY-MM-DD`, no fuso do tenant, deslocada em N dias.
 * @param days - Dias a somar a partir de hoje (use um valor positivo para
 * escapar da regra que omite janelas já passadas)
 */
export function dateInDays(days: number): string {
	return moment().tz(tenantTimezone()).add(days, "days").format("YYYY-MM-DD")
}

/**
 * Dia da semana de uma data `YYYY-MM-DD`, de 0 (domingo) a 6 (sábado) —
 * o mesmo intervalo aceito por `AvailabilityRuleDto.weekday`.
 * @param date - Data no formato `YYYY-MM-DD`
 */
export function weekdayOfDate(date: string): number {
	return moment.tz(date, "YYYY-MM-DD", tenantTimezone()).day()
}

/**
 * Hora `HH:mm` de um instante ISO devolvido pela API, no fuso do tenant.
 * @param isoDate - Instante em ISO 8601 (ex.: `startsAt` de uma janela)
 */
export function timeInTenantTimezone(isoDate: string): string {
	return moment(isoDate).tz(tenantTimezone()).format("HH:mm")
}

/**
 * Sequência de datas `YYYY-MM-DD`, no fuso do tenant.
 *
 * Usada por casos que precisam de um dia próprio por repetição — a cota de um
 * agendamento por dia impede repetir o mesmo cliente na mesma data.
 * @param firstOffset - Dias a somar a hoje para a primeira data
 * @param quantity - Quantas datas gerar
 */
export function rangeOfDays(
	firstOffset: number,
	quantity: number,
): Array<string> {
	return Array.from({ length: quantity }, (_unused, index) =>
		dateInDays(firstOffset + index),
	)
}

/** Janela de uma hora localizada a N horas de agora, no fuso do tenant. */
export interface IHourWindow {
	/** Data da janela, `YYYY-MM-DD`. */
	date: string
	/** Dia da semana, de 0 (domingo) a 6 (sábado). */
	weekday: number
	/** Início da janela, `HH:mm` — a hora cheia. */
	startTime: string
	/** Fim da janela, `HH:mm`. */
	endTime: string
}

/**
 * Janela de uma hora que começa na hora cheia mais próxima abaixo de
 * `agora + horas`, no fuso do tenant.
 *
 * As janelas da agenda começam sempre na hora do `startTime` da regra, então
 * casos que dependem de distância até o início (prazo de cancelamento, por
 * exemplo) precisam ancorar a regra numa hora cheia — e saber que o
 * arredondamento **aproxima** o agendamento, nunca afasta.
 * @param hours - Distância desejada, em horas a partir de agora
 */
export function hourWindowFromNow(hours: number): IHourWindow {
	const start = moment().tz(tenantTimezone()).add(hours, "hours").startOf("hour")

	return {
		date: start.format("YYYY-MM-DD"),
		weekday: start.day(),
		startTime: start.format("HH:mm"),
		endTime: start.clone().add(1, "hour").format("HH:mm"),
	}
}

/**
 * Regra de disponibilidade para `API-AG-04`: cobre o "agora" do tenant com
 * janelas passadas (que a API deve omitir) e futuras (que devem permanecer).
 *
 * Perto da meia-noite o dia pode não comportar `futureSlots` de
 * `durationMinutes` — nesse caso devolve `skipReason` para o teste pular com
 * motivo explícito (BUG-49).
 */
export type AvailabilityAroundNow =
	| { startTime: string; endTime: string; skipReason?: undefined }
	| { startTime?: undefined; endTime?: undefined; skipReason: string }

export function availabilityAroundNow(options: {
	durationMinutes: number
	/** Quantas janelas antes de "agora" a regra deve gerar (só no cadastro). */
	pastSlots?: number
	/** Quantas janelas futuras a consulta do dia corrente deve ainda enxergar. */
	futureSlots?: number
	/** Instante de referência; default = agora. Só para teste / prova perto da meia-noite. */
	now?: Date | string
}): AvailabilityAroundNow {
	const duration = options.durationMinutes
	const pastSlots = options.pastSlots ?? 2
	const futureSlots = options.futureSlots ?? 2
	const now = moment(options.now).tz(tenantTimezone())
	const hourFloor = now.clone().startOf("hour")
	const dayEnd = now.clone().endOf("day")
	const lastStart = hourFloor.clone().add(futureSlots * duration, "minutes")

	if (lastStart.isAfter(dayEnd) || lastStart.format("YYYY-MM-DD") !== now.format("YYYY-MM-DD")) {
		return {
			skipReason:
				`AG-04: às ${now.format("HH:mm")} (${tenantTimezone()}) o dia não comporta ` +
				`${futureSlots} janelas futuras de ${duration} min — pulando.`,
		}
	}

	const start = hourFloor.clone().subtract(pastSlots * duration, "minutes")
	const startClamped = start.isBefore(now.clone().startOf("day"))
		? now.clone().startOf("day")
		: start
	const end = lastStart.clone().add(duration, "minutes")
	const endClamped = end.isAfter(dayEnd) ? dayEnd.clone().add(1, "minute").startOf("minute") : end

	return {
		startTime: startClamped.format("HH:mm"),
		endTime: endClamped.format("HH:mm") === "00:00" ? "23:59" : endClamped.format("HH:mm"),
	}
}
