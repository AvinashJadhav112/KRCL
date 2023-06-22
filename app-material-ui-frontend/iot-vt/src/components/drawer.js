/* eslint-disable react/require-default-props */
/* eslint-disable no-lone-blocks */
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import SettingsApplicationsOutlinedIcon from '@material-ui/icons/SettingsApplicationsOutlined';
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

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
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,

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
  //
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

  navitem: {
    display: 'block',
    padding: '10px 30px',
  },

}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [openUM, setOpenUM] = React.useState(false); // UM:- User Management

  const [openIOT, setOpenIOT] = React.useState(false);// IOT

  const [openMHE, setOpenMHE] = React.useState(false); // MHE

  const [openDash, setOpenDash] = React.useState(false); // Dashboard

  const [openAlert, setOpenAlert] = React.useState(false); // Alert

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <div>
      <div className={classes.drawer} />
      <List disablePadding>
        <ListItem button>
          {/* <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon> */}
          <ListItemAvatar>
            <Avatar src="https://media-exp1.licdn.com/dms/image/C510BAQG5ZbXEnRc_lg/company-logo_200_200/0/1546595027857?e=2159024400&v=beta&t=Xf2t5tivIlq9z-k0eD-VWTwMKx4NjAaDVwm4OeaYe4M" alt="Verve Tronics" className={classes.large} />
          </ListItemAvatar>

          <a href="//www.vervetronics.com/" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText
              primary={<Typography variant="h5"> VerveTronics </Typography>}
              secondary="Imaginering pvt ltd"
            />
          </a>
        </ListItem>
      </List>

      <Divider />

      <List>
        <List disablePadding>
          <ListItem button id="user-management" onClick={() => setOpenUM(!openUM)}>

            <ListItemIcon>
              <AssignmentIndOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              User Management
            </ListItemText>

            {openUM ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openUM} timeout="auto" unmountOnExit>
            <List>

              <ListItem id="customer" style={{ paddingLeft: '30%' }} button>
                <Link to="/um_company/company.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Company
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="user" style={{ paddingLeft: '30%' }} button>

                <li>
                  <Link to="/um_user/user.js" style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItemText className={classes.navitem}>
                      User
                    </ListItemText>

                  </Link>
                </li>

              </ListItem>

            </List>
          </Collapse>
        </List>

        <Divider />
        <List disablePadding>
          <ListItem button id="IOT" onClick={() => setOpenIOT(!openIOT)}>

            <ListItemIcon>
              <SettingsApplicationsOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              I O T
            </ListItemText>
            {openIOT ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openIOT} timeout="auto" unmountOnExit>
            <List>
              <ListItem id="iot-model" style={{ paddingLeft: '30%' }} button>
                <Link to="/iot_model/iotModel.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Model
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="iot-device" style={{ paddingLeft: '30%' }} button>
                <Link to="/iot_device/iotDevices.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Device
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="iot-configuration" style={{ paddingLeft: '30%' }} button>
                <Link to="/iot_configration/Configuration.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Configuration
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="iot-firmware" style={{ paddingLeft: '30%' }} button>

                <Link to="/iot_firmware/Firmware.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Firmware
                  </ListItemText>
                </Link>
              </ListItem>

            </List>
          </Collapse>
        </List>
        <Divider />
        <List disablePadding>
          <ListItem id="MHE" button onClick={() => setOpenMHE(!openMHE)}>

            <ListItemIcon>
              <AddToPhotosOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              M.H.E
            </ListItemText>
            {openMHE ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openMHE} timeout="auto" unmountOnExit>
            <List>

              <ListItem id="mhe-model" style={{ paddingLeft: '30%' }} button>

                <Link to="/mhe_model/mhemodel.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Model
                  </ListItemText>
                </Link>
              </ListItem>
              <ListItem id="mhe-equipment" style={{ paddingLeft: '30%' }} button>

                <Link to="/mhe_equipment/mheequipment.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Equipment
                  </ListItemText>
                </Link>
              </ListItem>
            </List>
          </Collapse>
        </List>

        <Divider />
        <List disablePadding>
          <ListItem id="dashboard" button onClick={() => setOpenDash(!openDash)}>

            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              Dashboard
            </ListItemText>
            {openDash ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openDash} timeout="auto" unmountOnExit>
            <List>
              <ListItem id="dash-summary" style={{ paddingLeft: '30%' }} button>

                <Link to="/dash_summary/summaryDash.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Summary
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="dash-equipment" style={{ paddingLeft: '30%' }} button>
                <Link to="/dash_equipment/Equipment_wise.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Equipment Wise

                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="dash-map" style={{ paddingLeft: '30%' }} button>
                <ListItemText className={classes.navitem}>
                  Map

                </ListItemText>

              </ListItem>
            </List>

          </Collapse>
        </List>

        <Divider />

        <List disablePadding>
          <ListItem button onClick={() => setOpenAlert(!openAlert)}>

            <ListItemIcon>
              <ReportProblemOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              Alert
            </ListItemText>
            {openAlert ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openAlert} timeout="auto" unmountOnExit>
            <List>
              <ListItem id="alert-summary" style={{ paddingLeft: '30%' }} button>

                <Link to="/alert_summary/summary.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Summary
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem style={{ paddingLeft: '30%' }} button>
                <Link to="/alert_equipment_wise/EquipmentWiseAlert.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText className={classes.navitem}>
                    Equipment-wise
                  </ListItemText>
                </Link>

              </ListItem>

            </List>

          </Collapse>
        </List>

      </List>
      <Divider />

    </div>

  );

  { /* for mobile view */ }

  const drawer_mv = (
    <div>
      <div className={classes.drawer} />
      <List disablePadding>
        <ListItem button>
          <ListItemAvatar>
            <Avatar src="https://media-exp1.licdn.com/dms/image/C510BAQG5ZbXEnRc_lg/company-logo_200_200/0/1546595027857?e=2159024400&v=beta&t=Xf2t5tivIlq9z-k0eD-VWTwMKx4NjAaDVwm4OeaYe4M" alt="Verve Tronics" className={classes.large} />
          </ListItemAvatar>

          <a href="//www.vervetronics.com/" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText
              primary={<Typography variant="h5"> VerveTronics </Typography>}
              secondary="Imaginering pvt ltd"
            />
          </a>
        </ListItem>
      </List>

      <Divider />

      <List>
        <List disablePadding>
          <ListItem button id="user-management-mv" onClick={() => setOpenUM(!openUM)}>

            <ListItemIcon>
              <AssignmentIndOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              User Management
            </ListItemText>

            {openUM ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openUM} timeout="auto" unmountOnExit>
            <List>

              <ListItem id="customer-mv" style={{ paddingLeft: '35%' }} button>
                <Link to="/um_company/company.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Company
                  </ListItemText>
                </Link>
                {/* </li> */}
              </ListItem>

              <ListItem id="user-mv" style={{ paddingLeft: '35%' }} button>

                <li>
                  <Link to="/um_user/user.js" style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItemText>
                      User
                    </ListItemText>

                  </Link>
                </li>

              </ListItem>

            </List>
          </Collapse>
        </List>

        <Divider />
        <List disablePadding>
          <ListItem button id="IOT-mv" onClick={() => setOpenIOT(!openIOT)}>

            <ListItemIcon>
              <SettingsApplicationsOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              I O T
            </ListItemText>
            {openIOT ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openIOT} timeout="auto" unmountOnExit>
            <List>
              <ListItem id="iot-model-mv" style={{ paddingLeft: '35%' }} button>
                <Link to="/iot_model/iotModel.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Model
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="iot-device-mv" style={{ paddingLeft: '35%' }} button>
                <Link to="/iot_device/iotDevices.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Device
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="iot-configuration-mv" style={{ paddingLeft: '35%' }} button>
                <Link to="/iot_configration/Configuration.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Configuration
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="iot-firmware-mv" style={{ paddingLeft: '35%' }} button>

                <Link to="/iot_firmware/Firmware.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Firmware
                  </ListItemText>
                </Link>
              </ListItem>

            </List>
          </Collapse>
        </List>
        <Divider />
        <List disablePadding>
          <ListItem id="MHE-mv" button onClick={() => setOpenMHE(!openMHE)}>

            <ListItemIcon>
              <AddToPhotosOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              M.H.E
            </ListItemText>
            {openMHE ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openMHE} timeout="auto" unmountOnExit>
            <List>

              <ListItem id="mhe-model-mv" style={{ paddingLeft: '35%' }} button>

                <Link to="/mhe_model/mhemodel.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Model
                  </ListItemText>
                </Link>
              </ListItem>
              <ListItem id="mhe-equipment-mv" style={{ paddingLeft: '35%' }} button>

                <Link to="/mhe_equipment/mheequipment.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Equipment
                  </ListItemText>
                </Link>
              </ListItem>
            </List>
          </Collapse>
        </List>

        <List disablePadding>
          <ListItem id="dashboard-mv" button onClick={() => setOpenDash(!openDash)}>

            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              Dashboard
            </ListItemText>
            {openDash ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openDash} timeout="auto" unmountOnExit>
            <List>
              <ListItem id="dash-summary-mv" style={{ paddingLeft: '35%' }} button>

                <Link to="/dash_summary/summaryDash.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Summary
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem id="dash-equipment-mv" style={{ paddingLeft: '35%' }} button>
                <Link to="/dash_equipment/Equipment_wise.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Equipment-wise

                  </ListItemText>
                </Link>

              </ListItem>

              <ListItem id="dash-map-mv" style={{ paddingLeft: '35%' }} button>
                <ListItemText>
                  Map

                </ListItemText>

              </ListItem>
            </List>

          </Collapse>
        </List>

        <Divider />

        <List disablePadding>
          <ListItem button onClick={() => setOpenAlert(!openAlert)}>

            <ListItemIcon>
              <ReportProblemOutlinedIcon />
            </ListItemIcon>

            <ListItemText>
              {' '}
              Alert
            </ListItemText>
            {openAlert ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openAlert} timeout="auto" unmountOnExit>
            <List>
              <ListItem id="alert-summary-mv" style={{ paddingLeft: '35%' }} button>

                <Link to="/alert_summary/summary.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Summary
                  </ListItemText>
                </Link>
              </ListItem>

              <ListItem style={{ paddingLeft: '35%' }} button>
                <Link to="/alert_equipment_wise/EquipmentWiseAlert.js" style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemText>
                    Equipment-wise
                  </ListItemText>
                </Link>
              </ListItem>

            </List>

          </Collapse>
        </List>

      </List>
      <Divider />

    </div>

  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap component="div" />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>

            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              style={{ paddingLeft: '15%' }}
            />

          </div>
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
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer_mv}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

      </main>

      {renderMobileMenu}
      {renderMenu}
    </div>

  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
