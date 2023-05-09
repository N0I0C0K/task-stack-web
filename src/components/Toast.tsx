import { Box, Alert, Typography, IconButton, Stack } from '@mui/joy'
import { FC } from 'react'
import { ColorPaletteProp } from '@mui/joy/styles'
import WarningIcon from '@mui/icons-material/Warning'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import * as React from 'react'

import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

import { WebSocket } from 'ws'

export const GlobalToast: FC = observer(() => {
	return (
		<Box
			position={'fixed'}
			bottom={20}
			right={20}
			minWidth={'100px'}
			zIndex={10000}
		>
			<Stack gap={1} direction={'column'}>
				{toast.alertItems.map(({ title, subtitle, color, key }) => (
					<Alert
						key={key}
						sx={{ alignItems: 'flex-start' }}
						startDecorator={
							<WarningIcon sx={{ mt: '2px', mx: '4px', fontSize: 'lx2' }} />
						}
						variant='soft'
						color={color}
						endDecorator={
							<IconButton
								variant='soft'
								size='sm'
								color={color}
								onClick={() => {
									toast.pop(key!)
								}}
							>
								<CloseRoundedIcon />
							</IconButton>
						}
					>
						<div>
							<Typography fontWeight='lg' mt={0.25}>
								{title}
							</Typography>
							<Typography fontSize='sm' sx={{ opacity: 0.8 }}>
								{subtitle}
							</Typography>
						</div>
					</Alert>
				))}
			</Stack>
		</Box>
	)
})

export interface AlertItemInter {
	title: string
	subtitle: string
	color: ColorPaletteProp
	key?: string
}

export const toast = observable<{
	alertItems: AlertItemInter[]
	alert: (alertItem: AlertItemInter) => void
	pop: (alertKey: string) => void
}>({
	alertItems: [],
	alert(alertItem) {
		alertItem.key = nanoid()
		this.alertItems.push(alertItem)
		setInterval(() => {
			toast.pop(alertItem.key!)
		}, 5 * 1000)
	},
	pop(alertKey) {
		const idx = this.alertItems.findIndex((val) => val.key === alertKey)
		if (idx !== -1) this.alertItems.splice(idx, 1)
	},
})
