import { Box, Menu, MenuItem } from '@mui/joy'
import { FC, useRef, useEffect, useState } from 'react'

export const ContextMenu: FC<{
	menuItems: React.ReactElement
	open: boolean
	top: number
	left: number
	onClose: () => void
}> = ({ menuItems, open, top, left, onClose }) => {
	const boxElem = useRef(null)
	const [tarelement, setTar] = useState<HTMLElement | null>()
	useEffect(() => {
		if (boxElem.current) setTar(boxElem.current)
		else console.log(boxElem)
	}, [boxElem])
	return (
		<>
			<Box position={'fixed'} top={top} left={left} ref={boxElem}></Box>
			{tarelement ? (
				<Menu
					open={open}
					anchorEl={tarelement}
					onClose={onClose}
					placement='bottom-start'
					sx={{
						zIndex: 100000,
					}}
				>
					{menuItems}
				</Menu>
			) : null}
		</>
	)
}
