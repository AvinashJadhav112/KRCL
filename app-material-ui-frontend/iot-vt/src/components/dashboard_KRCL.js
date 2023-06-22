/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-alert */
/* eslint-disable semi */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { makeStyles, fade } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useState } from 'react';
import SummaryDashboard from '../dash_summary/SummaryDashboard';
import EquipmentWise from '../dash_equipment/equipmentWise';
import Alert_Summary from '../alert_summary/summary';
import EquipmentWiseAlert from '../alert_equipment_wise/EquipmentWiseAlert';
import RouterKRCL from '../RouterKRCL';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(0),
    },
  },

  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      paddingTop: '0%',
      textDecoration: 'none',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,

  drawerPaper: {
    boxSizing: 'border-box',
    width: drawerWidth,
  },
  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 3,
    paddingLeft: '1%',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchbar: {
    paddingLeft: '5%',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

  navitem: {
    display: 'block',
    padding: '10px 30px',
  },
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function Dashboard_KRCL(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = useState('');

  const handleClick = () => {
    setValue(true);
  }

  function handleDrawerOpen() {
    setOpen(true);
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openUM, setOpenUM] = React.useState(false); // UM:- User Management

  const [openIOT, setOpenIOT] = React.useState(false); // IOT

  const [openMHE, setOpenMHE] = React.useState(false); // MHE

  const [openDash, setOpenDash] = React.useState(false); // Dashboard

  const [openAlert, setOpenAlert] = React.useState(false); // Alert

  const [toDashboard, setDashboard] = React.useState(false);

  const handleClickLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', false);
    setDashboard(true);
  };

  const [toRegister, setResgister] = React.useState(false);
  const handleClickRegister = () => {
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', false);
    setResgister(true);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

  return (

    <div>
      <Box sx={{
        display: 'flex',
        direction: 'row-reverse',
      }}
      >
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
              noWrap
              component="div"
            />
            <div className={classes.grow} />

            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <img src="https://www.vervetronics.com/wp-content/uploads/2021/08/cropped-VT_Logo.png" alt="Logo" style={{ height: '4rem', width: '11rem' }} />

            <IconButton
              onClick={(ev) => {
                handleDrawerClose(ev);
                { setOpenUM(!true); }
                { setOpenIOT(!true); }
                { setOpenMHE(!true); }
                { setOpenDash(!true); }
                { setOpenAlert(!true); }
                { setOpen(!true); }
              }}
            >
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List disablePadding>
            <ListItem
              id="dashboard"
              button
              onClick={() => {
                setOpen(true);
                setOpenDash(!openDash);
                setOpenAlert(false)
              }}
            >
              <ListItemIcon>
                <DashboardOutlinedIcon />
              </ListItemIcon>

              <ListItemText>Dashboard</ListItemText>
              {openDash ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openDash} timeout="auto" unmountOnExit>
              <List>
                <ListItem
                  id="dash-summary"
                  style={{ paddingLeft: '30%' }}
                  value={SummaryDashboard}
                  onClick={(event) => setValue('SummaryDashboard')}
                  button
                >
                  <Link
                    to="/alert_summary/AlertsDonutChart"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <ListItemText className={classes.navitem}>
                      Summary
                    </ListItemText>
                  </Link>
                </ListItem>

                <ListItem
                  id="dash-equipment"
                  style={{ paddingLeft: '30%' }}
                  value={EquipmentWise}
                  onClick={(event) => setValue('EquipmentWise')}
                  button
                >
                  <Link
                    to="/dash_equipment/equipmentWiseKRCL"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <ListItemText className={classes.navitem}>
                      Equipment
                      <br />
                      Wise
                      <br />
                      Calculated
                    </ListItemText>
                  </Link>
                </ListItem>

              </List>
            </Collapse>
          </List>

          <Divider />

          <List disablePadding>
            <ListItem
              button
              onClick={() => {
                setOpen(true);
                setOpenAlert(!openAlert);
                setOpenDash(false)
              }}
            >
              <ListItemIcon>
                <ReportProblemOutlinedIcon />
              </ListItemIcon>

              <ListItemText>Alert</ListItemText>
              {openAlert ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openAlert} timeout="auto" unmountOnExit>
              <List>
                <ListItem
                  id="alert-summary"
                  style={{ paddingLeft: '30%' }}
                  value={Alert_Summary}
                  onClick={(event) => setValue('Alert_Summary')}
                  button
                >
                  <Link
                    to="/alert_summary/alertKRCLSummaryDash"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <ListItemText className={classes.navitem}>
                      Summary
                    </ListItemText>
                  </Link>
                </ListItem>

                <ListItem
                  style={{ paddingLeft: '30%' }}
                  value={EquipmentWiseAlert}
                  onClick={(event) => setValue('EquipmentWiseAlert')}
                  button
                >
                  <Link
                    to="/alert_equipment_wise/equipmentWiseAlert.js"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <ListItemText className={classes.navitem}>
                      Equipment-wise
                    </ListItemText>
                  </Link>
                </ListItem>
              </List>
            </Collapse>
          </List>

          <Divider />
        </Drawer>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >

          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
            <MenuItem onClick={handleClickLogout}>
              {/* <IconButton color="inherit"> */}
              <ExitToAppIcon />
              {/* </IconButton> */}
              Logout
            </MenuItem>
          </Link>
        </Menu>

        <div style={{ width: '85%', marginRight: '5%' }}>
          <RouterKRCL />
        </div>
      </Box>
    </div>
  );
}
export default Dashboard_KRCL;
