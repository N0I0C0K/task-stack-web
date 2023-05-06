import { Box, Input, List, Sheet, Typography } from '@mui/joy'
import { FC } from 'react'

export const SessionList: FC = () => {
	return (
		<Box
			p={3}
			width={'100%'}
			height={'100%'}
			display={'flex'}
			flexDirection={'column'}
			gap={3}
		>
			<Typography level='h2'>History Session</Typography>
			<Sheet
				variant='outlined'
				sx={{
					borderRadius: 'sm',
					width: '100%',
					flexGrow: 1,
					overflow: 'auto',
					p: 2,
				}}
			>
				<Input placeholder='filter, can filter command | name | time' />
				<List></List>
			</Sheet>
		</Box>
	)
}
