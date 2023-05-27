import {
	Box,
	ColorPaletteProp,
	Sheet,
	Stack,
	Tooltip,
	Typography,
} from '@mui/joy'
import { SystemInfoProps } from 'Interface'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { taskStore } from 'store/taskstore'
import { userStore } from 'store/userStore'
import { countArrayPredicate } from 'utils'
import { getSystemInfo } from 'utils/datafetch'
import { getHasLogin } from 'utils/http'

const ResItem: FC<{
	title: string
	description: string
	icon?: React.ReactElement
	display: string
	endDisplay?: string
	color?: ColorPaletteProp
}> = ({ title, description, icon, display, endDisplay, color }) => {
	return (
		<Sheet
			variant='soft'
			color={color}
			sx={{
				p: 2,
				borderRadius: 'md',
				width: '12vw',
				height: '12vw',
				minWidth: 150,
				minHeight: 150,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				boxShadow: 'md',
			}}
		>
			<Typography level='body2'>{title}</Typography>
			<Box flexGrow={1} display={'flex'} alignItems={'center'}>
				<Typography level='h1'>
					{display}
					{endDisplay && (
						<Typography level='body5' fontSize={'20px'}>
							{endDisplay}
						</Typography>
					)}
				</Typography>
			</Box>
			<Typography level='body5' fontSize={'10px'}>
				{description}
			</Typography>
		</Sheet>
	)
}

const SystemPanel: FC = observer(() => {
	// const [sysinfo, setSysinfo] = useState<SystemInfoProps>()

	// useEffect(() => {
	// 	const timer = setInterval(() => {
	// 		getSystemInfo().then((res) => {
	// 			setSysinfo(res)
	// 		})
	// 	}, 1000)
	// 	return () => {
	// 		clearInterval(timer)
	// 	}
	// }, [])

	return (
		<Box mt={3}>
			<Typography level='h4'>System Info</Typography>
			<Stack direction={'row'} sx={{ mt: 1 }} gap={3}>
				<ResItem
					title={'CPU'}
					description={'cpu used precent'}
					icon={undefined}
					display={`${userStore.systemInfo?.cpu_usage_percent ?? 'N/A'}`}
					endDisplay='%'
				/>
				<ResItem
					title={'Memory'}
					description={'memory usage percent'}
					icon={undefined}
					display={`${userStore.systemInfo?.memory_usage_percent ?? 'N/A'}`}
					endDisplay='%'
				/>
				<ResItem
					title={'Send'}
					description={'network send speed'}
					icon={undefined}
					display={`${
						userStore.systemInfo?.network_send_speed === undefined
							? 'N/A'
							: (userStore.systemInfo!.network_send_speed / 1024).toFixed(2)
					}`}
					endDisplay='kbit/s'
				/>
				<ResItem
					title={'Recv'}
					description={'network recv speed'}
					icon={undefined}
					display={`${
						userStore.systemInfo?.network_recv_speed === undefined
							? 'N/A'
							: (userStore.systemInfo!.network_recv_speed / 1024).toFixed(2)
					}`}
					endDisplay='kbit/s'
				/>
			</Stack>
		</Box>
	)
})

const TaskPanel: FC = observer(() => {
	return (
		<Box mt={3}>
			<Typography level='h4'>Task Info</Typography>
			<Stack direction={'row'} sx={{ mt: 1 }} gap={3}>
				<ResItem
					title='Running'
					description='running task number'
					display={String(
						countArrayPredicate(taskStore.tasks, (t) => t.running!)
					)}
				/>
				<ResItem
					title='Failed'
					description='failed task number'
					display={'N/A'}
					color='danger'
				/>
				<ResItem
					title='Total'
					description='total task number'
					display={String(taskStore.tasks.length)}
				/>
			</Stack>
		</Box>
	)
})
export const HomePanel: FC = () => {
	return (
		<Box p={3}>
			<Typography level='h2'>Home</Typography>
			<SystemPanel />
			<TaskPanel />
		</Box>
	)
}
