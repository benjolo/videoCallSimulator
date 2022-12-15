
let startTimeStamp = null;



let isLocalSession = false;
let loc = location.pathname;
let locPath = location.pathname;
loc = loc.replace("index.html", "")

const {
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
  Button,
  Box,
  Divider,
  SvgIcon,
  Slider,
  Tooltip,
  styled,
  SliderThumb,
  valueLabelFormat,
  calculateValue,
  value,
  useSnackbar,
  Snackbar,
  Alert,
  SnackbarProvider,
  Slide,
  IconsMaterial,
  Stack,
  Item,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Avatar,
  Grid,
  styles,
  Chip,
  GlobalStyles,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  CommentIcon,
  ListItemIcon,
  Checkbox,
  ListItemText,
  MarkAsUnreadIcon,
  Icon,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Drawer,
  AppBar,
  ToolBar,
  Menu,
  ChevronLeft,
  ChevronRight,
  MoveToInbox,
  Mail,
  SpeedDial,
  Backdrop,
  SpeedDialIcon,
  SpeedDialAction,
  TextareaAutosize,
  StaticTimePicker,
  LocalizationProvider,
  AdapterDateFns,
  Skeleton,
  VideoCamIcon,
  VideoCamOffIcon,
  FormControlLabel,
  Switch,
  FormGroup,
  ListSubheader,
  Fade,
  Grow,
  Zoom,
  Collapse,
  MenuItem,
  PersonAdd,
  Settings,
  Logout
} = MaterialUI;


const theme = createTheme({
	typography: {
	  divider:{
		height: '1000px',
	  }
	},
  
	status: {
	  danger: '#e53e3e',
	},
	palette: {
	  primary: {
		main: '#ffffff',
		darker: '#053e85',
	  },
	  neutral: {
		main: '#64748B',
		contrastText: '#fff',
	  },
	},
  });


  
  function valuetext(value) {
	return `${value}`;
  }
  
  

const App = () => 
{
	let browserVersion = navigator.userAgent;
	let version = parseFloat(browserVersion.slice(browserVersion.search("Version") + 8, browserVersion.search("Version") + 12));
	// if(version < 15.4)
	// {
	// 	return(
	// 		<>
	// 		<h1 style={{color:'white'}}>Version not supported</h1>
	// 		<img src="media/BrowserVersion.png" className="versionWrong"></img>
	// 		</>
	// 	)
	// }
	const [callSucceeded, setCallSucceeded] = React.useState(false);
	const isLocalhost = location.hostname == "127.0.0.1" || location.hostname == "localhost" ? true : false;
	if (!callSucceeded)
	{
		if(!isLocalhost)
			ScormProcessInitialize(); //initializes the scorm.
		setCallSucceeded(true);
	}
	isLocalSession = ScormProcessGetValue("cmi.launch_data");
	isLocalSession = isLocalSession == undefined ? true : false;
	startTimeStamp = new Date();
	window.onbeforeunload = () => {
		doExit();
	}
	return(
		<>
			<Home/>
		</>
	)
}



const Home = () => {
	
	const Route = ReactRouterDOM.Route;
	const Router = window.ReactRouterDOM.BrowserRouter;
	const [videoOn, setVideoOn] = React.useState(true);
	const [audioOn, setAudioOn] = React.useState(true);
	const [json, setJson] = React.useState([]);

	// if(ScormProcessGetValue("cmi.interactions._count"))
	// 	interactionCount = ScormProcessGetValue("cmi.interactions._count");
	let yourName = ScormProcessGetValue("cmi.learner_name") ? ScormProcessGetValue("cmi.learner_name") : "Guest";
	let device = "";
	if(window.innerWidth <= 820)
	{
		device = "mobile";
	}
	else
	{
		device = "desktop";
	}

	React.useEffect(() => {
        fetch("js/doc/script.json")
        .then(response => response.json())
        .then(json => setJson(json));
        
	}, []);

  console.log("json[it]?.quest.length", json[1]?.quest.length);
	return(
		<>
		<Router>
			<Stack spacing={3} id="content">
      {device !== "mobile" ?
        <Grid item xs={12} sx={{display: "flex", justifyContent: "space-between", color: "white", alignItems: "center"}}>
					<Logo/>
					<h3>VideoCall-Simulator</h3>
				</Grid>
        :
        <Grid item xs={12} sx={{display: "flex", justifyContent: "space-around", color: "white", alignItems: "center"}}>
					<h3>VideoCall-Simulator</h3>
				</Grid>}
				{device === "mobile" ? 				
				<Grid id="app" sx={{ padding: "2%", marginTop: "0 !important"}}>
					<Route path={`${locPath}`} exact component={() => <SetCall setVideoOn={setVideoOn} setAudioOn={setAudioOn} json={json} device={device}  yourName={yourName}/>}/>
					<Route path={`${loc}call`} component={() => <Call audioOn={audioOn} videoOn={videoOn} setVideoOn={setVideoOn} setAudioOn={setAudioOn} json={json} device={device}  yourName={yourName}/>}/>
				</Grid> 
				: 				
				<Grid container item xs={12} id="app" sx={{ padding: "2%", marginTop: "0 !important"}}>
					<Route path={`${locPath}`} exact component={() => <SetCall setVideoOn={setVideoOn} setAudioOn={setAudioOn} json={json} device={device} yourName={yourName}/>}/>
					<Route path={`${loc}call`} component={() => <Call audioOn={audioOn} videoOn={videoOn} setVideoOn={setVideoOn} setAudioOn={setAudioOn} json={json} device={device}  yourName={yourName}/>}/>
				</Grid>}
			</Stack>
		</Router>
		</>
		)}




ReactDOM.render(
  <App/>,
  document.getElementById('mainNew')
);