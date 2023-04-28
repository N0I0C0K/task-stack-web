import { faker } from '@faker-js/faker'
import { http } from './http'
import {
	SessionOutputInter,
	HttpBase,
	TaskInter,
	SessionInter,
} from 'Interface'
import { nanoid } from 'nanoid'

var useTestData = false

export const setTestData = (test: boolean) => {
	useTestData = test
	localStorage.setItem('useTestData', String(useTestData))
}

setTestData(localStorage.getItem('useTestData') === 'true')

export const isUseTestData = () => {
	return useTestData
}

export const getSessoionOutput = async (
	session_id: string
): Promise<SessionOutputInter> => {
	return useTestData
		? getTestSessionOutPut(session_id)
		: getRealSessionOutput(session_id)
}
const getTestSessionOutPut = async (
	session_id: string
): Promise<SessionOutputInter> => {
	return {
		output: faker.lorem.paragraphs(20),
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
	return useTestData ? getTestTaskList() : getRealTaskList()
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
	return useTestData ? getTestSessionList(task_id) : getRealSessionList(task_id)
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

export const runTask = async (task_id: string): Promise<string> => {
	if (useTestData) return nanoid()
	const res = await http.get<HttpBase & { session_id: string }>('/task/run', {
		params: {
			task_id: task_id,
		},
	})
	return res.data.session_id
}

export const delTask = async (task_id: string): Promise<boolean> => {
	if (useTestData) return true
	const res = await http.delete<HttpBase>('/task/del', { params: { task_id } })
	return res.data.code === 200
}

export const stopTask = async (task_id: string): Promise<boolean> => {
	if (useTestData) return true
	const res = await http.get<HttpBase & { success: boolean }>('/task/stop', {
		params: { task_id },
	})
	return res.data.success
}
