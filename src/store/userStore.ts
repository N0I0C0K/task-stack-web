import { SystemInfoProps } from 'Interface'
import { action, observable } from 'mobx'

export const userStore = observable<{ systemInfo?: SystemInfoProps }>({
	systemInfo: undefined,
})
