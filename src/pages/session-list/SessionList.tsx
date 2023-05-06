import { Box, Sheet, Typography } from '@mui/joy'
import { FC } from 'react'

export const SessionList: FC = () => {
	return (
		<Box
			p={3}
			width={'100%'}
			height={'100%'}
			display={'flex'}
			flexDirection={'column'}
			gap={2}
		>
			<Typography level='h1'>History Session</Typography>
			<Sheet
				variant='outlined'
				sx={{
					borderRadius: 'sm',
					width: '100%',
					flexGrow: 1,
					overflow: 'auto',
				}}
			></Sheet>
		</Box>
	)
}
