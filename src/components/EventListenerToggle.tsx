import { FC, useState } from 'react'
import {
	clearEventListener,
	EventListenState,
	initEventListen,
} from 'utils/eventlisten'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import { Button, Tooltip } from '@mui/joy'
import { observer } from 'mobx-react-lite'

export const EventListenrToggle: FC = observer(() => {
	return (
		<Button
			variant='outlined'
			sx={{
				width: '40px',
			}}
			onClick={() => {
				if (EventListenState.connectState) {
					clearEventListener()
				} else {
					initEventListen()
				}
			}}
		>
			<Tooltip
				title={
					EventListenState.connectState
						? 'click to disconnect'
						: 'click to connect'
				}
			>
				{!EventListenState.connectState ? <LinkIcon /> : <LinkOffIcon />}
			</Tooltip>
		</Button>
	)
})
