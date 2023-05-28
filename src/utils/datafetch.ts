import { http } from './http'
import {
	SessionOutputInter,
	HttpBase,
	TaskInter,
	SessionInter,
	CreateTaskInter,
	AllSessionInter,
	SystemInfoProps,
} from 'Interface'
import { nanoid } from 'nanoid'
import {
	getTestSessionOutPut,
	getAFakeTask,
	getTestSessionList,
	getTestAlllSession,
	getTestSystemInfo,
	getAFakeSession,
} from './fakeDataFetch'

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

const getRealSessionOutput = async (
	session_id: string
): Promise<SessionOutputInter> => {
	const res = await http.get<HttpBase & SessionOutputInter>(
		'/task/session/output',
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
		return getAFakeTask()
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

export const getAlllSession = async (
	start: number,
	num: number
): Promise<AllSessionInter> => {
	return useTestData
		? getTestAlllSession(start, num)
		: getRealAllSessionList(start, num)
}

const getRealAllSessionList = async (
	start: number,
	num: number
): Promise<AllSessionInter> => {
	const res = await http.get<HttpBase & AllSessionInter>('/task/session/all', {
		params: { start, num },
	})
	return res.data
}

export async function getSessionInfo(sessionid: string) {
	return useTestData ? getAFakeSession() : getRealSessionInfo(sessionid)
}

async function getRealSessionInfo(sessionid: string) {
	const res = await http.get<HttpBase & { session: SessionInter }>(
		'/task/session/info',
		{
			params: { session_id: sessionid },
		}
	)
	return res.data.session
}

export const createTask = async (form: CreateTaskInter): Promise<TaskInter> => {
	if (useTestData) {
		return getAFakeTask()
	}
	const res = await http.post<HttpBase & { task: TaskInter }>(
		'/task/create',
		form
	)
	return res.data.task
}

export const getSystemInfo = async (): Promise<SystemInfoProps> => {
	return useTestData ? getTestSystemInfo() : getRealSystemInfo()
}

const getRealSystemInfo = async (): Promise<SystemInfoProps> => {
	const res = await http.get<HttpBase & { data: SystemInfoProps }>(
		'user/system/info'
	)
	return res.data.data
}
