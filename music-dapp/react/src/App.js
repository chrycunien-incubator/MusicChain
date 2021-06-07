import { Input } from 'antd';
import getWeb3 from './utils/getWeb3';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { downloadAudioIPFS } from './ipfs/download';
import MusicDAppContract from './build/contracts/MusicDApp.json';

import clsx from 'clsx';
import {
  CssBaseline, makeStyles,
  Container, Box, Grid, Paper, AppBar, Toolbar, Drawer,
  List, Typography, Divider, Badge,
  TextField, Link, Button, IconButton
} from '@material-ui/core';


import UploadPage from './UploadPage';
import TestingPage from './TestingPage';
import AccountPage from './AccountPage';
import DashboardPage from './DashboardPage';

import { mainListItems, secondaryListItems } from './components/DrawerListItems';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

// defines CSS style properties for App()
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: '#a3d2ca'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  chevronleftIcon: {
    color: 'white'
  },
  listItems: {
    color: 'white'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: '#808080',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#202020',
  },
}));

function App() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [page, setPage] = useState("Dashboard");

  const [songHash, setSongHash] = useState('');
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});



  useEffect(async () => {
    try {
      const web3Instance = await getWeb3();
      const accountsInstance = await web3Instance.eth.getAccounts();
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = MusicDAppContract.networks[networkId];
      const contractInstance = new web3Instance.eth.Contract(
        MusicDAppContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setWeb3(web3Instance);
      setAccounts(accountsInstance);
      setContract(contractInstance);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  });

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };


  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />

        <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>

            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {page}
            </Typography>

            <IconButton color="inherit">
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
          }}
          open={drawerOpen}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon className={classes.chevronleftIcon} />
            </IconButton>
          </div>

          <Divider />
          <List className={classes.listItems}>{mainListItems(setPage)}</List>
          <Divider />
          <List className={classes.listItems}>{secondaryListItems(setPage)}</List>
        </Drawer>


        {/* Main content of each page */}

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Switch>
            <Route exact path="/">
              <DashboardPage web3={web3} contract={contract} accounts={accounts} setPage={setPage} />
            </Route>
            <Route exact path="/test">
              <TestingPage web3={web3} contract={contract} accounts={accounts} setPage={setPage} />
            </Route>
            <Route exact path="/dashboard">
              <DashboardPage web3={web3} contract={contract} accounts={accounts} setPage={setPage} />
            </Route>
            <Route exact path="/upload">
              <UploadPage web3={web3} contract={contract} accounts={accounts} setPage={setPage} />
            </Route>
            <Route exact path="/account">
              <AccountPage web3={web3} contract={contract} accounts={accounts} setPage={setPage} />
            </Route>
          </Switch>
          {/* <div>{contentComponent}</div> */}

        </main>

        {/* Could design a music player in the footer */}
      </div>
    </Router>
  );
}

export default App;
