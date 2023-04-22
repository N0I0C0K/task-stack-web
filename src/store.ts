import { observable } from 'mobx'
import { TaskInter } from './Interface'

const taskListStore = observable<{
	tasks: TaskInter[]
}>({
	tasks: [],
})
