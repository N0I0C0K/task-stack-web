import { faker } from '@faker-js/faker'
import {
	TaskInter,
	SessionInter,
	SessionOutputInter,
	AllSessionInter,
	SystemInfoProps,
} from 'Interface'

export const getAFakeTask = (): TaskInter => {
	return {
		id: faker.random.alphaNumeric(16),
		name: faker.name.jobTitle(),
		command: faker.lorem.sentence(),
		active: faker.datatype.boolean(),
		create_time: faker.date.past().getTime() / 1000,
		last_exec_time: faker.date.past().getTime() / 1000,
		crontab_exp: faker.datatype.boolean()
			? faker.date.future().toISOString()
			: undefined,
		running: faker.datatype.boolean(),
	}
}

export const getAFakeSession = (): SessionInter => {
	return {
		id: faker.random.alphaNumeric(16),
		start_time: faker.date.past().getTime() / 1000,
		finish_time: faker.date.past().getTime() / 1000,
		task_id: faker.random.alphaNumeric(16),
		command: 'test fake command',
		success: faker.datatype.boolean(),
		running: faker.datatype.boolean(),
	}
}

export const getTestSessionOutPut = async (
	session_id: string
): Promise<SessionOutputInter> => {
	return {
		session_id: faker.random.alphaNumeric(16),
		output: faker.lorem.paragraphs(faker.datatype.number({ min: 10, max: 70 })),
		finish: faker.datatype.boolean(),
	}
}

export const getTestSessionList = async (
	task_id: string
): Promise<SessionInter[]> => {
	return Array.from({ length: 20 }, (it, idx) => {
		return getAFakeSession()
	})
}

export const getTestAlllSession = (
	start: number,
	num: number
): AllSessionInter => {
	const t = Array.from({ length: num }, (it, idx) => {
		return getAFakeSession()
	})
	return { all_nums: t.length, sessions: t }
}

export const getTestSystemInfo = (): SystemInfoProps => {
	return {
		cpu_usage_percent: faker.datatype.number({ min: 0, max: 100 }),
		memory_usage_percent: faker.datatype.number({ min: 0, max: 100 }),
		memory_usage: faker.datatype.number({ min: 0, max: 100 }),
		memory_total: faker.datatype.number({ min: 0, max: 100 }),
		network_send_speed: faker.datatype.number({ min: 0, max: 2000 }),
		network_recv_speed: faker.datatype.number({ min: 0, max: 200 }),
	}
}
