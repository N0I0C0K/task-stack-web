import { formatSeconds } from '../utils'
import { nanoid } from 'nanoid'
import {
	SessionInter,
	SessionOutputInter,
	TaskInter,
	getSessionList,
	getSessoionOutput,
	getTaskList,
} from '../Interface'
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Divider,
	FormControl,
	FormLabel,
	Grid,
	Input,
	List,
	ListItem,
	ListItemButton,
	ListItemDecorator,
	Sheet,
	Stack,
	Textarea,
	Tooltip,
	Typography,
} from '@mui/joy'
import { FC, useState, useEffect } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CancelIcon from '@mui/icons-material/Cancel'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import DeleteIcon from '@mui/icons-material/Delete'

const SessionListItem: FC<{ session: SessionInter }> = ({ session }) => {
	const [output, setOutput] = useState<SessionOutputInter>()
	useEffect(() => {
		setOutput(getSessoionOutput(100))
	}, [session.id])
	return (
		<Box width={'100%'}>
			<Typography level='h3'>
				{formatSeconds(session.invoke_time)}
				{' - '}
				{formatSeconds(session.finish_time)}
			</Typography>
			<Stack direction={'row'} gap={2}>
				<Typography level='body3'>{session.id}</Typography>
			</Stack>
			<Stack gap={1}>
				<Typography level='h4'>Output:</Typography>
				<Textarea value={output?.output} color='success' variant='soft' />
			</Stack>
		</Box>
	)
}

const TaskListItem: FC<{ task: TaskInter }> = ({ task }) => {
	const [sessions, setSession] = useState<SessionInter[]>([])
	const [curSess, setCurSess] = useState<SessionInter>()
	useEffect(() => {
		const t = getSessionList(task.id, 100)
		setSession(t)
		setCurSess(t[0])
	}, [task.id])
	return (
		<Stack direction={'row'} gap={2} sx={{ height: '100%', width: '100%' }}>
			<Box height={'100%'} width={'50%'}>
				<Typography level='h3'>{task.name}</Typography>
				<Stack direction={'row'} gap={2}>
					<Typography level='body3'>
						{formatSeconds(task.create_time)}
					</Typography>
					<Typography level='body3'>{task.id}</Typography>
				</Stack>

				<FormControl>
					<FormLabel>Command</FormLabel>
					<Textarea value={task.command} variant='soft' color='primary' />
				</FormControl>
				<Divider sx={{ my: 1, mx: 1 }} />
				<Stack direction={'row'} gap={1}>
					{!task.running ? (
						<Button variant='soft' startDecorator={<PlayArrowIcon />}>
							Run
						</Button>
					) : (
						<Button
							variant='soft'
							startDecorator={<CancelIcon />}
							color='warning'
						>
							Stop
						</Button>
					)}
					<Button
						variant='soft'
						startDecorator={<DeleteIcon />}
						color='danger'
						disabled={task.running}
					>
						Del
					</Button>
				</Stack>
				<Divider sx={{ my: 1, mx: 1 }} />
				<Typography level='h5'>History Sessions</Typography>
				<Sheet
					sx={{
						width: 'auto',
						height: '60vh',
						overflow: 'auto',
						borderRadius: 'sm',
						p: 1,
					}}
				>
					<List sx={{ mt: 1 }}>
						{sessions.map((val) => {
							return (
								<ListItem key={nanoid()}>
									<ListItemButton
										selected={curSess?.id === val.id}
										onClick={() => {
											setCurSess(val)
										}}
										sx={{
											borderRadius: 'sm',
										}}
										variant={curSess?.id === val.id ? 'soft' : 'plain'}
										color='neutral'
									>
										<ListItemDecorator>
											{val.running ? (
												<CircularProgress
													size='sm'
													thickness={2}
													color='neutral'
												/>
											) : (
												<TaskAltIcon />
											)}
										</ListItemDecorator>
										<Typography>{formatSeconds(val.invoke_time)}</Typography>
									</ListItemButton>
								</ListItem>
							)
						})}
					</List>
				</Sheet>
			</Box>
			{curSess ? (
				<>
					<Divider orientation='vertical' />
					<SessionListItem session={curSess} />
				</>
			) : null}
		</Stack>
	)
}

export const TaskList: FC = () => {
	const [tasks, setTask] = useState<TaskInter[]>([])
	const [curTask, setCurTask] = useState<TaskInter>()
	const [filterTxt, setFilterTxt] = useState('')
	useEffect(() => {
		const t = getTaskList(20)
		setTask(t)
		setCurTask(t[0])
	}, [])
	return (
		<Sheet sx={{ px: 3, py: 3, width: '100%' }}>
			<Typography level='h1' sx={{ mb: 2 }}>
				Task List
			</Typography>
			<Sheet
				variant='outlined'
				sx={{
					borderRadius: 'sm',
					width: '100%',
				}}
			>
				<Stack direction={'row'} gap={2} sx={{ p: 2, width: '100%' }}>
					<Sheet
						sx={{
							width: 'auto',
							height: '80vh',
							overflow: 'auto',
							borderRadius: 'sm',
							p: 1,
						}}
					>
						<Input
							placeholder='filter'
							value={filterTxt}
							onChange={(ev) => {
								setFilterTxt(ev.target.value)
							}}
						/>
						<List>
							{tasks
								.filter((val) => {
									return (
										filterTxt.length === 0 ||
										val.name.includes(filterTxt) ||
										val.command.includes(filterTxt)
									)
								})
								.map((val) => {
									return (
										<ListItem key={nanoid()}>
											<ListItemButton
												selected={curTask?.id === val.id}
												onClick={() => {
													setCurTask(val)
												}}
												sx={{
													borderRadius: 'sm',
												}}
												variant={curTask?.id === val.id ? 'soft' : undefined}
												color={curTask?.id === val.id ? 'neutral' : undefined}
											>
												<ListItemDecorator>
													{val.running ? (
														<CircularProgress
															size='sm'
															thickness={2}
															color='neutral'
														/>
													) : (
														<TaskAltIcon />
													)}
												</ListItemDecorator>
												<Tooltip title={val.command}>
													<Stack>
														<Typography level='body1'>{val.name}</Typography>
														<Typography level='body3'>{val.id}</Typography>
													</Stack>
												</Tooltip>
											</ListItemButton>
										</ListItem>
									)
								})}
						</List>
					</Sheet>
					<Divider orientation='vertical' />
					{curTask !== undefined ? <TaskListItem task={curTask} /> : null}
				</Stack>
			</Sheet>
		</Sheet>
	)
}
