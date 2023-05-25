import {
	Box,
	Input,
	List,
	ListItem,
	Sheet,
	Typography,
	Card,
	Checkbox,
	Divider,
} from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { sessionStore } from 'store/taskstore'
import React from 'react'
import { SessionInter } from 'Interface'
import { formatSeconds } from 'utils'

const SessionItem: FC<{
	session: SessionInter
}> = observer(({ session }) => {
	return (
		<Sheet
			variant='soft'
			sx={{
				p: 1.5,
				mr: 1,
				borderRadius: 'sm',
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				gap: 1,
			}}
			color={
				session.running ? undefined : session.success ? 'success' : 'danger'
			}
		>
			<Typography
				level='body1'
				color={
					session.running ? undefined : session.success ? 'success' : 'danger'
				}
			>
				{session.task_id.toUpperCase()}
			</Typography>
			<Typography level='body3'>session id: {session.id}</Typography>
			<Typography level='body3'>command: {session.command}</Typography>
			<Typography
				level='body3'
				sx={{
					ml: 'auto',
				}}
			>
				{formatSeconds(session.start_time)}-{formatSeconds(session.finish_time)}
			</Typography>

			{/* <Typography level='body3'>success: {String(session.success)}</Typography>
			<Typography level='body3'>running: {session.running}</Typography> */}
		</Sheet>
	)
})

export const SessionList: FC = observer(() => {
	React.useEffect(() => {
		sessionStore.load(30)
	}, [])
	const [filter, setFilter] = React.useState('')
	const [filterRunning, setFilterRunning] = React.useState(false)
	const [filterFailed, setFilterFailed] = React.useState(false)

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
					gap: 2,
				}}
			>
				<Input
					placeholder='filter, can filter command | name | time'
					value={filter}
					onChange={(ev) => {
						setFilter(ev.target.value)
					}}
				/>
				<Box display={'flex'} gap={1} alignItems='center'>
					<Checkbox
						label='runing'
						checked={filterRunning}
						onChange={(ev) => {
							setFilterRunning(ev.target.checked)
						}}
					/>
					<Checkbox
						label='failed'
						checked={filterFailed}
						onChange={(ev) => {
							setFilterFailed(ev.target.checked)
						}}
					/>
					<Input type='datetime-local' sx={{ ml: 'auto' }} />
					-
					<Input type='datetime-local' />
				</Box>
				<Divider />
				<Sheet sx={{ overflow: 'auto', flexGrow: 1 }}>
					<List
						sx={{
							'--ListItem-paddingX': '0px',
						}}
					>
						{sessionStore.sessions
							.filter((val) => {
								return filter.length === 0 || val.command.includes(filter)
							})
							.filter((val) => {
								return !filterRunning || val.running
							})
							.filter((val) => {
								return !filterFailed || !val.success
							})
							.map((val) => {
								return (
									<ListItem>
										<SessionItem session={val} />
									</ListItem>
								)
							})}
					</List>
				</Sheet>
				<Typography level='body4'>total : {sessionStore.allNums}</Typography>
			</Sheet>
		</Box>
	)
})
