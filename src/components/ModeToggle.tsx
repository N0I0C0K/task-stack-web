import { FC } from 'react'
import { useColorScheme, Button } from '@mui/joy'
import { LightMode, Nightlight } from '@mui/icons-material'

const ModeToggle: FC = () => {
	const { mode, setMode } = useColorScheme()

	return (
		<Button
			variant='outlined'
			sx={{
				width: '40px',
			}}
			onClick={() => {
				setMode(mode === 'light' ? 'dark' : 'light')
			}}
		>
			{mode === 'light' ? <Nightlight /> : <LightMode />}
		</Button>
	)
}

export default ModeToggle
