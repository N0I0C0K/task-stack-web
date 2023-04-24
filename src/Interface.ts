import { faker } from '@faker-js/faker'

export interface TaskInter {
	id: string
	name: string
	command: string
	active: boolean
	create_time: number
	crontab_exp?: string
	running?: boolean
}

export interface SessionInter {
	id: string
	invoke_time: number
	finish_time: number
	task_id: string
	command: string
	success: boolean
	running: boolean
}

export interface SessionOutputInter {
	output: string
}

export const getSessoionOutput = (count: number = 10): SessionOutputInter => {
	return {
		output: faker.lorem.sentence(count),
	}
}

export const getTaskList = (num: number = 10): TaskInter[] => {
	return Array.from({ length: num }, (it, idx) => {
		return {
			id: faker.random.alphaNumeric(16),
			name: faker.name.jobTitle(),
			command: faker.lorem.sentence(),
			active: faker.datatype.boolean(),
			create_time: faker.date.past().getTime() / 1000,
			crontab_exp: faker.datatype.boolean()
				? faker.date.future().toISOString()
				: undefined,
			running: faker.datatype.boolean(),
		}
	})
}

export const getSessionList = (
	task_id: string,
	num: number = 10
): SessionInter[] => {
	return Array.from({ length: num }, (it, idx) => {
		return {
			id: faker.random.alphaNumeric(16),
			invoke_time: faker.date.past().getTime() / 1000,
			finish_time: faker.date.past().getTime() / 1000,
			task_id: task_id,
			command: 'test fake command',
			success: faker.datatype.boolean(),
			running: faker.datatype.boolean(),
		}
	})
}
