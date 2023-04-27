import { faker } from '@faker-js/faker'
import { http } from './http'
import {
	SessionOutputInter,
	HttpBase,
	TaskInter,
	SessionInter,
} from 'Interface'

const TestData = true

export const getSessoionOutput = async (
	session_id: string
): Promise<SessionOutputInter> => {
	return TestData
		? getTestSessionOutPut(session_id)
		: getRealSessionOutput(session_id)
}
const getTestSessionOutPut = async (
	session_id: string
): Promise<SessionOutputInter> => {
	return {
		output: faker.lorem.sentence(10),
	}
}
const getRealSessionOutput = async (
	session_id: string
): Promise<SessionOutputInter> => {
	const res = await http.get<HttpBase & SessionOutputInter>(
		'/task/session/get',
		{
			params: { session_id: session_id },
		}
	)
	return res.data
}

export const getTaskList = async (): Promise<TaskInter[]> => {
	return TestData ? getTestTaskList() : getRealTaskList()
}

const getTestTaskList = async (): Promise<TaskInter[]> => {
	return Array.from({ length: 30 }, (it, idx) => {
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

const getRealTaskList = async (): Promise<TaskInter[]> => {
	const res = await http.get<HttpBase & { list: TaskInter[] }>('/task/list')
	return res.data.list
}

export const getSessionList = async (
	task_id: string
): Promise<SessionInter[]> => {
	return TestData ? getTestSessionList(task_id) : getRealSessionList(task_id)
}

const getTestSessionList = async (task_id: string): Promise<SessionInter[]> => {
	return Array.from({ length: 20 }, (it, idx) => {
		return {
			id: faker.random.alphaNumeric(16),
			start_time: faker.date.past().getTime() / 1000,
			finish_time: faker.date.past().getTime() / 1000,
			task_id: task_id,
			command: 'test fake command',
			success: faker.datatype.boolean(),
			running: faker.datatype.boolean(),
		}
	})
}

const getRealSessionList = async (task_id: string): Promise<SessionInter[]> => {
	const res = await http.get<HttpBase & { sessions: SessionInter[] }>(
		'/task/history',
		{ params: { task_id: task_id } }
	)
	return res.data.sessions
}
