const { jsPDF } = window.jspdf;

const Call = (props) => {
    const webcam = React.useRef();
    const video = React.useRef();
    const { audioOn, videoOn, json, device, yourName } = props;
    const [camera, setCamera] = React.useState(videoOn);
    const [audio, setAudio] = React.useState(audioOn);
    const [script, setScript] = React.useState(false);
    const [end, setEnd] = React.useState(false);
    const [it, setIt] = React.useState(ScormProcessGetValue("cmi.location") ? parseInt(ScormProcessGetValue("cmi.location")) : 0);
    const [numQuest, setNumQuest] = React.useState(ScormProcessGetValue("cmi.learner_preference.audio_captioning") ? parseInt(ScormProcessGetValue("cmi.learner_preference.audio_captioning")) + 2 : 2);
    const [quest, setQuest] = React.useState(ScormProcessGetValue("cmi.location") ? json[parseInt(ScormProcessGetValue("cmi.location"))].quest[numQuest].text : "");
    const [loading, setLoading] = React.useState(false);
    const [avatar, setAvatar] = React.useState(true);
    const [play, setPlay] = React.useState(true);
    const [testo, setTesto] = React.useState(ScormProcessGetValue("cmi.suspend_data") ? ScormProcessGetValue("cmi.suspend_data") : "");
    const [volume, setVolume] = React.useState(50);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const doc = new jsPDF();
    history.pushState(null, null, location.href);
  	window.onpopstate = () => {history.go(1);};

    const handleAnchor = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    function changeVolume(e, value) {
        document.getElementById("video").volume = value/100;
        setVolume(value);
    }

    function stopCamera() {
        if(camera)
        {
            let stream = webcam.current.stream ? webcam.current.stream : false;
            if(stream !== false){
                const tracks = stream.getTracks();
                if(tracks[1])
                    tracks[1].enabled = !camera;
                else
                    tracks[0].enabled = !camera;
            }
            setCamera(!camera);
        }else
            setCamera(!camera);    
    }

    function stopAudio() {
        setAudio(!audio);
    }

    const handleEnd = (e) => {
        setEnd(true);
        setIt(it + 1);
        if(it == json.length - 3)
            setScript(true);;
    }

    const handleClick = (e, text, q) =>
    {
        setQuest(text);
        setEnd(false);
        setNumQuest(q);
        let newText;
        if(it != json.length - 2)
        {
            newText = testo.concat(text.toUpperCase() + "\n \n" + json[it]?.quest[q].script + "\n \n \n")
            setTesto(newText);
        }
        if(!isLocalSession)
        {
            ScormProcessSetValue("cmi.learner_preference.audio_captioning", q - 2);
            ScormProcessSetValue("cmi.suspend_data", newText);
            ScormProcessSetValue("cmi.location", it);
        }
    }

    const endCall = () => {
        if (!isLocalSession)
        {
            ScormProcessSetValue("cmi.completion_status", "completed");
            ScormProcessSetValue("cmi.success_status", "passed");
            ScormProcessSetValue("cmi.exit", "");
            ScormProcessSetValue("adl.nav.request", "exitAll");
            doUnload();
        }
    }
    
    React.useEffect(() => {
        setTimeout(() => {setLoading(true)}, 2000);
        setTimeout(() => {setAvatar(false)}, 4000);
    }, []);

    const BButton = (props) => 
    {
        const {q} = props;
        let text = json[it]?.quest[q].text;
        let size = text.length < 50 ? "0.9rem" : text.length < 120 ? "0.8rem" : "0.65rem";
        return (
            <Grow in={true} timeout={q * 1000}>
                <Button onClick={(e) => {handleClick(e, json[it]?.quest[q].text, q)}} variant="outlined" sx={{margin: "1vh", color: "white", border: "3px solid white", fontSize: size,'&:hover': {border: '3px solid #0258a8'}, '&:focus': {backgroundColor: "#1c334a"}}}>{text}</Button>
            </Grow>
        )
    }


    function handleRew(){
        setIt(it - 1);
        setEnd(false);
    }

    function handlePlay(){
        if(!end)
        {
            setPlay(!play);
            if(play)
                document.getElementById("video").pause();
            else
                document.getElementById("video").play();
        }
    }

    function handleDownloadScript(){
        let str = "CALL TRANSCRIPTION WITH " + json[0]?.name.toUpperCase() + ", " + json[0].job.toUpperCase() + " AT " + json[0]?.society.toUpperCase() +  "\n\n\nINTRO\n\n" + json[0]?.script + "\n\n\n" + testo + "OUTRO \n \n" + json[json.length - 2]?.script;
        const pageHeight = doc.internal.pageSize.height;
        const wrappedText = doc.splitTextToSize(str, 180);
        doc.setFontSize(15);
        let iterations = 1; // we need control the iterations of line
        const margin = 15; //top and botton margin in mm
        const defaultYJump = 5; // default space btw lines
        wrappedText.forEach((line, index) => {
            let posY = margin + defaultYJump * iterations++;

            if (posY > pageHeight - margin) {
              doc.addPage();
              iterations = 1;
              posY = margin + defaultYJump * iterations++;
            }
            doc.text(15, posY, line);
          });
        doc.save('Call-Transcription.pdf');
    }

    
    return (
        device === "desktop" ?
        !loading ? <></> : 
    (
        <>
            <Grid container xs={12} item style={{justifyContent: "center", minHeight: "7vh", marginBottom: "3vh"}}>
                { !end && it > 0 && it <= json.length - 3 && <Grow in={!end} direction="down" timeout={4000}><Grid><CustomTypo text={quest}/></Grid></Grow>}
            </Grid>
            <Grid container item spacing={3} sx={{alignContent: "flex-start"}}>
                <Grid item xs={2} sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", bgcolor: '#15191fb3'}} style={{paddingLeft: "5px", paddingTop: 0, borderRadius: "5px"}} >
                    <List
                    sx={{ width: '100%', maxWidth: 360}}
                    subheader={<ListSubheader sx={{bgcolor: '#1a1f25', borderRadius: "25%", color: 'white', display: "flex", justifyContent: "space-between", alignItems: "center"}}>Progress <GetPercentage percentage={it} maxPercentage={json.length - 2} /></ListSubheader>}
                    >
                    <Divider variant="inset" component="li" style={{borderColor: "#6c6b6b", marginLeft: "5%", marginRight: "5%"}}/>
                    <ListItem sx={{justifyContent:'space-between'}}>
                        <ListItemIcon sx={{minWidth: "3vh"}}>
                        { end && it <= json.length - 3 ? <Button onClick={() => handleRew()} sx={{color: "white", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i className="bi bi-arrow-repeat"></i>}>Repeat</Button> : <Button sx={{color: "grey", textTransform: "none"}} startIcon={<i className="bi bi-arrow-repeat"></i>}>Repeat</Button>}
                        </ListItemIcon>
                        <ListItemIcon sx={{minWidth: "3vh"}}>
                        { play || !end && it > json.length ? <Button onClick={() => handlePlay()} sx={{color: end ? "grey" : "white", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i class="bi bi-pause-fill"></i>}>Pause</Button> : <Button  onClick={() => handlePlay()} sx={{color: end ? "grey" : "white", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i class="bi bi-play-fill"></i>}>Play</Button>}
                        </ListItemIcon>
                    </ListItem>
                    <Divider variant="inset" component="li" style={{margin: "1vh"}}/>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: "3vh", paddingRight: '1.5vh'}}>
                            <IconButton onClick={(e) => changeVolume(e, 0)}><VolumeIconDown /></IconButton>
                        </ListItemIcon>
                            <Slider sx={{color: 'white', '& .MuiSlider-thumb': { height: 12, width: 12}}}aria-label="Volume" value={volume} onChange={changeVolume} />
                        <ListItemIcon sx={{paddingLeft: '1.5vh', minWidth: "3vh"}}>
                        <IconButton onClick={(e) => changeVolume(e, 100)}><VolumeIconUp/></IconButton>
                        </ListItemIcon>
                    </ListItem>
                    </List>
                </Grid>
                <Grid item xs={8} sx={{textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center"}} style={{paddingLeft: 0, paddingTop: 0}}>
                    <Grid sx={{position: "relative"}}>
                        {it == 0 && avatar && <img src="./media/Avatar.png" className="video-responsive overlay"></img>}
                        {it == 0 && !avatar && <video ref={video} src={json[it]?.path} id="video" className="video-responsive" autoPlay onEnded={handleEnd}/>}
                        {it <= json.length - 3 && it != 0 && !avatar ? 
                        ( 
                            end ? 
                                <video src={json[json.length - 1]?.path} id="video" className="video-responsive overlay" autoPlay loop muted/> 
                                :
                                <video ref={video} src={json[it]?.quest[numQuest]?.path} id="video" className="video-responsive" autoPlay onEnded={handleEnd}/>
                        ) : (
                            end && <video ref={video} src={json[it]?.path} id="video" className="video-responsive" autoPlay/>
                        )
                        }
                        <NameBanner name={json[0].name + ", " + json[0].job + " at " + json[0].society} end={!end}/>
                    </Grid>
                </Grid>
                <Grid item xs={2} sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", bgcolor: '#15191fb3'}} style={{paddingLeft: "5px", paddingTop: 0, borderRadius: "5px"}}>
                    <List
                    sx={{ width: '100%', maxWidth: 360}}
                    subheader={<ListSubheader sx={{bgcolor: '#1a1f25', borderRadius: "25%", color: 'white', display: "flex", justifyContent: "space-between", alignItems: "center"}}>Settings</ListSubheader>}
                    >
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
                        { script ? <DownloadScriptActive/> : <DownloadScriptInactive/>}
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-bluetooth" primary="Transcription" style={{color: script ? "white" : "grey"}}/>
                        { script ? <Button edge="end"sx={{minWidth: "6vh"}} onClick={() => handleDownloadScript()} style={{color: "white"}}><IconDownloadActive/></Button> : <Button edge="end"sx={{minWidth: "6vh"}} onClick={() => console.log("ancora no")} style={{color: "grey"}}><IconDownloadInactive/></Button>}
                    </ListItem>
                    </List>
                    <div style={{paddingBottom: "2%"}}>
                        <Grid sx={{position: "relative"}}>
                            {camera ? <><Webcam ref={webcam} audio={false} className="webcam" id="webcam"/><NameBanner name={changeName(yourName)} end={audio}/></> : <><video width="640" height="480" className="webcam" id="webcam"/><NameBanner name={yourName} end={audio}/></>}
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            { it == json.length - 2 && end ? 
            (
            <Grid container item sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}} spacing={2}>
                <Grid item xs={10} style={{padding: "1%", display: "flex", borderRadius: "5px"}}/>
                <Grid item xs={2} spacing={3} sx={{display: "flex", justifyContent: "space-around"}}>
                    <Button variant="rounded" sx={{backgroundColor: "#5e0505", borderRadius: "15px", color: "white", paddingLeft: "4vh", paddingRight: "4vh", '&:hover': {backgroundColor: "#5e0505", border: "solid 1px red"}}} onClick={() => endCall()}>Leave</Button>
                </Grid>
            </Grid>
            ) : (
            <Grid container item sx={{justifyContent: "center", paddingTop: "3%", flexWrap: "nowrap"}}>
                { end && it <= json.length - 3 ? 
                (
                    <>{json[it]?.quest?.map((q, i) => {return(<><BButton q={i}></BButton></>)})}</>
                ) : (
                    <div style={{minHeight: "10vh"}}></div>
                )}
            </Grid>
            )}
        </>
    ) : (
        <>
            <Grid container item style={{justifyContent: "center", flexDirection: "column"}}>
                <Grid sx={{display: 'flex', justifyContent: "space-between", alignItems: "center", flexDirection: "row-reverse"}}>
                    <Button type="" sx={{cursor: "none"}}>
                        <GetPercentage percentage={it} maxPercentage={json.length - 2}/>
                    </Button>
                    <ListItemIcon sx={{minWidth: "3vh"}}>
                        { end && it <= json.length - 3 ? <Button onClick={() => handleRew()} sx={{color: "white", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i className="bi bi-arrow-repeat"></i>}>Repeat</Button> : <Button sx={{color: "grey", textTransform: "none"}} startIcon={<i className="bi bi-arrow-repeat"></i>}>Repeat</Button>}
                    </ListItemIcon>
                    <ListItemIcon sx={{minWidth: "3vh"}}>
                        { play || !end && it > json.length ? <Button onClick={() => handlePlay()} sx={{color: end ? "grey" : "white", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i class="bi bi-pause-fill"></i>}>Pause</Button> : <Button  onClick={() => handlePlay()} sx={{color: end ? "grey" : "white", textTransform: "none", '&:hover':{backgroundColor: "#80808047"}}} startIcon={<i class="bi bi-play-fill"></i>}>Play</Button>}
                    </ListItemIcon>
                    <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleAnchor}>
                        <SettingIcon/>
                    </Button>
                    <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button'}} sx={{'.MuiMenu-paper': {backgroundColor: '#1a1f25'}}}>
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
                            { script ? <DownloadScriptActive/> : <DownloadScriptInactive/>}
                            </ListItemIcon>
                            <ListItemText id="switch-list-label-bluetooth" primary="Transcription" style={{color: script ? "white" : "grey"}}/>
                            { script ? <Button edge="end"sx={{minWidth: "6vh"}} onClick={() => handleDownloadScript()} style={{color: "white"}}><IconDownloadActive/></Button> : <Button edge="end"sx={{minWidth: "6vh"}} onClick={console.log("ancora no")} style={{color: "grey"}}><IconDownloadInactive/></Button>}
                        </MenuItem>
                    </Menu>
                </Grid>
                {!end && it > 0 && it <= json.length - 3 ? <Grow in={!end} direction="down" timeout={4000}><Grid sx={{minHeight: "8vh"}}><CustomTypo text={quest}/></Grid></Grow> : <Grid sx={{minHeight: "8vh"}}></Grid>}
            </Grid>
            <Grid item style={{paddingTop: 0, textAlign: "center", display: "flex", justifyContent: "center"}}>
                <Grid sx={{position: "relative"}}>
                {it == 0 && avatar && <img src="./media/Avatar.png" className="video-responsive-Smartphone overlay"></img>}
                {it == 0 && !avatar && <video ref={video} src={json[it]?.path} id="video" className="video-responsive-Smartphone" autoPlay onEnded={handleEnd}/>}
                {it <= json.length - 3 && !avatar && it != 0 ? 
                ( end ? 
                    <video src={json[json.length - 1]?.path} id="video" className="video-responsive-Smartphone overlay" autoPlay loop/> 
                    :
                    <video ref={video} src={json[it]?.quest[numQuest]?.path} id="video" className="video-responsive-Smartphone" autoPlay onEnded={handleEnd}/>
                    ) : ( 
                    end && 
                        <video ref={video} src={json[it]?.path} id="video" className="video-responsive-Smartphone" autoPlay/>
                    )
                    }
                    <NameBanner name={json[0].name} end={!end}/>     
                    {camera ? <Webcam ref={webcam} audio={false} className="webcamSmartphone" id="webcam"/> : <video width="640" height="480" className="webcamSmartphone" id="fintaWebcam"/>}
                </Grid>
            </Grid>
            { it == json.length - 2 && end ? (
            <Grid sx={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: "4vh"}}>
                <Button variant="rounded" sx={{backgroundColor: "#5e0505", borderRadius: "15px", color: "white", paddingLeft: "4vh", paddingRight: "4vh", '&:hover': {backgroundColor: "#5e0505", border: "solid 1px red"}}} onClick={() => endCall()}>Leave</Button>
            </Grid>
            ) : (
            <Grid container item sx={{justifyContent: "center", paddingTop: "3%", flexWrap: "nowrap", flexDirection: "column"}}>
            { end && it <= json.length - 3 ? (
                <>{json[it]?.quest?.map((q, i) => {return(<><BButton q={i}></BButton></>)})}</>
            ) : (
                <div style={{minHeight: "10vh"}}></div>
            )}
            </Grid>
            )}
        </>
    ))
}