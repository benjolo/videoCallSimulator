
function doExit(){
  
    //note use of short-circuit AND. If the user reached the end, don't prompt.
    //just exit normally and submit the results.
    ScormProcessSetValue("cmi.exit", "");
    ScormProcessSetValue("adl.nav.request", "exitAll");
    
    doUnload();
    
  }
  
  function doUnload(){
    
    //record the session time
    var endTimeStamp = new Date();
    var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
    var scormTime = ConvertMilliSecondsIntoSCORM2004Time(totalMilliseconds);
    
    ScormProcessSetValue("cmi.session_time", scormTime);
    
    //always default to saving the runtime data in this example
    ScormProcessSetValue("cmi.exit", "suspend");
    
    ScormProcessTerminate();
  }
  
  function ConvertMilliSecondsIntoSCORM2004Time(intTotalMilliseconds){
      
    var ScormTime = "";
    
    var HundredthsOfASecond;	//decrementing counter - work at the hundreths of a second level because that is all the precision that is required
    
    var Seconds;	// 100 hundreths of a seconds
    var Minutes;	// 60 seconds
    var Hours;		// 60 minutes
    var Days;		// 24 hours
    var Months;		// assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
    var Years;		// assumed to be 12 "average" months
    
    var HUNDREDTHS_PER_SECOND = 100;
    var HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
    var HUNDREDTHS_PER_HOUR   = HUNDREDTHS_PER_MINUTE * 60;
    var HUNDREDTHS_PER_DAY    = HUNDREDTHS_PER_HOUR * 24;
    var HUNDREDTHS_PER_MONTH  = HUNDREDTHS_PER_DAY * (((365 * 4) + 1) / 48);
    var HUNDREDTHS_PER_YEAR   = HUNDREDTHS_PER_MONTH * 12;
    
    HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);
    
    Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
    HundredthsOfASecond -= (Years * HUNDREDTHS_PER_YEAR);
    
    Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
    HundredthsOfASecond -= (Months * HUNDREDTHS_PER_MONTH);
    
    Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
    HundredthsOfASecond -= (Days * HUNDREDTHS_PER_DAY);
    
    Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
    HundredthsOfASecond -= (Hours * HUNDREDTHS_PER_HOUR);
    
    Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
    HundredthsOfASecond -= (Minutes * HUNDREDTHS_PER_MINUTE);
    
    Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
    HundredthsOfASecond -= (Seconds * HUNDREDTHS_PER_SECOND);
    
    if (Years > 0) {
      ScormTime += Years + "Y";
    }
    if (Months > 0){
      ScormTime += Months + "M";
    }
    if (Days > 0){
      ScormTime += Days + "D";
    }
    
    //check to see if we have any time before adding the "T"
    if ((HundredthsOfASecond + Seconds + Minutes + Hours) > 0 ){
      
      ScormTime += "T";
      
      if (Hours > 0){
        ScormTime += Hours + "H";
      }
      
      if (Minutes > 0){
        ScormTime += Minutes + "M";
      }
      
      if ((HundredthsOfASecond + Seconds) > 0){
        ScormTime += Seconds;
        
        if (HundredthsOfASecond > 0){
          ScormTime += "." + HundredthsOfASecond;
        }
        
        ScormTime += "S";
      }
      
    }
    
    if (ScormTime == ""){
      ScormTime = "0S";
    }
    
    ScormTime = "P" + ScormTime;
    
    return ScormTime;
  }

function changeName(name){
  if(isLocalSession)
    return(name);
  else
  {
    let nameArray = name.split(", ");
    let firstName = nameArray[1];
    let lastName = nameArray[0];

    if(name.length > 15)
      ret = firstName + " " + lastName[0] + ".";
    else
      ret = firstName + " " + lastName;
    return(ret);
  }
  return(name);
}