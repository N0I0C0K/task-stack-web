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
	Tooltip,
} from '@mui/joy'
import {
	Apps,
	StackedLineChart,
	Person,
	FormatListNumbered,
} from '@mui/icons-material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import HistoryIcon from '@mui/icons-material/History'
import ModeToggle from './components/ModeToggle'
import SettingsIcon from '@mui/icons-material/Settings'

import { FC, useEffect } from 'react'
import { TaskTable } from './components/TaskTable'
import Login from './pages/login'
import { GlobalModal } from './components/GlobalModal'
import { TaskList } from './pages/task-list/TaskList'
import { GlobalToast } from 'components/Toast'
import { TestDataChangeToggle } from 'components/TestDataChangeToggle'

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
						<Tooltip title='tasks'>
							<FormatListBulletedIcon />
						</Tooltip>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<Tooltip title='history session'>
							<HistoryIcon />
						</Tooltip>
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton>
						<Tooltip title='settings'>
							<SettingsIcon />
						</Tooltip>
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
			<TestDataChangeToggle />
			<ModeToggle />
			<Avatar variant='outlined'>
				<Person />
			</Avatar>
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
					width: '100%',
					height: '100vh',
				}}
			>
				<FirstSidbar />
				{/* <TaskTable /> */}
				<TaskList />

				{/* <Login /> */}
				<GlobalModal />
			</Box>
			<GlobalToast />
		</CssVarsProvider>
	)
}

export default App
