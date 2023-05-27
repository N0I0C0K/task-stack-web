export interface HttpBase {
	code: number
}
export interface TaskInter {
	id: string
	name: string
	command: string
	active: boolean
	create_time: number
	last_exec_time: number
	crontab_exp?: string
	running?: boolean
}

export interface CreateTaskInter {
	name: string
	command: string
	crontab_exp?: string
	invoke_once?: boolean
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

export interface AllSessionInter {
	sessions: SessionInter[]
	all_nums: number
}

export interface SystemInfoProps {
	cpu_usage_percent: number
	memory_usage_percent: number
	memory_usage: number
	memory_total: number
	network_send_speed: number
	network_recv_speed: number
}
