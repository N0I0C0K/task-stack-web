import { action, observable } from 'mobx'
import { CreateTaskInter, SessionInter, TaskInter } from '../Interface'
import {
	createTask,
	delTask,
	getAlllSession,
	getSessionList,
	getTaskList,
	runTask,
	stopTask,
} from 'utils/datafetch'
import { toast } from 'components/Toast'

interface TaskStoreInter {
	tasks: TaskInter[]
	refresh: () => void
	delete: (task_id: string) => void
	stop: (task_id: string) => void
	run: (task_id: string) => void
	create: (form: CreateTaskInter) => Promise<boolean>
}

export const taskStore = observable<TaskStoreInter>({
	tasks: [],
	refresh() {
		getTaskList().then((data) => {
			this.tasks = data.sort((l, r) => r.create_time - l.create_time)
			selectTask.setCurTask(this.tasks[0])
		})
	},
	delete(task_id) {
		const idx = this.tasks.findIndex((val) => {
			return val.id === task_id
		})
		if (idx === -1 || this.tasks[idx].running) return

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
	async create(form) {
		var task: TaskInter
		try {
			task = await createTask(form)
			this.tasks.push(task)
		} catch (error) {
			toast.alert({
				title: 'Create task failed!',
				subtitle: `${(error as Error).message}`,
				color: 'danger',
			})
			return false
		}
		toast.alert({
			title: 'Create task success',
			subtitle: `${task.name} create success!`,
			color: 'success',
		})
		return true
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

export const sessionStore = observable<{
	sessions: SessionInter[]
	loadNums: number
	allNums: number
	load: (nums: number) => void
}>({
	sessions: [],
	allNums: 0,
	loadNums: 0,
	load(nums) {
		getAlllSession(this.loadNums, nums).then(
			action((val) => {
				console.log(val)

				this.allNums = val.all_nums
				this.sessions = val.sessions
			})
		)
	},
})

export const selectTask = observable<{
	task?: TaskInter
	sessions?: SessionInter[]
	setCurTask: (tar: TaskInter) => void
	refresh: () => void
}>({
	task: undefined,
	sessions: undefined,
	setCurTask(tar) {
		if (tar.id === this.task?.id) return
		this.task = tar
		this.refresh()
	},
	refresh() {
		getSessionList(this.task!.id).then(
			action((data) => {
				this.sessions = data
				this.sessions.sort((l, r) => r.start_time - l.start_time)
				selectSession.setCurSession(this.sessions[0])
			})
		)
	},
})

export const selectSession = observable<{
	session?: SessionInter
	setCurSession: (tar: SessionInter) => void
}>({
	session: undefined,
	setCurSession(tar) {
		if (this.session?.id === tar.id) return
		this.session = tar
	},
})

taskStore.refresh()
