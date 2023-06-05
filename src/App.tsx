import './App.css'
import {
	Outlet,
	useLocation,
	useNavigate,
	useNavigation,
	useParams,
} from 'react-router-dom'
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
	TabList,
	Tabs,
	Tab,
	Typography,
} from '@mui/joy'
import { StackedLineChart, Person } from '@mui/icons-material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import HistoryIcon from '@mui/icons-material/History'
import ModeToggle from './components/ModeToggle'
import SettingsIcon from '@mui/icons-material/Settings'

import { FC, useEffect, useState } from 'react'
import Login from './pages/login'
import { GlobalModal } from './components/GlobalModal'
import { GlobalToast } from 'components/Toast'
import { TestDataChangeToggle } from 'components/TestDataChangeToggle'
import { EventListenrToggle } from 'components/EventListenerToggle'
import { nanoid } from 'nanoid'
import { CustomAvatar } from 'components/CustomAvatar'
import HomeIcon from '@mui/icons-material/Home'
import { FloatingDialog } from 'components/FloatingDialog'

const tabs: {
	id?: string
	key: string
	icon: React.ReactElement
	tooltip: string
}[] = [
	{
		key: '/home',
		icon: <HomeIcon />,
		tooltip: 'home panel',
	},
	{
		key: '/task',
		icon: <FormatListBulletedIcon />,
		tooltip: 'tasks',
	},
	{
		key: '/session',
		icon: <HistoryIcon />,
		tooltip: 'history sessions',
	},
	{
		key: '/setting',
		icon: <SettingsIcon />,
		tooltip: 'settings',
	},
]

const FirstSidbar: FC = () => {
	const loc = useLocation()
	const [curTab, setCurTab] = useState('/task')
	useEffect(() => {
		setCurTab(loc.pathname)
	}, [loc])
	const goto = useNavigate()

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
				//width: 150,
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
				{tabs.map((val) => {
					const selected = val.key === curTab
					return (
						<ListItem key={val.id ?? (val.id = nanoid())}>
							<ListItemButton
								selected={selected}
								variant={selected ? 'solid' : undefined}
								color={selected ? 'primary' : undefined}
								onClick={() => {
									goto(val.key)
								}}
							>
								<Tooltip title={val.tooltip}>{val.icon}</Tooltip>
							</ListItemButton>
						</ListItem>
					)
				})}
			</List>
			<Divider />
			<TestDataChangeToggle />
			<ModeToggle />
			<EventListenrToggle />
			<CustomAvatar />
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

				<Outlet />

				<Login />
				<GlobalModal />
			</Box>
			<GlobalToast />
			<FloatingDialog open={true} title='test1'>
				<Typography level='h2'>Test Floating Dialog</Typography>
			</FloatingDialog>
		</CssVarsProvider>
	)
}

export default App
