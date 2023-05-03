import { formatSeconds } from '../../utils'
import { nanoid } from 'nanoid'
import { SessionInter, SessionOutputInter, TaskInter } from '../../Interface'
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	FormLabel,
	Input,
	LinearProgress,
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
import { toast } from '../../components/Toast'
import { getSessoionOutput, getSessionList } from 'utils/datafetch'
import { showConfirm } from '../../components/GlobalModal'
import { taskStore } from 'store/taskstore'
import { observer } from 'mobx-react-lite'
import { websocketBaseUrl } from 'utils/http'

const SessionListItem: FC<{ session: SessionInter }> = ({ session }) => {
	const [output, setOutput] = useState<SessionOutputInter>()
	useEffect(() => {
		getSessoionOutput(session.id).then((data) => {
			setOutput(data)
		})
	}, [session.id])
	useEffect(() => {
		if (!session.running) return

		const ws = new WebSocket(
			`${websocketBaseUrl}/task/session/communicate?session_id=${session.id}`
		)
		ws.onmessage = (ev) => {
			const tars = String(ev.data)
			if (tars === `task-${session.id} over`) {
				ws.close()
				return
			}
			setOutput((prevOutput) => {
				return {
					output: prevOutput!.output + tars,
					finish: prevOutput!.finish,
					session_id: prevOutput!.session_id,
				}
			})
		}
		ws.onclose = (ev) => {
			ws.close()
		}
		ws.onopen = (ev) => {
			setTimeout(() => {
				ws.send('1')
			}, 1000)
		}

		return () => {
			ws.close()
		}
	}, [session.id, session.running])
	return (
		<Box width={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
			<Typography
				level='h3'
				color={
					session.running ? undefined : session.success ? 'success' : 'danger'
				}
				endDecorator={
					session.running ? (
						<>
							<CircularProgress
								variant='plain'
								size='sm'
								sx={{ maxHeight: '20px' }}
							/>
						</>
					) : null
				}
			>
				{formatSeconds(session.start_time)}
				{' - '}
				{formatSeconds(session.finish_time)}
			</Typography>
			<Stack direction={'row'} gap={2}>
				<Typography level='body3'>{session.id}</Typography>
			</Stack>

			<Stack gap={1}>
				<Typography level='h4'>Output:</Typography>
				<Textarea
					value={output?.output}
					color='success'
					variant='soft'
					maxRows={20}
				/>
			</Stack>
		</Box>
	)
}

const TaskListItem: FC<{ task: TaskInter }> = observer(({ task }) => {
	const [sessions, setSession] = useState<SessionInter[]>([])
	const [curSess, setCurSess] = useState<SessionInter>()
	useEffect(() => {
		getSessionList(task.id).then((data) => {
			data.sort((l, r) => {
				return r.start_time - l.start_time
			})
			setSession(data)
			setCurSess(data[0])
		})
	}, [task.id])
	return (
		<Stack direction={'row'} gap={2} sx={{ height: '100%', width: '100%' }}>
			<Box
				height={'100%'}
				width={'50%'}
				display={'flex'}
				flexDirection={'column'}
			>
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
						<Button
							variant='soft'
							startDecorator={<PlayArrowIcon />}
							onClick={() => {
								taskStore.run(task.id)
							}}
						>
							Run
						</Button>
					) : (
						<Button
							variant='soft'
							startDecorator={<CancelIcon />}
							color='warning'
							onClick={() => {
								taskStore.stop(task.id)
								toast.alert({
									title: 'stop!',
									subtitle: `${task.id}`,
									color: 'success',
								})
							}}
						>
							Stop
						</Button>
					)}
					<Button
						variant='soft'
						startDecorator={<DeleteIcon />}
						color='danger'
						disabled={task.running}
						onClick={() => {
							showConfirm(
								'Confirm Delete',
								`Make sure to delete ${task.name}-${task.id}?`,
								() => {
									taskStore.delete(task.id)
								}
							)
						}}
					>
						Del
					</Button>
				</Stack>
				<Divider sx={{ my: 1, mx: 1 }} />
				<Typography level='h5'>History Sessions</Typography>
				<Sheet
					sx={{
						width: 'auto',
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
										<Typography
											color={
												val.running
													? undefined
													: val.success
													? 'success'
													: 'danger'
											}
										>
											{formatSeconds(val.start_time)}
										</Typography>
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
})

export const TaskList: FC = observer(() => {
	const [curTask, setCurTask] = useState<TaskInter>(taskStore.tasks[0])
	const [filterTxt, setFilterTxt] = useState('')

	return (
		<Box
			p={3}
			width={'100%'}
			height={'100%'}
			display={'flex'}
			flexDirection={'column'}
		>
			<Typography level='h1' sx={{ mb: 2 }}>
				Task List
			</Typography>
			<Sheet
				variant='outlined'
				sx={{
					borderRadius: 'sm',
					width: '100%',
					flexGrow: 1,
					overflow: 'auto',
				}}
			>
				<Stack
					direction={'row'}
					gap={2}
					sx={{ p: 2, width: '100%', height: '100%' }}
				>
					<Sheet
						sx={{
							width: 'auto',
							height: '100%',
							p: 1,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Input
							placeholder='filter'
							value={filterTxt}
							onChange={(ev) => {
								setFilterTxt(ev.target.value)
							}}
						/>
						<Typography textColor={'text.tertiary'} level='body5'>
							find {taskStore.tasks.length} tasks
						</Typography>
						<Sheet
							sx={{
								width: 'auto',
								overflow: 'auto',
								p: 1,
							}}
						>
							<List>
								{taskStore.tasks
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
					</Sheet>
					<Divider orientation='vertical' />
					{curTask !== undefined ? <TaskListItem task={curTask} /> : null}
				</Stack>
			</Sheet>
		</Box>
	)
})
