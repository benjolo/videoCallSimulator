const SetCall = (props) => {
    const Link = ReactRouterDOM.NavLink;

    const { setVideoOn, setAudioOn, json, device, yourName } = props;
    const [camera, setCamera] = React.useState(true);
    const [audio, setAudio] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const webcam = React.useRef();

    const handleAnchor = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    function stopCamera() {
        
        if(camera)
        {
            let stream = webcam.current.stream ? webcam.current.stream : false;
            if(stream !== false)
            {
                const tracks = stream.getTracks();
                if(tracks[1])
                    tracks[1].enabled = !camera;
                else
                    tracks[0].enabled = !camera;
            }
            setCamera(!camera);
        }
        else
            setCamera(!camera);
        
    }
    function stopAudio() {
        setAudio(!audio);
    }

    function sendSettings() {
        setVideoOn(camera);
        setAudioOn(audio);
    }

    function exitBefore() {
        if (!isLocalSession)
        {
            ScormProcessSetValue("cmi.exit", "");
            ScormProcessSetValue("adl.nav.request", "exitAll");
            doUnload();
        }
    }

    React.useEffect(() => {
        setTimeout(() => {setLoading(true)}, 2000);
    }, []);
    
    return (
        device === "desktop" ? (
        !loading ? ( <></> 
        ) : (
        <>
        <Grid container item style={{justifyContent: "center", minHeight: "7vh"}}>
            <CustomTypo text={"Join the call with " + json[0].name + ", " + json[0].job + " at " + json[0].society}></CustomTypo>
        </Grid>
        <Grid container item spacing={3} sx={{alignContent: "flex-start"}}>
            <Grid item xs={2} sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", bgcolor: '#15191fb3'}} style={{paddingLeft: "5px", paddingTop: 0, borderRadius: "5px"}} >
                <List sx={{ width: '100%', maxWidth: 360}} subheader={<ListSubheader sx={{bgcolor: '#1a1f25', borderRadius: "25%", color: 'white', display: "flex", justifyContent: "space-between", alignItems: "center"}}>Progress <GetPercentage percentage={0} maxPercentage={json.length - 2} /></ListSubheader>}>
                    <Divider variant="inset" component="li" style={{borderColor: "#6c6b6b", marginLeft: "5%", marginRight: "5%"}}/>
                    <ListItem sx={{justifyContent:'space-between'}}>
                        <ListItemIcon sx={{minWidth: "3vh"}}>
                            <Button sx={{color: "grey", textTransform: "none"}} startIcon={<i className="bi bi-arrow-repeat"></i>}>Repeat</Button>
                        </ListItemIcon>
                        <ListItemIcon sx={{minWidth: "3vh"}}>
                            <Button sx={{color: "grey", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i class="bi bi-pause-fill"></i>}>Pause</Button>
                        </ListItemIcon>
                    </ListItem>
                    <Divider variant="inset" component="li" style={{margin: "1vh"}}/>
                    <ListItem>
                    <ListItemIcon sx={{minWidth: "3vh", paddingRight: '1.5vh'}}>
                        <IconButton><VolumeIconDownGrey/></IconButton>
                    </ListItemIcon>
                        <Slider sx={{color: 'grey', '& .MuiSlider-thumb': { height: 12, width: 12}}}aria-label="Volume" value={50} />
                    <ListItemIcon sx={{paddingLeft: '1.5vh', minWidth: "3vh"}}>
                        <IconButton><VolumeIconUpGrey/></IconButton>
                    </ListItemIcon>
                </ListItem>
                </List>
            </Grid>
            <Grid item xs={8} sx={{textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center"}} style={{paddingLeft: 0, paddingTop: 0}}>
                {camera ? <Webcam ref={webcam} audio={false} className="video-responsive" id="webcam"/> : <video className="video-responsive" id="webcam"/>}
            </Grid>
            <Grid item xs={2} sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", bgcolor: '#15191fb3'}} style={{paddingLeft: "5px", paddingTop: 0, borderRadius: "5px"}}>
                <List sx={{ width: '100%', maxWidth: 360}} subheader={<ListSubheader sx={{bgcolor: '#1a1f25', borderRadius: "25%", color: 'white', display: "flex", justifyContent: "space-between", alignItems: "center"}}>Settings</ListSubheader>}>
                <Divider variant="inset" component="li" style={{borderColor: "#6c6b6b", marginLeft: "5%", marginRight: "5%"}}/>
                <ListItem>
                    <ListItemIcon sx={{minWidth: "5vh"}}>
                        {camera ? <VideoOn/> : <VideoOff/>}
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-wifi" primary="WebCam" sx={{color: 'white'}}/>
                    <Switch edge="end" checked={camera} onChange={() => stopCamera() } style={{color: "white"}} />
                </ListItem>
                <Divider variant="inset" component="li" style={{borderColor: "#6c6b6b", marginLeft: "20%", marginRight: "5%"}}/>
                <ListItem>
                    <ListItemIcon sx={{minWidth: "5vh"}}>
                        {audio ? <AudioOn/> : <AudioOff/>}
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-bluetooth" primary="Microphone" sx={{color: 'white'}}/>
                    <Switch edge="end" checked={audio} onChange={() => stopAudio()} style={{color: "white"}} />
                </ListItem>
                <Divider variant="inset" component="li" style={{borderColor: "#6c6b6b", marginLeft: "20%", marginRight: "5%"}}/>
                <ListItem>
                    <ListItemIcon sx={{minWidth: "5vh"}}>
                        <DownloadScriptInactive/>
                    </ListItemIcon>
                    <ListItemText id="" primary="Transcription" sx={{color: 'grey'}}/>
                    <Button sx={{minWidth: "3%"}} edge="end"><IconDownloadInactive/></Button>
                </ListItem>
                </List>
            </Grid>
        </Grid>
        <Grid container item sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}} spacing={2}>
            <Grid item xs={10} style={{padding: "1%", display: "flex", borderRadius: "5px"}}/>
            <Grid item xs={2} spacing={3} sx={{display: "flex", justifyContent: "space-around"}}>
                <Button variant="rounded" sx={{backgroundColor: "#5e0505", borderRadius: "15px", color: "white", paddingLeft: "4vh", paddingRight: "4vh", '&:hover': {backgroundColor: "#5e0505", border: "solid 1px red"}}} onClick={() => exitBefore()}>Exit</Button>
                <Button variant="rounded" sx={{backgroundColor: "#176401", borderRadius: "15px", color: "white", paddingLeft: "4vh", paddingRight: "4vh", '&:hover': {backgroundColor: "#176401", border: "solid 1px green"}}} onClick={() => sendSettings()}><Link to={`${loc}call`} >Join</Link></Button>
            </Grid>
        </Grid>
        </>
    )
    ) : (
        <>
        <Grid container item style={{justifyContent: "center", flexDirection: "column"}}>
            <Grid sx={{display: 'flex', justifyContent: "space-between", alignItems: "center", flexDirection: "row-reverse"}}>
                <Button type="" sx={{cursor: "none"}}>
                    <GetPercentage percentage={0} maxPercentage={json.length - 2} />
                </Button>
                <ListItemIcon sx={{minWidth: "3vh"}}>
                    <Button sx={{color: "grey", textTransform: "none"}} startIcon={<i className="bi bi-arrow-repeat"></i>}>Repeat</Button>
                </ListItemIcon>
                <ListItemIcon sx={{minWidth: "3vh"}}>
                <Button sx={{color: "grey", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i class="bi bi-pause-fill"></i>}>Pause</Button>
                </ListItemIcon>
                <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleAnchor}>
                    <SettingIcon/>
                </Button>
                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button'}} sx={{'.MuiMenu-paper': {backgroundColor: '#1a1f25'}}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon sx={{minWidth: "5vh"}}>
                            {camera ? <VideoOn/> : <VideoOff/>}
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary="WebCam" sx={{color: 'white'}}/>
                        <Switch edge="end" checked={camera} onChange={() => stopCamera() } style={{color: "white"}} />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon sx={{minWidth: "5vh"}}>
                            {audio ? <AudioOn/> : <AudioOff/>}
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-bluetooth" primary="Microphone" sx={{color: 'white'}}/>
                        <Switch edge="end" checked={audio} onChange={() => stopAudio()} style={{color: "white"}} />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon sx={{minWidth: "5vh"}}>
                            <DownloadScriptInactive/>
                        </ListItemIcon>
                        <ListItemText id="" primary="Transcription" sx={{color: 'grey'}}/>
                        <Button sx={{minWidth: "3%"}} edge="end"><IconDownloadInactive/></Button>
                    </MenuItem>
                </Menu>
            </Grid>
            <Grid sx={{minHeight: "8vh"}}><CustomTypo text={"Join the call with " + json[0]?.name + ", " + json[0]?.job + " at " + json[0]?.society}></CustomTypo></Grid>
        </Grid>
        <Grid item style={{paddingTop: 0, textAlign: "center", display: "flex", justifyContent: "center"}}>
            <Grid sx={{position: "relative"}}>
                {camera ? <><Webcam ref={webcam} audio={false} className="video-responsive-Smartphone" /><NameBanner name={changeName(yourName)} end={audio}/></> : <><video className="video-responsive-Smartphone" id="fintaWebcam"/><NameBanner name={yourName} end={audio}/></>}
            </Grid>
        </Grid>
        <Grid sx={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: "4vh"}}>
            <Button variant="rounded" sx={{backgroundColor: "#5e0505", borderRadius: "15px", color: "white", paddingLeft: "4vh", paddingRight: "4vh", '&:hover': {backgroundColor: "#5e0505", border: "solid 1px red"}}} onClick={() => exitBefore()}>Exit</Button>
            <Button variant="rounded" sx={{backgroundColor: "#176401", borderRadius: "15px", color: "white", paddingLeft: "4vh", paddingRight: "4vh", '&:hover': {backgroundColor: "#176401", border: "solid 1px green"}}} onClick={() => sendSettings()}><Link to={`${loc}call`}>Join</Link></Button>
        </Grid>
        </>
    ))
}