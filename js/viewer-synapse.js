//
// synapse-viewer
//
// This is very dataset specific information
// for, USC
//
// the data csv file is assume to have a 'X','Y', and 'Z' column
// to be used for plotting the points(markers)

// these are per data file
var initStepX=[];  //
var initStepY=[];  //
var initStepZ=[];  //
var initSize=[];    // size(pixel) of the marker
var initOpacity=[]; // opacity of the marker
var initColor=[];   // color of the marker
var initAlias=[];   // alias for each dataset to be used as label
var initTitle=[];   // title to be used for subplots/or main scatter plot
var initHeatOn=[];  // column label to be used to create heat scale ('raw core') 
var myColor=[];  // color to be used - merged from initColor&defaultColor
                 // when there no user color is supplied
var  saveRangeX;
var  saveRangeY;
var  saveRangeZ;

var saveSpan=[];

// setup to be the last one that were used
function setupInitValues(idx)
{
if(initStepX[idx]==undefined) {
  if(initStepX.length > 0) {
    var p=initStepX.slice(-1).pop();
    initStepX[idx] = p;
    } else {
      initStepX[idx]=1;
  }
}
if(initStepY[idx]==undefined) {
  if(initStepY.length > 0) {
    var p=initStepY.slice(-1).pop();
    initStepY[idx] = p;
    } else {
      initStepY[idx]=1;
  }
}
if(initStepZ[idx]==undefined) {
  if(initStepZ.length > 0) {
    var p=initStepZ.slice(-1).pop();
    initStepZ[idx] = p;
    } else {
      initStepZ[idx]=1;
  }
}
if(initSize[idx]==undefined)
  initSize[idx]=1;
if(initOpacity[idx]==undefined)
  initOpacity[idx]=1;
if(initAlias[idx]==undefined)
  initAlias[idx]=("foo"+idx);
if(initHeatOn[idx]==undefined)
  initHeatOn[idx]=('raw core');
}

