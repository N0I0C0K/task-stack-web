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
	ColorPaletteProp,
	Button,
	Chip,
	Divider,
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
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import { toast } from 'components/Toast'

import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export const SessionListItem: FC = observer(() => {
	const [output, setOutput] = useState<SessionOutputInter>()

	const sessionid = useMemo(() => {
		return selectSession.session?.id
	}, [selectSession.session])
	const session = useMemo(() => {
		return selectSession.session!
	}, [selectSession.session])

	const [color, setColor] = useState<ColorPaletteProp>(
		session?.running ? 'neutral' : session?.success ? 'success' : 'danger'
	)

	useEffect(() => {
		getSessoionOutput(selectSession.session!.id).then((data) => {
			setOutput(data)
		})
		setColor(
			session?.running ? 'neutral' : session?.success ? 'success' : 'danger'
		)
	}, [session, sessionid])

	const [ws, setWs] = useState<WebSocket>()
	const [wsLoading, setWsLoading] = useState(false)

	const connectToLiveOutput = () => {
		if (ws || !session.running) {
			return
		}
		setWsLoading(true)
		const nws = new WebSocket(
			`${websocketBaseUrl}/task/session/communicate?session_id=${sessionid}`
		)
		nws.onmessage = (ev) => {
			const tars = String(ev.data)
			if (tars === `task-${sessionid} over`) {
				nws.close()
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
		nws.onclose = (ev) => {
			nws.close()
		}
		nws.onopen = (ev) => {
			setWs(nws)
			setTimeout(() => {
				nws.send('1')
			}, 1000)
			setWsLoading(false)
		}
		nws.onerror = (ev) => {
			console.log(ev)
			toast.error('connect to live output failed', ev.type)
			setWsLoading(false)
		}
	}

	const disconnectToLiveOutput = () => {
		ws?.close()
		setWs(undefined)
	}

	useEffect(() => {
		return () => {
			ws?.close()
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
				color={color}
				endDecorator={
					session.running ? (
						<>
							<CircularProgress
								variant='plain'
								size='sm'
								sx={{ maxHeight: '20px' }}
							/>
						</>
					) : (
						<Chip
							variant='soft'
							color={color}
							startDecorator={session.success ? <DoneIcon /> : <CloseIcon />}
						>
							{session.success ? 'success' : 'failed'}
						</Chip>
					)
				}
			>
				{formatSeconds(session.start_time)}
				{' - '}
				{formatSeconds(session.finish_time)}
			</Typography>
			<Stack direction={'column'}>
				<Typography level='body3'>{session.id}</Typography>
				<FormControl>
					<FormLabel>Command</FormLabel>
					<Textarea value={session.command} variant='soft' color={color} />
				</FormControl>
			</Stack>

			<Typography level='body1'>Output:</Typography>
			<Textarea
				value={output?.output}
				color={color}
				variant='soft'
				maxRows={50}
				endDecorator={
					<Box
						display={'flex'}
						textAlign={'center'}
						flex={'auto'}
						gap={1}
						alignItems={'center'}
					>
						<IconButton variant='outlined' color='neutral'>
							<Tooltip title='zomm in font'>
								<AddIcon />
							</Tooltip>
						</IconButton>
						<IconButton variant='outlined' color='neutral'>
							<Tooltip title='zomm out font'>
								<RemoveIcon />
							</Tooltip>
						</IconButton>
						<Divider orientation='vertical' />
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

						{!session!.running ? null : (
							<Button
								loading={wsLoading}
								variant='soft'
								color='info'
								onClick={() => {
									if (ws) {
										disconnectToLiveOutput()
									} else {
										connectToLiveOutput()
									}
								}}
							>
								{ws ? (
									<Tooltip title='Disconnect to live output'>
										<LinkOffIcon />
									</Tooltip>
								) : (
									<Tooltip title='Connect to live output'>
										<LinkIcon />
									</Tooltip>
								)}
							</Button>
						)}
						<Typography level='body3' sx={{ ml: 'auto' }}>
							{output?.output.length} character(s)
						</Typography>
					</Box>
				}
				ref={textAreaRef}
				sx={{}}
			/>
		</Box>
	)
})
