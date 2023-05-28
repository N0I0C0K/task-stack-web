import { Box, Typography } from '@mui/joy'
import { SessionInter } from 'Interface'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSessionInfo } from 'utils/datafetch'

export const OutSession: FC = () => {
	const { sessionid } = useParams()
	const [session, setSession] = useState<SessionInter>()
	useEffect(() => {
		if (!sessionid) return
		getSessionInfo(sessionid).then((res) => {
			setSession(res)
		})
	}, [sessionid])

	return (
		<Box p={3} display={'flex'} flexDirection={'column'}>
			{session && (
				<>
					<Typography level='h3'>{session.id}</Typography>
					<Typography level='body1'>Task id: {session.task_id}</Typography>
					<Typography level='body1'>Session id: {session.id}</Typography>
					<Typography level='body1'>Command: {session.command}</Typography>
					<Typography level='body1'>
						Start time: {session.start_time}
					</Typography>
					<Typography level='body1'>
						Finish time: {session.finish_time}
					</Typography>
				</>
			)}
		</Box>
	)
}
