import { Button, Tooltip } from '@mui/joy'
import { FC, useState, useEffect } from 'react'
import { isUseTestData, setTestData } from 'utils/datafetch'

import BugReportIcon from '@mui/icons-material/BugReport'
import StorageIcon from '@mui/icons-material/Storage'

export const TestDataChangeToggle: FC = () => {
	const [useTest, setTest] = useState(isUseTestData())
	useEffect(() => {
		setTestData(useTest)
	}, [useTest])
	return (
		<Tooltip
			title={
				useTest ? 'you are now use test fake data' : 'you are now use real data'
			}
		>
			<Button
				variant='outlined'
				sx={{
					width: '40px',
				}}
				onClick={() => {
					setTest(!useTest)
				}}
			>
				{useTest ? <BugReportIcon /> : <StorageIcon />}
			</Button>
		</Tooltip>
	)
}
