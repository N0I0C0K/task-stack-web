import {
	Box,
	Button,
	Divider,
	IconButton,
	Sheet,
	Stack,
	Typography,
} from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

import CloseIcon from '@mui/icons-material/Close'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'

import { FC, useState, useRef } from 'react'

// const OutSheetSx: SxProps =

export interface FloatingDialogProps {
	open: boolean
	title: string
	onClose?: () => void
	children?: React.ReactNode
}

export const FloatingDialog: FC<FloatingDialogProps> = ({
	title,
	open,
	onClose,
	children,
}) => {
	const [pos, setPos] = useState<[number, number]>([0, 0])
	const [offsetPos, setOffsetPos] = useState<[number, number]>([0, 0])
	const [isDrag, setIsDrag] = useState(false)
	const [minimize, setMinimize] = useState(false)
	const sheetRef = useRef<HTMLDivElement>(null)
	return (
		<Sheet
			sx={{
				position: 'fixed',
				top: pos[1],
				left: pos[0],
				borderRadius: 'md',
				boxShadow: 'xl',
				zIndex: 1000,
			}}
			variant='outlined'
			onMouseMove={(e) => {
				if (!isDrag) return
				setPos([e.clientX - offsetPos[0], e.clientY - offsetPos[1]])
			}}
			onMouseUp={(e) => {
				setIsDrag(false)
				//setPos([e.clientX, e.clientY])
			}}
			ref={sheetRef}
		>
			<Box
				display={'flex'}
				flexDirection={'row-reverse'}
				p={0.5}
				minWidth={'150px'}
				alignItems={'center'}
				onMouseDown={(e) => {
					console.log('drag start')
					const sPos = sheetRef.current?.getBoundingClientRect()
					if (!sPos) return
					setOffsetPos([e.clientX - sPos.left, e.clientY - sPos.top])
					setIsDrag(true)
				}}
			>
				<IconButton
					variant='plain'
					color='danger'
					size='sm'
					onClick={() => {
						onClose?.()
					}}
				>
					<CloseIcon />
				</IconButton>

				<IconButton
					variant='plain'
					color='info'
					size='sm'
					onClick={() => {
						setMinimize(!minimize)
					}}
				>
					{minimize ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
				</IconButton>
				<Typography sx={{ mr: 'auto', ml: 1 }} level='body1'>
					{title}
				</Typography>
			</Box>
			{!minimize && (
				<>
					<Divider />
					<Box p={2}>{children}</Box>
				</>
			)}
		</Sheet>
	)
}
