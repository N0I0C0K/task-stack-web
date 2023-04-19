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
import TaskIcon from '@mui/icons-material/Task'
import { formatSeconds } from '../utils'

const TaskDetail: FC<{
	task: TaskInter
	onClose: () => void
}> = ({ task, onClose }) => {
	const [session, setSession] = useState<SessionInter[]>([])
	useEffect(() => {
		setSession(getSessionList(task.id, 100))
	}, [task])
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
			<Typography level='h5'>History Session</Typography>
			{session.map((val) => {
				return (
					<Button startDecorator={<TaskIcon />} variant='plain' color='success'>
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
	useEffect(() => {
		setTasks(getTaskList(30))
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
					<Input placeholder='search...' sx={{}} />
					<Button>Search</Button>
					<Button color='info'>New</Button>
				</Stack>
				<Sheet sx={{ borderRadius: 'sm', boxShadow: 'sm' }} variant='outlined'>
					<Table hoverRow borderAxis='bothBetween' size='lg'>
						<thead>
							<tr>
								<th>id</th>
								<th>name</th>
								<th>command</th>
								<th>create time</th>
								<th>active</th>
								<th>operation</th>
							</tr>
						</thead>
						<tbody>
							{tasks.slice(0, 0 + rowNum).map((val) => (
								<tr key={val.id}>
									<td>{val.id}</td>
									<td>
										<Input value={val.name} variant='plain' />
									</td>
									<td>{val.command}</td>
									<td>{val.create_time}</td>
									<td>
										<Checkbox checked={val.active} variant='outlined' />
									</td>
									<td>
										<Stack direction={'row'} gap={2}>
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
										</Stack>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={6}>
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
												}}
											>
												<Option value={5}>5</Option>
												<Option value={10}>10</Option>
												<Option value={25}>25</Option>
											</Select>
										</FormControl>
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
