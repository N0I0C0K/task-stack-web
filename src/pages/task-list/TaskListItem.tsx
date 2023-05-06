import {
	Stack,
	Box,
	Typography,
	FormControl,
	FormLabel,
	Textarea,
	Divider,
	Button,
	Sheet,
	List,
	ListItem,
	ListItemButton,
	ListItemDecorator,
} from '@mui/joy'
import { showConfirm } from 'components/GlobalModal'
import { toast } from 'components/Toast'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { FC, useMemo } from 'react'
import { selectTask, taskStore, selectSession } from 'store/taskstore'
import { formatSeconds } from 'utils'
import { SessionListItem } from './SessionItemInfo'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CancelIcon from '@mui/icons-material/Cancel'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import DeleteIcon from '@mui/icons-material/Delete'
import TaskAltIcon from '@mui/icons-material/TaskAlt'

export const TaskListItem: FC = observer(() => {
	const task = useMemo(() => {
		return selectTask.task!
	}, [])
	return (
		<Stack direction={'row'} gap={2} sx={{ height: '100%', width: '100%' }}>
			<Box
				height={'100%'}
				width={'40%'}
				display={'flex'}
				flexDirection={'column'}
			>
				<Typography level='h3'>{selectTask.task!.name}</Typography>

				<Typography level='body3'>{selectTask.task!.id}</Typography>

				<Typography level='body3'>
					create time: {formatSeconds(selectTask.task!.create_time)}
				</Typography>
				<Typography level='body3'>crontab exp: {task.crontab_exp}</Typography>
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
												<HourglassBottomIcon />
											) : (
												<TaskAltIcon color='success' />
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
