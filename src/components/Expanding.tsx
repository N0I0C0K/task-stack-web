import { Box, Divider, Sheet, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

import { FC } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Stack } from '@mui/system'

export const Expanding: FC<{
	open: boolean
	onOpen: () => void
	onClose: () => void
	title: string
	children?: React.ReactNode
	sx?: SxProps
}> = ({ open, onClose, onOpen, title, children, sx }) => {
	return (
		<Box sx={sx}>
			<Sheet
				variant='outlined'
				sx={{
					p: 1.5,

					borderRadius: 'sm',
					userSelect: 'none',
				}}
			>
				<Stack
					direction={'row'}
					sx={{
						cursor: 'pointer',
						mb: 1,
					}}
					onClick={open ? onClose : onOpen}
				>
					<Typography level='body1'>{title}</Typography>
					{open ? (
						<ExpandLessIcon sx={{ ml: 'auto' }} />
					) : (
						<ExpandMoreIcon sx={{ ml: 'auto' }} />
					)}
				</Stack>

				{open && (
					<>
						<Divider sx={{ mb: 1 }} />
						{children}
					</>
				)}
			</Sheet>
		</Box>
	)
}
