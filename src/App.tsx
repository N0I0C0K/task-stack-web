import './App.css'
import { Outlet } from 'react-router-dom'
import {
	CssVarsProvider,
	CssBaseline,
	Sheet,
	List,
	ListItem,
	ListItemButton,
	Box,
	Divider,
	Avatar,
} from '@mui/joy'
import { Apps, StackedLineChart, Person } from '@mui/icons-material'
import ModeToggle from './components/ModeToggle'
import { FC } from 'react'
import { TaskTable } from './components/TaskTable'
import Login from './pages/login'

const FirstSidbar: FC = () => {
	return (
		<Sheet
			variant='soft'
			color='primary'
			invertedColors
			sx={{
				position: {
					xs: 'fixed',
					md: 'sticky',
				},
				transform: {
					xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
					md: 'none',
				},
				transition: 'transform 0.4s',
				// zIndex: -1,
				height: '100dvh',
				width: 'var(--FirstSidebar-width)',
				top: 0,
				p: 1.5,
				py: 3,
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
				borderRight: '1px solid',
				borderColor: 'divider',
			}}
		>
			<StackedLineChart
				sx={{
					width: 40,
					height: 40,
					mb: 5,
				}}
			/>
			<List sx={{ '--ListItem-radius': '8px', '--List-gap': '12px' }}>
				<ListItem>
					<ListItemButton selected variant='solid' color='primary'>
						<Apps />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<Apps />
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<Apps />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
			<Avatar variant='outlined'>
				<Person />
			</Avatar>
			<ModeToggle />
		</Sheet>
	)
}

function App() {
	return (
		<CssVarsProvider>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
				}}
			>
				<FirstSidbar />
				<TaskTable />
				{/* <Login /> */}
			</Box>
		</CssVarsProvider>
	)
}

export default App