//new parameters (per url file)
// (microns-per-pixel/microns-per-step), 
// stepX=0.26, stepY=0.26, stepZ=0.4
// size=3, 
//   example value really does mean 0.4 micron steps in Z (400
//   nanometer) and 0.26 micron steps in X and Y (260 nanometer).
// also, alias  to supplement the filestub as trace-name
function processArgs(args) {
  var trackidx=null;     // 
  var hasidx=false;   // backward compatiable when there is no idx setting
  var urls=[];
  var params = args[1].split('&');
  for (var i=0; i < params.length; i++) {
    var param = unescape(params[i]);
    if (param.indexOf('=') == -1) {
      var tmp=param.replace(new RegExp('/$'),'').trim();
      urls.push(tmp);
      } else {
        var kvp = param.split('=');

var myProcessArg=function(kvp0, kvp1) {
  switch(kvp0.trim()) {
    case 'label': // to track iframelabel
      {
        var t=trimQ(kvp1);
//window.console.log("got label..", t);
        initLabel=t;
        break;
      }
    case 'idx':
      {
        hasidx=true;
        var t=parseInt(kvp1);
        if(!isNaN(t)) {
          trackidx=t;
        }
        break;
      }
    case 'url':
      {
      var tmp=kvp1.replace(new RegExp('/$'),'').trim();
      // setup all the init values for this url
      if(!hasidx) { // idx is optional in runurl
            // need to increment manually
        if(trackidx==null)
          trackidx=0;
          else trackidx++;
      }
      urls[trackidx]=tmp;
      setupInitValues(trackidx); 
      break;
      }
    case 'stepX': 
             {
             var t=parseFloat(kvp1);
             if(!isNaN(t)) {
               initStepX[trackidx]=t;
             }
             break;
             }
    case 'stepY': 
             {
             var t=parseFloat(kvp1);
             if(!isNaN(t)) {
               initStepY[trackidx]=t;
             }
             break;
             }
    case 'stepZ': 
             {
             var t=parseFloat(kvp1);
             if(!isNaN(t)) {
               initStepZ[trackidx]=t;
             }
             break;
             }
    case 'size': 
             {
             var t=parseInt(kvp1);
             if(!isNaN(t)) {
               initSize[trackidx]=t;
             }
             break;
             }
    case 'opacity': 
             {
             var t=parseFloat(kvp1);
             if(!isNaN(t)) {
               initOpacity[trackidx]=t;
             }
             break;
             }
    case 'alias': 
             {
             var t=trimQ(kvp1);
             initAlias[trackidx]=t;
             break;
             }
    case 'color': 
             {
             var t=trimQ(kvp1);
             initColor[trackidx]=t;
             break;
             }
    case 'title': 
             {
             var t=trimQ(kvp1);
             initTitle.push(t);
             break;
             }
    case 'heat': 
             {
             var t=trimQ(kvp1);
             initHeatOn[trackidx]=t;
             break;
             }
    case 'heatOn': // use heatmap version as initial state 
             {
             var t=trimQ(kvp1);
             if(t == 'true') {
               START_HEATMAP=true;
             }
             break;
             }
    case '3dOn':
             {
             var t=trimQ(kvp1);
             if(t == 'true') {
               threeDON=true;
             }
             break;
             }
    case "runurl":
             {
             var furl=trimQ(kvp1);
             var t=ckExist(furl);
             hasidx=false;
             trackidx=null;
             myProcessArg('meta', t);
             break;
             }
    case "metaurl":
             {
             var furl=trimQ(kvp1);
             var t=ckExist(furl);
             myProcessArg('meta', t);
             break;
             }
    case "meta":
             {
             var t=trimQ(kvp1);
             var items = JSON.parse(t);
             for( var pidx in items ) {
                var p=items[pidx]; // for a single plot
// process idx first if it exists
                var tt=p['idx'];
                if(tt != undefined) {
                  myProcessArg('idx',tt);
                  delete p['idx'];
                }
// special case,  if there is no url in here, stuff in a dummy one
                var t=p['url'];
                if(t == undefined) {
                  myProcessArg('url',"dummy.csv");
                }
                for(var tidx in p ) {
                   var t=p[tidx]; // for a single plot
                   myProcessArg(tidx, t);
                }
             }
             break;
             }
    default: { 
//window.console.log("dropping this...",kvp0.trim());
             /* drop this..*/
             break;
             }
    }
};// myProcessArg

      myProcessArg(kvp[0], kvp[1]);
    }
  }
  return urls;
}

// pick up the key term of every item in array  
function getOriginalDataByKey(data,key) {
   var alist=data.map(function(k) { return k[key]; } );
   return alist;
}

function trimQ(alias) {
  var str=alias.trim(); // trim the ' or "
  if( (str[0] == "\"" && str[ str.length-1 ] == "\"")
   || (str[0] == "\'" && str[ str.length-1 ] == "\'"))
  str=str.substr(1,str.length-2);
  return str;
}

// given an array of values, return an array of log values
function logValue(data) {
  var n = data.map(function (v) {
    return (Math.round(Math.log10(v)*10000)/10000);
  });
  return n;
}

// csv
function chopForStub(url){
  var s=url.split('/').pop();
  var ss=s.slice(0, -4);
  return ss;
}

function markerSize(s) {
   if(initSize.length ==0 || initSize.length <= s ) {
     return 2; 
   } else {
     return initSize[s];
   }
}

function useHeatTerm(s) {
   if(initHeatOn.length==0 || initHeatOn.length <= s)
     return 'raw core'; 
   else 
     return initHeatOn[s];
}

function markerOpacity(s) {
   if(initOpacity.length==0 || initOpacity.length <= s)
     return 1; 
   else 
     return initOpacity[s];
}

