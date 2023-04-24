import { useState, useEffect, FC } from 'react'
import {
	Sheet,
	Box,
	Stack,
	Typography,
	Button,
	Input,
	Divider,
	Checkbox,
	FormControl,
	FormLabel,
	Select,
	Option,
	Textarea,
	IconButton,
} from '@mui/joy'
import Table from '@mui/joy/Table'
import {
	SessionInter,
	TaskInter,
	getSessionList,
	getTaskList,
} from '../Interface'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import TaskIcon from '@mui/icons-material/Task'
import { formatSeconds } from '../utils'
import { globalModalStore } from './GlobalModal'
import { getFakeOutput } from '../utils/fake'
import ErrorIcon from '@mui/icons-material/Error'

import CircularProgress from '@mui/joy/CircularProgress'

const TaskDetail: FC<{
	task: TaskInter
	onClose: () => void
}> = ({ task, onClose }) => {
	const [session, setSession] = useState<SessionInter[]>([])
	useEffect(() => {
		setSession(getSessionList(task.id, 100))
	}, [task])
	const [page, setPage] = useState(0)
	const pagenum = 8
	return (
		<Sheet
			variant='outlined'
			sx={{
				p: 3,
				width: '23vw',
				minWidth: '23vw',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<Button
				onClick={() => {
					onClose()
				}}
				startDecorator={<ArrowBackIosIcon />}
				sx={{
					width: '100px',
				}}
				color='info'
			>
				CLOSE
			</Button>
			<Divider />
			<Typography level='h3'>{task.name}</Typography>
			<Typography level='body3'>{task.id}</Typography>
			<Divider />
			<Typography>Command</Typography>
			<Input value={task.command} />
			<Typography>Input</Typography>
			<Input />
			<Divider />
			<Stack direction={'row'} gap={2}>
				<Button startDecorator={<PlayArrowIcon />} color='neutral'>
					Run
				</Button>
				<Button startDecorator={<DeleteIcon />} color='neutral'>
					Del
				</Button>
			</Stack>
			<Divider />
			<Stack direction={'row'} gap={2}>
				<Typography level='h5'>History Session</Typography>
				<IconButton
					variant='plain'
					onClick={() => {
						setPage(Math.max(page - 1, 0))
					}}
				>
					<KeyboardArrowLeft />
				</IconButton>
				<p style={{ alignContent: 'center', lineHeight: '0' }}>
					{page + 1}/{Math.ceil(session.length / pagenum)}
				</p>
				<IconButton
					variant='plain'
					onClick={() => {
						setPage(Math.min(page + 1, Math.floor(session.length / pagenum)))
					}}
				>
					<KeyboardArrowRight />
				</IconButton>
			</Stack>
			{session
				.slice(page * pagenum, Math.min((page + 1) * pagenum, session.length))
				.map((val) => {
					return (
						<Button
							startDecorator={val.success ? <TaskIcon /> : <ErrorIcon />}
							variant='plain'
							color={val.success ? 'success' : 'danger'}
							onClick={() => {
								globalModalStore.open(
									<>
										<Typography level='h3' sx={{ width: '600px' }}>
											{task.name}
										</Typography>
										<Typography level='body1'>{val.command}</Typography>
										<Typography level='body3'>
											{formatSeconds(val.invoke_time)}-
											{formatSeconds(val.finish_time)}
										</Typography>
										<Divider />
										<FormControl>
											<FormLabel>Output:</FormLabel>
											<Textarea
												value={getFakeOutput(100)}
												minRows={5}
												maxRows={10}
												color='success'
											/>
										</FormControl>
									</>,
									() => {}
								)
							}}
						>
							{formatSeconds(val.invoke_time)}
						</Button>
					)
				})}
		</Sheet>
	)
}

export const TaskTable = () => {
	const [selectTask, setSelectTask] = useState<TaskInter | null>(null)
	const [tasks, setTasks] = useState<TaskInter[]>([])
	const [rowNum, setRowNum] = useState(10)
	const [start, setStart] = useState(0)
	const [searchTxt, setSearchTxt] = useState('')
	useEffect(() => {
		setTasks(getTaskList(7))
	}, [])
	return (
		<Sheet
			sx={{
				transition: 'all 2s',
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<Sheet
				sx={{
					px: 4,
					py: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
				}}
			>
				<Typography level='h1'>Tasks</Typography>
				<Stack direction={'row'} gap={2}>
					<Input
						placeholder='search...'
						value={searchTxt}
						onChange={(ev) => {
							setSearchTxt(ev.target.value)
						}}
					/>
					<Button>Search</Button>
					<Button
						color='info'
						onClick={() => {
							globalModalStore.open(
								<>
									<Typography level='h2' sx={{ minWidth: '400px' }}>
										NEW TASK
									</Typography>

									<form
										onSubmit={(event) => {
											console.log(event)
											console.log(event.target)
											event.preventDefault()
										}}
									>
										<FormLabel>task name</FormLabel>
										<Input name='task_name' />
										<FormLabel>command</FormLabel>
										<Input name='command' />
										<FormLabel>invoke when submit</FormLabel>
										<Checkbox />
										<Button type='submit' sx={{ mt: 2 }}>
											create
										</Button>
									</form>
								</>,
								() => {}
							)
						}}
					>
						New
					</Button>
				</Stack>
				<Sheet sx={{ borderRadius: 'sm', boxShadow: 'sm' }} variant='outlined'>
					<Table hoverRow borderAxis='bothBetween' size='lg'>
						<thead>
							<tr>
								<th style={{ width: '40px' }}>#</th>
								<th style={{ maxWidth: '200px' }}>name</th>
								<th>command</th>
								<th style={{ width: '150px' }}>create time</th>
								<th style={{ width: '70px' }}>active</th>
								<th style={{ width: '100px' }}>status</th>
								<th>operation</th>
							</tr>
						</thead>
						<tbody>
							{tasks.slice(start, start + rowNum).map((val, idx) => (
								<tr key={val.id}>
									<td>
										<Typography level='body2'>{start + idx + 1}</Typography>
									</td>

									<td>
										<Typography level='body1'>{val.name}</Typography>
									</td>
									<td>
										<Typography level='body1'>{val.command}</Typography>
									</td>
									<td>
										<Typography level='body3'>
											{formatSeconds(val.create_time)}
										</Typography>
									</td>
									<td>
										<Checkbox checked={val.active} variant='outlined' />
									</td>
									<td>
										{val.running ? (
											<CircularProgress size='sm' variant='plain' />
										) : (
											<Typography level='body2'>unstart</Typography>
										)}
									</td>
									<td>
										<Box>
											<Button
												size='sm'
												variant='outlined'
												onClick={() => {
													setSelectTask(val)
												}}
											>
												Open
											</Button>
											<Button size='sm' variant='outlined' color='danger'>
												Del
											</Button>
											<Button size='sm' variant='outlined' color='info'>
												Run
											</Button>
										</Box>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={7}>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'flex-end',
											alignItems: 'center',
										}}
									>
										<FormControl orientation='horizontal' size='sm'>
											<FormLabel>Rows per page:</FormLabel>
											<Select
												value={rowNum}
												onChange={(ev, val) => {
													setRowNum(val!)
													setStart(0)
												}}
											>
												<Option value={5}>5</Option>
												<Option value={10}>10</Option>
												<Option value={25}>25</Option>
											</Select>
										</FormControl>
										<Typography textAlign='center' sx={{ minWidth: 100 }}>
											{start + 1}-{start + rowNum} of {tasks.length}
										</Typography>
										<Box sx={{ display: 'flex', gap: 1 }}>
											<IconButton
												variant='outlined'
												color='neutral'
												onClick={() => {
													setStart(Math.max(0, start - rowNum))
												}}
											>
												<KeyboardArrowLeft />
											</IconButton>
											<IconButton
												variant='outlined'
												color='neutral'
												onClick={() => {
													setStart(
														Math.min(
															start + rowNum,
															Math.max(0, tasks.length - rowNum)
														)
													)
												}}
											>
												<KeyboardArrowRight />
											</IconButton>
										</Box>
									</Box>
								</td>
							</tr>
						</tfoot>
					</Table>
				</Sheet>
			</Sheet>
			{selectTask === null ? null : (
				<TaskDetail
					task={selectTask}
					onClose={() => {
						setSelectTask(null)
					}}
				/>
			)}
		</Sheet>
	)
}
