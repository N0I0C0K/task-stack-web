import { toast } from 'components/Toast'
import { action } from 'mobx'
import { selectTask, taskStore } from 'store/taskstore'
import { websocketBaseUrl, getToken } from './http'
import { SystemInfoProps } from 'Interface'
import { userStore } from 'store/userStore'

type Callback<T> = (p: T) => void

class Event<T> {
	private actions: Set<Callback<T>> = new Set()

	invoke(p: T): void {
		for (const func of this.actions) {
			func(p)
		}
	}

	add(func: Callback<T>): void {
		this.actions.add(func)
	}

	remove(func: Callback<T>): void {
		this.actions.delete(func)
	}

	clear(): void {
		this.actions.clear()
	}
}

interface TaskEventType {
	task_id: string
	session_id: string
}

interface MessageType {
	event: 'task_start' | 'task_finish' | 'system_info_update'
	data: TaskEventType | SystemInfoProps
}

const taskStartEvent = new Event<TaskEventType>()
const taskFinishEvent = new Event<TaskEventType>()
const systemInfoUpdateEvent = new Event<SystemInfoProps>()

export var connectState = false

var websocket: WebSocket | undefined = undefined

export const initEventListen = () => {
	console.log('init EventListen')
	websocket = new WebSocket(
		`${websocketBaseUrl}/user/event/listen?token=${getToken()}`
	)

	taskFinishEvent.clear()
	taskStartEvent.clear()
	systemInfoUpdateEvent.clear()

	websocket.onclose = () => {
		connectState = false
	}
	websocket.onopen = () => {
		connectState = true
	}
	websocket.onmessage = (data) => {
		const t = JSON.parse(String(data.data)) as MessageType
		switch (t.event) {
			case 'task_finish':
				taskFinishEvent.invoke(t.data as TaskEventType)
				break
			case 'task_start':
				taskStartEvent.invoke(t.data as TaskEventType)
				break
			case 'system_info_update':
				systemInfoUpdateEvent.invoke(t.data as SystemInfoProps)
				break
		}
	}

	taskFinishEvent.add(
		action((p) => {
			const task = taskStore.tasks.find((val) => val.id === p.task_id)
			if (task === undefined) return
			task.running = false
			toast.alert({
				title: 'Task Finish',
				subtitle: `${task.name} [${task.command}] finsih`,
				color: 'info',
			})

			if (task.id === selectTask.task?.id) {
				selectTask.refresh()
			}
		})
	)

	taskStartEvent.add(
		action((p) => {
			const task = taskStore.tasks.find((val) => val.id === p.task_id)
			if (task === undefined) return
			task.running = true
			toast.alert({
				title: 'Task Start',
				subtitle: `${task.name} [${task.command}] start`,
				color: 'info',
			})

			if (task.id === selectTask.task?.id) {
				selectTask.refresh()
			}
		})
	)

	systemInfoUpdateEvent.add(
		action((p) => {
			userStore.systemInfo = p
		})
	)

	return true
}

export const clearEventListener = () => {
	console.log('clear event listener')
	websocket?.send('disconnect')
	websocket?.close()
	taskFinishEvent.clear()
	taskStartEvent.clear()
	systemInfoUpdateEvent.clear()
	connectState = false
	return true
}
