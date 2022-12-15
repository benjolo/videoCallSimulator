

const VideoOn = () => {
    return (
        <i class="bi bi-camera-video-fill" style={{color: "white"}}></i> 
    )
}
const VideoOff = () => {
    return (
        <i class="bi bi-camera-video-off-fill" style={{color: "grey"}}></i> 
    )
}
const AudioOn = (props) => {
    const {size} = props;
    return (
        <i class="bi bi-mic-fill" style={{color: "white", fontSize: `${size}rem`}}></i> 
    )
}
const AudioOff = (props) => {
    const {size, color} = props;
    return (
        <i class="bi bi-mic-mute-fill" style={{color: color ? color : "grey", fontSize: `${size}rem`}}></i> 
    )
}
const DownloadScriptInactive = () => {
    return (
        <i class="bi bi-file-earmark-arrow-down-fill" style={{color: "grey"}}></i>
    )
}
const DownloadScriptActive = () => {
    return (
        <i class="bi bi-file-earmark-arrow-down-fill" style={{color: "white"}}></i>
    )
}

const IconDownloadActive = () => {
    return (
        <i class="bi bi-download" style={{color: "white"}}></i>
    )
}
const IconDownloadInactive = () => {
    return (
        <i class="bi bi-download" style={{color: "grey"}}></i>
    )
}

const VolumeIconDown = () => {

    return (
        <i class="bi bi-volume-mute" style={{color: "white"}}></i>
    )
}

const VolumeIconUp = () => {
    return (
        <i class="bi bi-volume-up" style={{color: "white"}}></i>
    )
}
const VolumeIconDownGrey = () => {

    return (
        <i class="bi bi-volume-mute" style={{color: "grey"}}></i>
    )
}

const VolumeIconUpGrey = () => {
    return (
        <i class="bi bi-volume-up" style={{color: "grey"}}></i>
    )
}

const GetPercentage = (props) => {
    const {percentage, maxPercentage} = props;
    let res = (percentage * 100) / maxPercentage;
    return (
        <Typography variant="h3" sx={{color: "white", fontSize: "1.2rem", textAlign: "center"}}>
            {Math.floor(res)}%
        </Typography>
    )
}

const CustomTypo = (props) => {
    const {text} = props;

    let size = text.length < 70 ? "1.5rem" : text.length < 150 ? "1.2rem" : "1rem";
    return (
        <Typography variant="h3" sx={{color: "white", fontWeight: "bold", fontSize: size, textAlign: "center", paddingBottom: "2%"}}>
            {text}
        </Typography>
    )
}

const SettingIcon = () => {
    return (
        <i class="bi bi-gear" style={{color: "white"}}></i>
    )
}

const ToolsIcon = () => {
    return (
        <i class="bi bi-tools" style={{color: "white"}}></i>
    )
}

const Logo = () => {
	return(
        <h1>Logo</h1>
		// <img src="media/logo.png"></img> put your logo here
	)

}

const NameBanner = (props) => {
    
        const {name, end} = props;
    
        return (
            <Grid container item sx={{justifyContent: "center", outlineStyle: "solid", outlineColor: "grey", outlineWidth: "0.5px", backgroundColor: "#0b22398c", paddingRight: "0.5%", paddingLeft: "0.5", width: "auto", top: "0", left: "0", position: "absolute", borderRadius: "3px", width: "auto", minWidth: "10%", paddingLeft: "0.5", justifyContent: "space-between", alignItems: "center"}}>
                <Typography style={{color: "white"}}>{name}</Typography>
                <ListItemIcon sx={{minWidth: "3vh", justifyContent: "flex-end"}}>
                {!end ? <AudioOff size={1} color={"white"}/> : <AudioOn size={1}/>}
                </ListItemIcon>
            </Grid>
        )
    }