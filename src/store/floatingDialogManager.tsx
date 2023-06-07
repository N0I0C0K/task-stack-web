import { FloatingDialog, FloatingDialogProps } from 'components/FloatingDialog'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

export const floatingDialogManager = observable<{
	dialogs: FloatingDialogProps[]
	newDialog: (dialog: FloatingDialogProps) => string
	removeDialog: (id: string) => void
}>({
	dialogs: [],
	newDialog: (dialog) => {
		return ''
	},
	removeDialog: (id) => {},
})

export const FloatingDialogProvider: FC = observer(() => {
	return (
		<>
			{floatingDialogManager.dialogs.map((val) => {
				return <FloatingDialog {...val} />
			})}
		</>
	)
})
