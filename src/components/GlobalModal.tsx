import { FC, ReactElement } from 'react'
import { Box, Button, Divider, Modal, Sheet, Stack, Typography } from '@mui/joy'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import WarningIcon from '@mui/icons-material/Warning'

var setGlobalOpen: React.Dispatch<React.SetStateAction<boolean>> | undefined =
	undefined

var setGlobalModalChild:
	| React.Dispatch<React.SetStateAction<ReactElement>>
	| undefined = undefined

export const GlobalModal: FC = observer(() => {
	return (
		<Modal
			open={globalModalStore.isOpen}
			onClose={() => {
				globalModalStore.close()
			}}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 10,
			}}
		>
			<Sheet
				variant='outlined'
				sx={{
					minWidth: 300,
					borderRadius: 'md',
					p: 3,
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
				}}
			>
				{globalModalStore.children}
			</Sheet>
		</Modal>
	)
})

export const showModal = (element: ReactElement, onClose: () => void) => {
	globalModalStore.open(element, onClose)
}

const globalModalStore = observable<{
	isOpen: boolean
	onClose?: () => void
	children: ReactElement
	open: (child: ReactElement, onClose: () => void) => void
	close: () => void
}>({
	isOpen: false,
	onClose: undefined,
	children: <></>,

	open(child, onClose) {
		this.isOpen = true
		this.children = child
		this.onClose = onClose
	},
	close() {
		this.isOpen = false
		this.onClose?.()
	},
})

export const showModalFC = (
	fcelement: (close: () => void) => ReactElement,
	onClose: () => void
) => {
	globalModalStore.open(
		fcelement(globalModalStore.close.bind(globalModalStore)),
		onClose
	)
}

export const closeModal = () => {
	globalModalStore.close()
}

export const showConfirm = (
	title: string,
	subtitle: string,
	onConfirm: () => void
) => {
	globalModalStore.open(
		<>
			<Typography startDecorator={<WarningIcon />} level='h4' color='warning'>
				{title}
			</Typography>
			<Divider />
			<Typography textColor='text.secondary'>{subtitle}</Typography>
			<Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
				<Button
					variant='plain'
					color='neutral'
					onClick={() => {
						globalModalStore.close()
					}}
				>
					Cancel
				</Button>
				<Button
					variant='solid'
					color='danger'
					onClick={() => {
						onConfirm()
						globalModalStore.close()
					}}
				>
					Confirm
				</Button>
			</Box>
		</>,
		() => {}
	)
}
