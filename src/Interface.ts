export interface HttpBase {
	code: number
}
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
	start_time: number
	finish_time: number
	task_id: string
	command: string
	success: boolean
	running: boolean
}

export interface SessionOutputInter {
	session_id: string
	output: string
	finish: boolean
}