// mainly for suplots because the threeD plot can only
// use 1 set of Aspects and everyone conforms to it.
function polishAspects(s) {
//window.console.log("aspects.. for ",s);
  if(initStepX.length == 0) {
//window.console.log("aspects.. using default");
    return [1, 1, 1];
  }

  var t=s;
  if(t >= initStepX.length) {
    t=0;
  }

  var stepX=initStepX[t];
  var stepY=initStepY[t];
  var stepZ=initStepZ[t];

  var min=Math.min.apply(Math,[stepX,stepY,stepZ]);
  return [stepX/min, stepY/min, stepZ/min ];
}

function convert2micron(data, s) {
  if(initStepX.length == 0)
    return;
  var t=s;
  // out of range, use the first set
  if( t >= initStepX.length) {
    t=0;
  }
  
  var stepX=initStepX[t];
  var stepY=initStepY[t];
  var stepZ=initStepZ[t];

  if(stepX == 1 && stepY == 1 && stepZ == 1)
    return;

  for(var i=0; i<data.length; i++) {
    data[i]['X']= data[i]['X'] * stepX;
    data[i]['Y']= data[i]['Y'] * stepY;
    data[i]['Z']= data[i]['Z'] * stepZ;
  }
}

function findCenter(data) {
  var xlist=data.map(function(k) { return k['X']; } );
  var _maxX=Math.max.apply(Math,xlist);
  var _minX=Math.min.apply(Math,xlist);
  var _spanX=(_maxX - _minX)/2 + _minX;
  var ylist=data.map(function(k) { return k['Y']; } );
  var _maxY=Math.max.apply(Math,ylist);
  var _minY=Math.min.apply(Math,ylist);
  var _spanY=(_maxY - _minY)/2 + _minY;
  var zlist=data.map(function(k) { return k['Z']; } );
  var _maxZ=Math.max.apply(Math,zlist);
  var _minZ=Math.min.apply(Math,zlist);
  var _spanZ=(_maxZ - _minZ)/2 + _minZ;
  return [_spanX, _spanY, _spanZ];
}

function translate2Center(data) {
  var c=findCenter(data);
  var _spanX=c[0];
  var _spanY=c[1];
  var _spanZ=c[2];
  var cnt=data.length;
  for(var i=0; i<cnt; i++) {
    data[i]['X']= data[i]['X'] - _spanX;
    data[i]['Y']= data[i]['Y'] - _spanY;
    data[i]['Z']= data[i]['Z'] - _spanZ;
  }
//  window.console.log("center spaning..",_spanX," ",_spanY," ",_spanZ);
  saveSpan.push({X:_spanX, Y:_spanY, Z:_spanZ});
}

function getMyColor(i) {
  return myColor[i];
}

