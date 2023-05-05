import { toast } from 'components/Toast'
import { action } from 'mobx'
import { selectTask, taskStore } from 'store/taskstore'
import { websocketBaseUrl, getToken } from './http'

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

interface MessageType {
	task_id: string
	session_id: string
}

const taskStartEvent = new Event<MessageType>()
const taskFinishEvent = new Event<MessageType>()

export var connectState = false

var websocket: WebSocket | undefined = undefined

export const initEventListen = () => {
	console.log('init EventListen')
	websocket = new WebSocket(
		`${websocketBaseUrl}/task/listener?token=${getToken()}`
	)

	taskFinishEvent.clear()
	taskStartEvent.clear()
	websocket.onclose = () => {
		connectState = false
	}
	websocket.onopen = () => {
		connectState = true
	}
	websocket.onmessage = (data) => {
		const t = JSON.parse(String(data.data)) as MessageType & {
			event: 'task_start' | 'task_finish'
		}
		switch (t.event) {
			case 'task_finish':
				taskFinishEvent.invoke(t)
				break
			case 'task_start':
				taskStartEvent.invoke(t)
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
	return true
}

export const clearEventListener = () => {
	console.log('clear event listener')
	websocket?.send('disconnect')
	websocket?.close()
	taskFinishEvent.clear()
	taskStartEvent.clear()
	connectState = false
	return true
}
