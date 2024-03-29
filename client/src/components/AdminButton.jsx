import { ThemeProvider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import * as React from 'react';
import { FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { theme } from '../style/themes';
import MenuButton from './MenuButton';

export default function AdminButton() {
	return (
		<PopupState variant='popover' popupId='demo-popup-menu'>
			{popupState => (
				<React.Fragment>
					<ThemeProvider theme={theme}>
						<MenuButton
							variant='text'
							{...bindTrigger(popupState)}
							disableElevation
							startIcon={<FaCog />}
						>
							AdminPanel
						</MenuButton>
						<Menu {...bindMenu(popupState)}>
							<Link to='/admin/users'>
								<MenuItem onClick={popupState.close}>Users</MenuItem>
							</Link>

							<Link to='/admin/images'>
								<MenuItem onClick={popupState.close}>Images</MenuItem>
							</Link>
						</Menu>
					</ThemeProvider>
				</React.Fragment>
			)}
		</PopupState>
	);
}
