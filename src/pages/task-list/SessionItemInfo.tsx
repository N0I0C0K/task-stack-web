import {
	Box,
	Typography,
	CircularProgress,
	Stack,
	Textarea,
	FormControl,
	FormLabel,
	IconButton,
	Tooltip,
} from '@mui/joy'
import { SessionOutputInter } from 'Interface'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { FC, useState, useMemo, useEffect } from 'react'
import { selectSession } from 'store/taskstore'
import { formatSeconds } from 'utils'
import { getSessoionOutput } from 'utils/datafetch'
import { websocketBaseUrl } from 'utils/http'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ClearIcon from '@mui/icons-material/Clear'

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
	const textAreaRef = React.useRef<HTMLDivElement>(null)
	const scrollBottom = () => {
		const textarea = textAreaRef.current
			?.getElementsByTagName('textarea')
			.item(0)
		if (textarea) {
			// 获取 textarea 的滚动高度
			const scrollHeight = textarea.scrollHeight
			const height = textarea.clientHeight
			const maxScrollTop = scrollHeight - height

			// 定义滚动速度和时间间隔
			let speed = 10 // 每 10 毫秒增加 1px
			const delay = 1

			let timer = setInterval(() => {
				const newScrollTop = textarea.scrollTop + speed
				if (newScrollTop < maxScrollTop) {
					textarea.scrollTop = newScrollTop
				} else {
					clearInterval(timer)
					textarea.scrollTop = maxScrollTop
				}
			}, delay)
		}
	}
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

			<Typography level='body1'>Output:</Typography>
			<Textarea
				value={output?.output}
				color={session?.success ? 'success' : 'neutral'}
				variant='soft'
				maxRows={50}
				endDecorator={
					<Box display={'flex'} textAlign={'center'} flex={'auto'} gap={1}>
						<IconButton
							onClick={() => {
								scrollBottom()
							}}
							variant='outlined'
							color='neutral'
						>
							<Tooltip title='scorll down'>
								<ArrowDownwardIcon />
							</Tooltip>
						</IconButton>
						<IconButton
							variant='outlined'
							color='neutral'
							onClick={() => {
								setOutput({
									finish: output!.finish,
									output: '',
									session_id: output!.session_id,
								})
							}}
						>
							<Tooltip title='clear output'>
								<ClearIcon />
							</Tooltip>
						</IconButton>
						<Typography level='body3' sx={{ ml: 'auto' }}>
							{output?.output.length} character(s)
						</Typography>
					</Box>
				}
				ref={textAreaRef}
				sx={{
					fontWeight: 350,
				}}
			/>
		</Box>
	)
})
