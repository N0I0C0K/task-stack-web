import { FC, useState } from 'react'
import {
	clearEventListener,
	connectState,
	initEventListen,
} from 'utils/eventlisten'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import { Button } from '@mui/joy'

export const EventListenrToggle: FC = () => {
	const [link, setLink] = useState(connectState)

	return (
		<Button
			variant='outlined'
			sx={{
				width: '40px',
			}}
			onClick={() => {
				if (link) {
					if (clearEventListener()) setLink(false)
				} else {
					if (initEventListen()) setLink(true)
				}
			}}
		>
			{link ? <LinkIcon /> : <LinkOffIcon />}
		</Button>
	)
}
