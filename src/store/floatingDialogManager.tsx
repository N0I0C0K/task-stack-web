import { FloatingDialog, FloatingDialogProps } from 'components/FloatingDialog'
import { nanoid } from 'nanoid'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Button } from '@mui/joy'

export const floatingDialogManager = observable<{
	dialogs: FloatingDialogProps[]
	newDialog: (dialog: FloatingDialogProps) => string
	removeDialog: (id: string) => void
}>({
	dialogs: [],
	newDialog: (dialog) => {
		const id = nanoid()
		if (dialog.onClose === undefined)
			dialog.onClose = () => floatingDialogManager.removeDialog(id)
		floatingDialogManager.dialogs.push({ ...dialog, id })
		return id
	},
	removeDialog: (id) => {
		floatingDialogManager.dialogs = floatingDialogManager.dialogs.filter(
			(val) => val.id !== id
		)
	},
})

export const FloatingDialogSidebar: FC = observer(() => {
	return (
		<Button
			variant='outlined'
			sx={{
				width: '40px',
			}}
			onClick={() => {}}
		>
			{floatingDialogManager.dialogs.length}
		</Button>
	)
})

export const FloatingDialogProvider: FC = observer(() => {
	return (
		<>
			{floatingDialogManager.dialogs.map((val) => {
				return <FloatingDialog {...val} key={val.id} />
			})}
		</>
	)
})
