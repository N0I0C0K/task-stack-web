import { Box, Typography, Input, Button, Checkbox, Textarea } from '@mui/joy'
import { FC, useState } from 'react'
import { taskStore } from 'store/taskstore'

export const NewTaskModal: FC<{
	onClick: () => void
}> = ({ onClick }) => {
	const [updating, setUpdating] = useState(false)
	const [taskname, setTaskname] = useState('')
	const [command, setcommand] = useState('')
	const [crontab, setcrontab] = useState('')
	const [invoke, setInvoke] = useState(false)
	return (
		<>
			<Box display={'flex'} flexDirection={'column'} gap={1} minWidth={'400px'}>
				<Typography level='h3' sx={{ mb: 2 }}>
					Create Task
				</Typography>
				<form
					style={{
						display: 'flex',

						flexDirection: 'column',
						gap: '10px',
					}}
					onSubmit={(ev) => {
						ev.preventDefault()
						setUpdating(true)
						taskStore
							.create({
								name: taskname,
								command: command,
								crontab_exp: crontab,
								invoke_once: invoke,
							})
							.then((val) => {
								setUpdating(false)
							})
					}}
				>
					<Input
						placeholder='task name'
						value={taskname}
						required
						onChange={(ev) => {
							setTaskname(ev.target.value)
						}}
					/>
					<Textarea
						placeholder='command/executable'
						value={command}
						required
						onChange={(ev) => {
							setcommand(ev.target.value)
						}}
					/>
					<Input
						placeholder='crontab exp'
						value={crontab}
						onChange={(ev) => {
							setcrontab(ev.target.value)
						}}
					/>
					<Checkbox
						label={'invoke once'}
						checked={invoke}
						onChange={(ev) => {
							setInvoke(ev.target.checked)
						}}
					/>
					<Button variant='soft' color='info' type='submit' loading={updating}>
						Create!
					</Button>
				</form>
			</Box>
		</>
	)
}
