import { Box, Input, List, ListItem, Sheet, Typography } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { sessionStore } from 'store/taskstore'
import React from 'react'

export const SessionList: FC = observer(() => {
	React.useEffect(() => {
		sessionStore.load(30)
	}, [])
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
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'auto',
				}}
			>
				<Input placeholder='filter, can filter command | name | time' />
				<Sheet sx={{ overflow: 'auto', flexGrow: 1, mt: 3 }}>
					<List>
						{sessionStore.sessions.map((val) => {
							return (
								<ListItem
									variant='outlined'
									sx={{ my: 0.5, borderRadius: 'sm' }}
								>
									<Box>
										<Typography fontSize={'20px'}>{val.task_id}</Typography>
									</Box>
								</ListItem>
							)
						})}
					</List>
				</Sheet>
			</Sheet>
		</Box>
	)
})