function loadAndProcessCSVfromFiles(urls) {
  var nlist=[];
  var ucnt=urls.length;
  for( var i=0; i < ucnt; i++ ) {
      var url=urls[i];
      var csv=ckExist(url);
      $.csv.toObjects(csv, {}, function(err, data) {
//        for(var i=0, len=data.length; i<len; i++) { console.log(data[i]); }
        // check for the first row, which has funny data..
        // X="(core, vincinity, zerolvl, toplvl, transp):"
        // Y="parameters"
        // Z="saved"
        if(data.length == 0) {
          alertify.error("Fail: can not access ",url);
          return nlist;
        }
        if(data[0]['Z'] == "saved") {
//window.console.log("found a comment line..");
          data.splice(0,1);
        }
/* -- skip this since the file got preprocessed
// filter all rows with override not 7 
        {
          var cnt=data.length;
          for(var i=0;;) {
            var v=data[i]['override'];
            if(v != "7") {
              data.splice(i,1);
              cnt--;
              } else {
              i++;
            }
            if(i >= cnt) {
              break;
            }
          }
        }
*/
// convert X,Y,Z to micron world..
        convert2micron(data, i);
        translate2Center(data);
        initPlot_data.push(data);
      });

      var color=getDefaultColor(i);
      if(initColor.length > i && initColor[i]!=undefined) {
        color=initColor[i];
      }
      myColor.push(color);
      var fstub=chopForStub(url);
      if(initAlias.length > i && initAlias[i]!=undefined) {
        fstub=initAlias[i];
      }
      nlist.push(fstub);
  }

// in case that this is multiplot and doing 3dOn
// readjust all the initPlot_data
  if(ucnt > 1 && threeDON) {
// new center -- use first plot
     var nc=saveSpan[0];
     var newX=nc['X'];
     var newY=nc['Y'];
     var newZ=nc['Z'];
//window.console.log("new center is..", newX, " ", newY," ",newZ);
// adjust data
     for(var j=1; j<ucnt; j++) {
        var oc=saveSpan[j];
        var oldX=oc['X'];
        var oldY=oc['Y'];
        var oldZ=oc['Z'];
//window.console.log("old center is..",oldX, " ", oldY, " ", oldZ);
        var deltaX=oldX-newX;
        var deltaY=oldY-newY;
        var deltaZ=oldZ-newZ;
//window.console.log("delta is..",deltaX, " ", deltaY, " ", deltaZ);
        var data=initPlot_data[j];
        var dcnt=data.length;
//window.console.log("number of data..",dcnt);
        for(var k=0; k<dcnt; k++) {
          data[k]['X']= data[k]['X'] + deltaX;
          data[k]['Y']= data[k]['Y'] + deltaY;
          data[k]['Z']= data[k]['Z'] + deltaZ;
        }
         
     }
  }

  var mm=getMinMax(initPlot_data);
  saveRangeX=mm[0];
  saveRangeY=mm[1];
  saveRangeZ=mm[2];
  return nlist;
}



// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
 // okay
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
}

/**************************************************************************
  sample examples

http://localhost/synapse-viewer/view.html?
  url=http://localhost/data/synapse/set/CropImgZfZdu20160825A4A.segments-only.csv&
  color=green&
  size=1&
  stepX=0.26&
  stepY=0.26&
  stepZ=0.4&
  title='Title of the plot'

http://localhost/synapse-viewer/view.html?
  url=http://localhost/data/synapse/segment1.csv&
  url=http://localhost/data/synapse/segment2.csv&
  url=http://localhost/data/synapse/segment3.csv&
  url=http://localhost/data/synapse/segment4.csv&
  stepX=0.26&
  stepY=0.26&
  stepZ=0.4&
  size=3&
  opacity=0.7&
  alias="first one"&
  alias="second file"&
  size=7&opacity=0.4&
  stepX=0.26&
  stepY=0.26&
  stepZ=0.6&
  alias="third"&
  size=2&
  opacity=0.8&
  color='orange'&
  color='red'&
  heat='raw core'&
  heatOn=true


meta = [ {"idx": 0, "url": url, "title": ..., "stepX": ..., "stepY": ..., "stepZ": ...,
         "size": ..., "opacity": ..., "color": ..., "hash": ...  },
         {"idx": 1, "url": url2, "title": ..., "stepX": ..., "stepY": ..., "stepZ": ...,
         "size": ..., "opacity": ..., "color": ..., "hash": ...  }
       ]; 

http://localhost/synapse-viewer/view.html?meta=[{"url":"http://localhost/data/synapse/save-old.csv"}]

http://localhost/synapse-viewer/view.html?meta=[{"idx":0, "url":"http://localhost/data/synapse/save-old.csv","stepX":0.26,"stepY":0.26,"stepZ":0.4,"size":2,"color":"blue"}]

http://localhost/synapse-viewer/view.html?meta=[
{"idx":0,"url":"http://localhost/data/synapse/segment2.csv","stepX":0.26,"stepY":0.26,"stepZ":0.4,"size":1,"color":"green"},
{"idx":1,"url":"http://localhost/data/synapse/segment4.csv","stepX":0.26,"stepY":0.26,"stepZ":0.4,"size":2,"color":"blue"}]

**************************************************************************/
