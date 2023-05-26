import { Box, Sheet, Stack, Tooltip, Typography } from '@mui/joy'
import { FC } from 'react'

const ResItem: FC<{
	title: string
	description: string
	icon: React.ReactElement | undefined
	num: number
}> = ({ title, description, icon, num }) => {
	return (
		<Sheet
			variant='soft'
			sx={{
				p: 2,
				borderRadius: 'md',

				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography level='body2'>{title}</Typography>
			<Tooltip title={description}>
				<Typography level='h1'>{num}</Typography>
			</Tooltip>
			<Typography level='body3'>{description}</Typography>
		</Sheet>
	)
}

const SystemPanel: FC = () => {
	return (
		<Stack direction={'row'} sx={{ mt: 2 }} gap={3}>
			<ResItem
				title={'CPU'}
				description={'cpu used precent'}
				icon={undefined}
				num={2.21}
			/>
			<ResItem
				title={'Memory'}
				description={'memory usage percent'}
				icon={undefined}
				num={31.2}
			/>
		</Stack>
	)
}

export const HomePanel: FC = () => {
	return (
		<Box p={3}>
			<Typography level='h2'>Home</Typography>
			<SystemPanel />
		</Box>
	)
}
