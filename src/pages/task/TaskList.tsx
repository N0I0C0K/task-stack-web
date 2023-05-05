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
	IconButton,
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
import { FC, useState, useEffect, useMemo } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CancelIcon from '@mui/icons-material/Cancel'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from '../../components/Toast'
import { getSessoionOutput, getSessionList } from 'utils/datafetch'
import { showConfirm } from '../../components/GlobalModal'
import { selectSession, selectTask, taskStore } from 'store/taskstore'
import { observer } from 'mobx-react-lite'
import { websocketBaseUrl } from 'utils/http'

const SessionListItem: FC = observer(() => {
	const [output, setOutput] = useState<SessionOutputInter>()
	const sessionid = useMemo(() => {
		return selectSession.session?.id
	}, [selectSession.session])
	const session = useMemo(() => {
		return selectSession.session!
	}, [selectSession.session])
	useEffect(() => {
		getSessoionOutput(selectSession.session!.id).then((data) => {
			setOutput(data)
		})
	}, [sessionid])
	useEffect(() => {
		if (!selectSession.session!.running) return

		const ws = new WebSocket(
			`${websocketBaseUrl}/task/session/communicate?session_id=${sessionid}`
		)
		ws.onmessage = (ev) => {
			const tars = String(ev.data)
			if (tars === `task-${sessionid} over`) {
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
	}, [sessionid, session.running])
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
})

const TaskListItem: FC = observer(() => {
	const task = useMemo(() => {
		return selectTask.task!
	}, [])
	return (
		<Stack direction={'row'} gap={2} sx={{ height: '100%', width: '100%' }}>
			<Box
				height={'100%'}
				width={'50%'}
				display={'flex'}
				flexDirection={'column'}
			>
				<Typography level='h3'>{selectTask.task!.name}</Typography>

				<Typography level='body3'>{selectTask.task!.id}</Typography>

				<Typography level='body3'>
					create time: {formatSeconds(selectTask.task!.create_time)}
				</Typography>
				<Typography>{task.crontab_exp}</Typography>
				<FormControl>
					<FormLabel>Command</FormLabel>
					<Textarea
						value={selectTask.task!.command}
						variant='soft'
						color='primary'
					/>
				</FormControl>
				<Divider sx={{ my: 1, mx: 1 }} />
				<Stack direction={'row'} gap={1}>
					{!selectTask.task!.running ? (
						<Button
							variant='soft'
							startDecorator={<PlayArrowIcon />}
							onClick={() => {
								taskStore.run(selectTask.task!.id)
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
								taskStore.stop(selectTask.task!.id)
								toast.alert({
									title: 'stop!',
									subtitle: `${selectTask.task!.id}`,
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
						disabled={selectTask.task!.running}
						onClick={() => {
							showConfirm(
								'Confirm Delete',
								`Make sure to delete ${selectTask.task!.name}-${
									selectTask.task!.id
								}?`,
								() => {
									taskStore.delete(selectTask.task!.id)
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
						{selectTask.sessions?.map((val) => {
							return (
								<ListItem key={nanoid()}>
									<ListItemButton
										selected={selectSession.session?.id === val.id}
										onClick={() => {
											selectSession.setCurSession(val)
										}}
										sx={{
											borderRadius: 'sm',
										}}
										variant={
											selectSession.session?.id === val.id ? 'soft' : 'plain'
										}
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
			{selectSession.session ? (
				<>
					<Divider orientation='vertical' />
					<SessionListItem />
				</>
			) : null}
		</Stack>
	)
})

export const TaskList: FC = observer(() => {
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
										const selected = selectTask.task?.id === val.id
										return (
											<ListItem key={nanoid()}>
												<ListItemButton
													selected={selected}
													onClick={() => {
														selectTask.setCurTask(val)
													}}
													sx={{
														borderRadius: 'sm',
													}}
													variant={selected ? 'soft' : undefined}
													color={selected ? 'neutral' : undefined}
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
					{selectTask.task !== undefined ? <TaskListItem /> : null}
				</Stack>
			</Sheet>
		</Box>
	)
})
