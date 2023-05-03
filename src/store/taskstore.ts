import { action, observable } from 'mobx'
import { SessionInter, TaskInter } from '../Interface'
import {
	delTask,
	getSessionList,
	getTaskList,
	runTask,
	stopTask,
} from 'utils/datafetch'

interface TaskStoreInter {
	tasks: TaskInter[]
	refresh: () => void
	delete: (task_id: string) => void
	stop: (task_id: string) => void
	run: (task_id: string) => void
}

export const taskStore = observable<TaskStoreInter>({
	tasks: [],
	refresh() {
		getTaskList().then((data) => {
			this.tasks = data
			selectTask.setCurTask(this.tasks[0])
		})
	},
	delete(task_id) {
		const idx = this.tasks.findIndex((val) => {
			return val.id === task_id
		})
		if (idx === -1) return

		delTask(task_id).then((res) => {
			if (res) this.tasks.splice(idx, 1)
		})
	},
	stop(task_id) {
		const tar = this.tasks.find((val) => val.id === task_id)
		if (tar !== undefined && tar.running === true) {
			stopTask(task_id).then(
				action((data) => {
					if (data) tar.running = false
				})
			)
		}
	},
	run(task_id) {
		const tar = this.tasks.find((val) => val.id === task_id)
		if (tar !== undefined && tar.running === false) {
			runTask(task_id).then(
				action(() => {
					tar.running = true
				})
			)
		}
	},
})

export const selectTask = observable<{
	task?: TaskInter
	sessions?: SessionInter[]
	setCurTask: (tar: TaskInter) => void
}>({
	task: undefined,
	sessions: undefined,
	setCurTask(tar) {
		this.task = tar
		getSessionList(tar.id).then(
			action((data) => {
				this.sessions = data
			})
		)
	},
})

taskStore.refresh()
