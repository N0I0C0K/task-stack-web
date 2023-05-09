import {
	Box,
	Typography,
	CircularProgress,
	Stack,
	Textarea,
	FormControl,
	FormLabel,
} from '@mui/joy'
import { SessionOutputInter } from 'Interface'
import { observer } from 'mobx-react-lite'
import { FC, useState, useMemo, useEffect } from 'react'
import { selectSession } from 'store/taskstore'
import { formatSeconds } from 'utils'
import { getSessoionOutput } from 'utils/datafetch'
import { websocketBaseUrl } from 'utils/http'

export const SessionListItem: FC = observer(() => {
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
			<Stack direction={'column'}>
				<Typography level='body3'>session id: {session.id}</Typography>
				<FormControl>
					<FormLabel>Command</FormLabel>
					<Textarea value={session.command} variant='soft' color='primary' />
				</FormControl>
			</Stack>

			<Stack gap={1}>
				<Typography level='body1'>Output:</Typography>
				<Textarea
					value={output?.output}
					color='success'
					variant='outlined'
					maxRows={20}
				/>
			</Stack>
		</Box>
	)
})
