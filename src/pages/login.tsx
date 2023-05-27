import { FC, useState, useEffect } from 'react'
import { Sheet, Modal, Typography, Input, Button } from '@mui/joy'
import { http, setHasLogin, setToken } from '../utils/http'
import { taskStore } from 'store/taskstore'
import { initEventListen } from 'utils/eventlisten'
import { isUseTestData } from 'utils/datafetch'

const Login: FC = () => {
	const [open, setOpen] = useState(false)
	const [key, setkey] = useState('')
	useEffect(() => {
		if (isUseTestData()) return
		http
			.get('/auth/beat')
			.then(({ status }) => {
				if (status !== 200) {
					setHasLogin(false)
					setOpen(true)
				} else {
					setHasLogin(true)
					setOpen(false)
				}
			})
			.catch((reason) => {
				setOpen(true)
			})
	}, [])

	return (
		<>
			<Modal
				open={open}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 10,
				}}
			>
				<Sheet
					variant='outlined'
					sx={{
						borderRadius: 'md',
						p: 3,
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
					}}
				>
					<Typography
						component='h2'
						id='close-modal-title'
						level='h4'
						textColor='inherit'
						fontWeight='lg'
					>
						Input Key
					</Typography>
					<Input
						value={key}
						onChange={(ev) => {
							setkey(ev.target.value)
						}}
					/>
					<Button
						onClick={() => {
							http
								.get<{
									code: number
									token: string
								}>('/auth/login', {
									params: {
										secret_key: key,
									},
								})
								.then(({ data }) => {
									if (data.code === 200) {
										setToken(data.token)
										setOpen(false)
										setHasLogin(true)
										// initEventListen()
										taskStore.refresh()
									}
								})
						}}
					>
						Login
					</Button>
				</Sheet>
			</Modal>
		</>
	)
}

export default Login
