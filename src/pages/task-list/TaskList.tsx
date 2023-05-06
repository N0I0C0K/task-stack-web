import { nanoid } from 'nanoid'
import { TaskInter } from '../../Interface'
import {
	Box,
	Button,
	Divider,
	Input,
	List,
	ListItem,
	ListItemButton,
	ListItemDecorator,
	MenuItem,
	Sheet,
	Stack,
	Typography,
} from '@mui/joy'
import { FC, useState } from 'react'

import { TaskListItem } from './TaskListItem'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import { selectTask, taskStore } from 'store/taskstore'
import { observer } from 'mobx-react-lite'
import { ContextMenu } from 'components/ContextMenu'

import DoneIcon from '@mui/icons-material/Done'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import AddIcon from '@mui/icons-material/Add'

export const TaskList: FC = observer(() => {
	const [filterTxt, setFilterTxt] = useState('')
	const [menuOpen, setMenuOpen] = useState(false)
	const [contextTarget, setContextTarget] = useState<TaskInter>()
	const [pos, setPos] = useState([0, 0])

	return (
		<Box
			p={3}
			width={'100%'}
			height={'100%'}
			display={'flex'}
			flexDirection={'column'}
			gap={3}
		>
			<Box display={'flex'}>
				<Typography level='h2'>Task List</Typography>
				<Box flexGrow={1} />
				<Button
					color='neutral'
					variant='outlined'
					startDecorator={<AddIcon />}
					onClick={() => {}}
				>
					Create Task
				</Button>
			</Box>
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
													onContextMenu={(ev) => {
														ev.preventDefault()
														setMenuOpen(true)
														setContextTarget(val)
														setPos([ev.clientX, ev.clientY])
													}}
												>
													<ListItemDecorator>
														{val.running ? (
															<HourglassBottomIcon color='warning' />
														) : (
															<DoneIcon color='success' />
														)}
													</ListItemDecorator>

													<Stack>
														<Typography
															level='body2'
															textColor={'text.primary'}
														>
															{val.name}
														</Typography>
														<Typography level='body3'>
															{val.command.substring(0, 50)}...
														</Typography>
													</Stack>
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
				<ContextMenu
					open={menuOpen}
					left={pos[0]}
					top={pos[1]}
					onClose={() => {
						setMenuOpen(false)
					}}
					menuItems={
						<>
							<Box p={2} maxWidth={200}>
								<Typography level='body1'>{contextTarget?.name}</Typography>
								<Typography level='body3'>{contextTarget?.command}</Typography>
							</Box>

							<Divider />
							{!contextTarget?.running ? (
								<MenuItem
									onClick={() => {
										taskStore.run(contextTarget!.id)
										setMenuOpen(false)
									}}
								>
									<ListItemDecorator>
										<PlayArrowIcon />
									</ListItemDecorator>
									run task
								</MenuItem>
							) : (
								<MenuItem
									color='warning'
									variant='soft'
									onClick={() => {
										taskStore.stop(contextTarget!.id)
										setMenuOpen(false)
									}}
								>
									<ListItemDecorator>
										<CancelIcon />
									</ListItemDecorator>
									stop task
								</MenuItem>
							)}
							<MenuItem
								color='danger'
								variant='soft'
								onClick={() => {
									taskStore.delete(contextTarget!.id)
									setMenuOpen(false)
								}}
							>
								<ListItemDecorator>
									<DeleteIcon />
								</ListItemDecorator>
								delete Task
							</MenuItem>
						</>
					}
				/>
			</Sheet>
		</Box>
	)
})
