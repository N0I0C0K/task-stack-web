import { action, observable } from 'mobx'
import { TaskInter } from '../Interface'
import { delTask, getTaskList, runTask, stopTask } from 'utils/datafetch'

export const taskStore = observable<{
	tasks: TaskInter[]
	refresh: () => void
	delete: (task_id: string) => void
	stop: (task_id: string) => void
	run: (task_id: string) => void
}>({
	tasks: [],
	refresh() {
		getTaskList().then((data) => {
			this.tasks = data
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

taskStore.refresh()
