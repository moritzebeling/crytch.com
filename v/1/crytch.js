// C R Y T C H
// Encrypt a Sketch at crytch.com
// Concept by Leon Plum & Mori Waan
// Code by Mori Waan, Typeface by Leon Plum
// 2016 Bauhaus University Weimar, Germany

// works with paper.js
// We <3 Jürg Lehni


// C O N F I G - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function setCookie(cname,cvalue,exdays){ var d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000)); var expires = "expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + "; " + expires;}
var windowwidth = $(window).width(); var windowheight = $(window).height();
// install paper js
paper.install(window);
// define global vars
var tool_pen, tool_text, tool_move, tool_encrypt,
	layer_interface, layer_pen, layer_text, layer_conserve,
	cursor, pathpreview, segmenthighlight, msg_url;
var compressed = false;
// setup gridsize and pathstyle
var gridsize = 15;
var pathstyle = {
	strokeColor: 'black',
	strokeWidth: 2,
	strokeCap: 'round',
	strokeJoin: 'round'
};
var pathselected = false;
var homepos = new Point(-20,-20);
var homepos_cursor = {x:50,y:80};

// start paperjs
window.onload = function(){ // will be closed at end of document
paper.setup('graph');

// S T A R T - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Ini tools and first pentool (pentool is default)
tool_pen = new Tool();
tool_text = new Tool();
tool_move = new Tool();
tool_encrypt = new Tool();
tool_notool = new Tool();
// create layer for interface operations
layer_interface = new Layer();
layer_interface.name = 'interface';
// create layer for message
layer_conserve = new Layer();
layer_conserve.visible = false;
layer_pen = new Layer(); layer_pen.name = 'canvas';
layer_text = new Layer(); layer_text.name = 'canvas';
layer_interface.sendToBack();

var letterscale = 1;
var letterspacing = gridsize;
var letterwidth = 3;
var ascheight = 7;
var lineheight = gridsize*8;

// F U N C T I O N S - - - - - - - - - - - - - - - - - - - - - - - - - - -
function rand(min, max) { return Math.floor(Math.random() * (max - min +1)) + min; }
function snap(x, div) { return Math.round(x/div)*div; }
function Cursor(option,to){
	if(!cursor){ option = 'create'; }
	if(option == 'moveto'){ cursor.position = to; return true; }
	if(option == 'backspace'){
		if(to){ cursor.position = to; return cursor.position;
		} else {
			// to jump backwards you shomehow need 5 instead of 3 ?!
			option = 'move'; to = -5;
		}
	}
	if(option == 'space'){ option = 'move'; to = 3; }
	if(option == 'move'){
		if(!to){ var to = 3; }
		if(to < gridsize && to > (0-gridsize) ){ var to = to*gridsize; }
		cursor.position.x = cursor.position.x + to + (letterspacing*letterscale);
		if(cursor.position.x > (windowwidth-((letterwidth+2)*gridsize)) ){
			option = 'jumpline';
		}
		if(cursor.position.x < snap(homepos_cursor.x, gridsize) ){
			option = 'jumpline'; to = 'up';
		}
	}
	if(option == 'jumpline'){
		cursor.position.x = snap(homepos_cursor.x, gridsize);
		if(to == 'up'){
			cursor.position.y = cursor.position.y - ((lineheight+gridsize)*letterscale);
			if(cursor.position.y < snap(homepos_cursor.y, gridsize)){
				cursor.position.y = snap(homepos_cursor.y, gridsize);
			}
		} else { cursor.position.y = cursor.position.y + ( (lineheight+gridsize)*letterscale); }
		return cursor.position;
	}
	if(option == 'show'){ cursor.visible = true; return true; }
	if(option == 'hide'){ cursor.visible = false; return true; }
	if(option == 'create'){
		cursor = new Path({segments:[[0, 0],[0, 7]], strokeColor:'#bbbbbb', strokeWidth:3, strokeCap:'round'});
		layer_interface.addChild(cursor);
		cursor.pivot = new Point(0,0);
		cursor.scale(gridsize*1);
		cursor.visible = false;
		option = 'reset';
	}
	if(option == 'reset'){
		cursor.position = new Point(snap(homepos_cursor.x, gridsize),snap(homepos_cursor.y, gridsize)); return true;
	}
	return cursor.position;
}
function PreviewPath(option,lastDock,MousePos){
	if(!pathpreview){ option = 'create'; }
	if(option == 'update'){
		pathpreview.lastSegment.point = MousePos;
		pathpreview.firstSegment.point = lastDock;
		pathpreview.visible = true;
		return true;
	}
	if(option == 'show'){ pathpreview.visible = true; return true; }
	if(option == 'hide'){ pathpreview.visible = false; return true; }
	if(option == 'reset'){
		pathpreview.visible = false;
		pathpreview.firstSegment.point = homepos;
		pathpreview.lastSegment.point = homepos;
		return true;
	}
	if(option == 'create'){
		pathpreview = new Path({segments:[homepos,homepos], strokeColor:'#bbbbbb', strokeWidth:2, strokeCap:'round'});
		pathpreview.visible = false;
		layer_interface.addChild(pathpreview);
		return true;
	}
	return false;
}
function highlightSegment(option,pos){
	if(!segmenthighlight){ option = 'create'; }
	if(option == 'pos'){
		segmenthighlight.position = pos;
		segmenthighlight.visible = true;
		return true;
	}
	if(option == 'show'){ segmenthighlight.visible = true; return true; }
	if(option == 'hide'){ segmenthighlight.visible = false; return true; }
	if(option == 'reset'){
		segmenthighlight.visible = false;
		segmenthighlight.position = homepos;
		return true;
	}
	if(option == 'create'){
		segmenthighlight = new Path.Circle(homepos,4);
		segmenthighlight.fillColor = '#bbbbbb';
		segmenthighlight.visible = false;
		layer_interface.addChild(segmenthighlight);
		return true;
	}
	return false;
}
function startNewPath(){
	path = new Path();
	path.style = pathstyle;
	path.selected = pathselected;
	pathlength = 0;
	highlightSegment('show');
	PreviewPath('reset');
	console.log('new Path created');
}
function closePath(){
	if(!path){ return false; }
	path.closed = true;
	startNewPath();
}
function countAllPaths(){
	// not used
	var count1 = layer_pen.children.length;
	var count2 = layer_text.children.length;
	var countpaths = count1 + count2;
	return countpaths;
}
function colorx(choice){
	if(!choice || choice == ''){ choice = 'rand'; }
	if(choice == 'b'){ return '#000000'; }
	if(choice == 'w'){ return '#ffffff'; }
	if(choice == 'red'){ return '#ff0000'; }
	if(choice == 'blue'){ return '#0000ff'; }
	if(choice == 'rand'){ return '#'+Math.floor(Math.random()*16777215).toString(16); }
	return '#'+choice;
}
function reStyle(attr,val){
	console.log('restyle: '+attr+' val: '+val);
	if(attr == 'strokewidth'){
		var newwidth = val.replace(/\D/g,'');
		newwidth = parseInt(val);
		if(newwidth == ''){ newwidth = 2; } if(newwidth < 1){ newwidth = 1; } if(newwidth > 30){ newwidth = 30; }
		if(newwidth < 8){ letterspacing = gridsize; }
		else if(newwidth < 26){ letterspacing = 2*gridsize; }
		else{ letterspacing = 3*gridsize; }
		layer_text.strokeWidth = newwidth; layer_pen.strokeWidth = newwidth;
		pathstyle.strokeWidth = newwidth;
		view.update(true); return true;
	}
	if(attr == 'color'){
		var newcolor = colorx(val);
		layer_text.strokeColor = newcolor; layer_pen.strokeColor = newcolor;
		pathstyle.strokeColor = newcolor;
		view.update(true); return true;
	}
	if(attr == 'background'){
		var newcolor = colorx(val);
		$('body').css('background-color',newcolor);
		view.update(true); return true;
	}
	return false;
}
function popup(popup){
	if(!popup || popup == 'close'){
		$('#popups ul').hide();
		$('#popups').fadeOut();
		PreviewPath('show');
		return true;
	}
	$('#popups ul.'+popup).show();
	$('#popups').fadeIn();
	PreviewPath('hide');
	return true;
}
function setLanguage(lang){
	lang = lang.toLowerCase();
	lang = lang.substring(0,2);
	setCookie('language',lang,200);
	if($('body').hasClass('canvasfilled')){
		popup('change-on-reload');
	} else {
		location.reload();
	}
}
function canvasFilled(options){
	var ret = false;
	// layer pen
	var countpaths = layer_pen.children.length;
	for (var i=0; i < countpaths; i++) {
		if(layer_pen.children[i]){
		    var thispath = layer_pen.children[i];
		    if(thispath._segments){
			    var pathlength = thispath._segments.length;
			    if(pathlength > 1){
			    	// a path longer than 1 exists
			    	var ret = true;
			    } else {
			    	// delete path if shorter than 2
			    	if(options == 'deleteEmpty'){
						if(thispath.lastSegment){ thispath.lastSegment.remove();
						} else { thispath.remove(); }
					}
			    }
			} else {
				if(options == 'deleteEmpty'){ thispath.remove(); }
			}
		}
		var thispath = 0;
	}
	// layer text
	var countpaths = layer_text.children.length;
	for (var i=0; i < countpaths; i++) {
		if(layer_text.children[i]){
		    var thispath = layer_text.children[i];
		    if(thispath._segments){
			    var pathlength = thispath._segments.length;
			    if(pathlength > 1){
			    	// a path longer than 1 exists
			    	var ret = true;
			    } else {
			    	// delete path if shorter than 2
			    	if(options == 'deleteEmpty'){
						if(thispath.lastSegment){ thispath.lastSegment.remove();
						} else { thispath.remove(); }
					}
			    }
			} else {
				if(options == 'deleteEmpty'){ thispath.remove(); }
			}
		}
		var thispath = 0;
	}
	if(ret == true){
		// canvas is filled with pretty drawings
		if( !$('body').hasClass('canvasfilled') ){
			$('body').addClass('canvasfilled');
			$('menu a.clearall').removeClass('inactive');
			$('menu a.export-svg').removeClass('inactive');
			$('menu .encrypt').removeClass('inactive');
			$('menu#tools a.move').removeClass('inactive');
		}
		return true;
	}
	// canvas is empty
	$('body').removeClass('canvasfilled');
	$('menu a.clearall').addClass('inactive');
	$('menu a.export-svg').addClass('inactive');
	$('menu#tools a.move').addClass('inactive');
	$('menu#finish .contai').addClass('inactive').removeClass('active');
	return false;
}
function deleteObjects(object){
	if(object){
		object.remove();
		canvasFilled('deleteEmpty');
		return true;
	} else {
		return false;
	}
}
function moveWithSteps(object,dir){
	if(object.className == 'Path'){
		// is whole path
		if(dir == 'right'){ object.position.x += gridsize; return true; }
		if(dir == 'left'){ object.position.x -= gridsize; return true; }
		if(dir == 'up'){ object.position.y -= gridsize; return true; }
		if(dir == 'down'){ object.position.y += gridsize; return true; }
	} else {
		// is single segment
		if(dir == 'right'){ object.point.x += gridsize; return true; }
		if(dir == 'left'){ object.point.x -= gridsize; return true; }
		if(dir == 'up'){ object.point.y -= gridsize; return true; }
		if(dir == 'down'){ object.point.y += gridsize; return true; }	
	}
	return false;
}
function switchtool(tool){
	canvasFilled('deleteEmpty');
	PreviewPath('reset');

	if(tool == 'lastUsed' || tool == 'lastUsedStrict'){
		var lasttool = $('body').attr('data-toollastused');
		if(lasttool == 'text'){ tool = 'text'; }
		else if(lasttool == 'move'){ tool = 'move'; }
		else { tool = 'pen'; }		
	}
	console.log(tool+' tool');

	if(tool == 'encrypt' || tool == 'send'){
		$('menu#tools a').removeClass('active');
		$('menu#tools').addClass('inactive');
	} else {
		$('menu#tools').removeClass('inactive');
		$('menu#finish .contai').removeClass('active');
	}

	// switch to P E N tool
	if(tool == 'pen'){
		layer_pen.activate();
		tool_pen.activate();
		$('body').attr('data-tool','pen').attr('data-toollastused','pen');
		setCookie('toollastused','pen',1);

		$('menu a').not('.pen').removeClass('active');
		$('menu#tools a.pen').addClass('active');

		$('menu#about .context').not('.pen').hide();
		$('menu#about .context.pen').show();

		startNewPath();
	} else {
		highlightSegment('hide');
	}
	// swith to T E X T tool
	if(tool == 'text'){
		layer_text.activate();
		tool_text.activate();
		$('body').attr('data-tool','text').attr('data-toollastused','text');
		setCookie('toollastused','text',1);

		Cursor('show');
		$('menu a').not('.text').removeClass('active');
		$('menu#tools a.text').addClass('active');

		$('menu#about .context').not('.text').hide();
		$('menu#about .context.text').show();
	} else {
		Cursor('hide');
	}
	// switch to M O V E tool
	if(tool == 'move'){
		tool_move.activate();
		$('body').attr('data-tool','move');

		$('menu a').not('.move').removeClass('active').attr('data-toollastused','move');
		$('menu#tools a.move').addClass('active');

		$('menu#about .context').not('.move').hide();
		$('menu#about .context.move').show();
	}
	// switch to E N C R Y P T tool
	if(tool == 'encrypt'){
		console.log('pen layer');
		// console.log(layer_pen);
		// merge both layers
		var contentlayer_text = layer_text.children;
		layer_pen.addChildren(contentlayer_text);
		layer_text.removeChildren();
		// conserve
		layer_conserve = layer_pen.clone();

		layer_pen.activate();
		tool_encrypt.activate();
		$('body').attr('data-tool','encrypt');

		$('menu#finish .encrypt').removeClass('inactive').addClass('active');
		$('#password').prop("disabled",false).attr('type','text').focus();
	} else {
		$('#password').prop("disabled",true).attr('type','password');
		layer_conserve.removeChildren();
	} 
	// switch to S E N D tool (which is not really a paperjs-tool)
	if(tool == 'send'){
		$('body').attr('data-tool','send');

		$('menu#finish .contai').not('.send').removeClass('active').addClass('inactive');
		$('menu#finish .send').removeClass('inactive').addClass('active');
	}
	if(tool == 'notool'){
		$('body').attr('data-tool','notool');
		tool_notool.activate();
	} else {
		$('menu#about').removeClass('open');
		$('body').removeClass('menuopen');
	}
	return tool;
}
function validPW(){
	var pw = $('#password').val();
	pw = pw.replace(/[^a-z0-9]/gi,'');
	$('#password').val(pw);
	return pw;
}

// encrypt whole canvas
function encrypt(key){
	// clean pw
	var pw = key.replace(/[^a-z0-9]/gi,'');
	if(!pw || pw == ""){
		console.log('empty pw');
		layer_pen.removeChildren();
		layer_pen = layer_conserve.clone();
		layer_pen.activate();
		layer_conserve.visible = false;
		layer_pen.visible = true;
		view.update(true);
	}
	// pw in zeichen aufspalten
	var pws = pw.split('');

	var encrypt = {
		0:[-4,3],
		1:[3,5],
		2:[4,2],
		3:[3,-4],
		4:[-3,-4],
		5:[-1,3],
		6:[4,-1],
		7:[1,3],
		8:[-3,2],
		9:[-4,4],
		a:[-1,5],b:[2,3],c:[1,3],d:[-2,4],e:[1,-4],f:[-2,-2],g:[3,2],h:[-3,3],i:[-2,1],j:[-2,-5],k:[2,2],l:[4,-3],m:[4,3],n:[1,-3],o:[1,5],p:[-2,-3],q:[-3,1],r:[-2,-4],s:[2,4],t:[5,-2],u:[4,1],v:[-4,-3],w:[-4,1],x:[-1,-4],y:[-1,4],z:[-4,-5],
		A:[-3,4],B:[2,-2],C:[3,-3],D:[3,-1],E:[4,4],F:[-2,2],G:[-1,-2],H:[-1,2],I:[3,-2],J:[1,-2],K:[1,4],L:[5,1],M:[-4,-2],N:[5,-1],O:[-3,-3],P:[2,-5],Q:[-2,-1],R:[5,3],S:[-5,-2],T:[2,-1],U:[-4,1],V:[-3,-1],W:[-3,5],X:[3,1],Y:[-2,3],Z:[2,-3],
	};

	var countpaths = layer_conserve.children.length;
	// console.log(layer_conserve);
	if(countpaths < 1){ console.log('no paths found in layer_conserve'); return false; }

	layer_pen.removeChildren();
	layer_pen = layer_conserve.clone();
	layer_pen.activate();

	var countpaths = layer_pen._children.length;
	var pwchar=0; var modi=0; var salt=1;
	// go through every character of the password
	while(pwchar < pw.length){
		var thisletter = pws[pwchar];

		for (var p=0; p < countpaths; p++){
			var thispath = layer_pen._children[p];
			var pathlength = thispath._segments.length;

			var i=modi;
			while(i<pathlength){
				var movex2, movey2;
				var segment = thispath._segments[i];
				var movex = (encrypt[thisletter][0]) * gridsize;
				var movey = (encrypt[thisletter][1]) * gridsize;
				// console.log(thisletter+': '+encrypt[thisletter][0]+' '+encrypt[thisletter][1]);
				if(modi == 0){ movex2 = -movex; }
				if(modi == 1){ movey2 = -movey; }
				if(modi == 2){ movex2 = movex; }
				if(modi == 3){ movey2 = movey; }
				if(salt % 4 == 1){ movex2 = movex * 2; }
				if(salt % 4 == 2){ movex2 = movey; movey2 = movex; }
				if(salt % 4 == 3){ movex2 = -movey; movey2 = -movex; }
				if(!movex2){movex2 = gridsize;}
				if(!movey2){movey2 = gridsize;}
				segment.point.x += movex2;
				segment.point.y += movey2;
				i = i+4;
				salt++;
			}

		}

		pwchar++; modi++; if(modi>3){modi=0;}
	}
	layer_conserve.visible = false;
	layer_pen.visible = true;
	view.update(true);
}
// clear the whole canvas
function clearAll(){
	if(compressed == true){ window.location.assign("http://crytch.com"); }
	// delete just about everything from canvas
	layer_pen.removeChildren(); layer_pen.removeChildren();
	layer_text.removeChildren(); layer_text.removeChildren();

	Cursor('reset');
	canvasFilled();

	switchtool('lastUsed');

	$('menu#tools').removeClass('inactive');
	$('#password').val("");
	$('#messageurl').val("");
	$('#sendviamail.sling .container').removeClass('open');
	$('#sendtomail').val("");
	$('menu#finish .send a.sendtoclient').removeClass('inactive');
	view.update(true);
	console.log('canvas has been cleared');
	return true;
}
function fetchCanvas(){
	compressed = true;
	layer_text.remove(); layer_text.remove();
	layer_interface.remove(); layer_interface.remove();
	var numlayer = project.layers.length; var i = 0; var d = 0;
	while(i<numlayer){ if( project.layers[i] ){ if( project.layers[i].isEmpty() ){ project.layers[i].remove(); d++;} } i++; }
	var i = 0;
	while(i<numlayer){ if( project.layers[i] ){ if( project.layers[i].isEmpty() ){ project.layers[i].remove(); d++;} } i++; }
	var canvas = project.exportJSON();
	return canvas;
}
function saveMessage(){
	console.log('attempt to save');
	layer_conserve.remove();
	var canvas = fetchCanvas();
	var senddata = {
		windowwidth: windowwidth,
		windowheight: windowheight,
		canvas: canvas,
		color: pathstyle.strokeColor,
		gridsize: gridsize,
		background: $('body').css('background-color'),
		language: $('body').attr('data-language')
	};
	$.post(
		"_/savemessage.php",
		senddata,
		function(){},
		'json'
	).done(function(data){
		if(data[0]['status'] == 'success'){
			msg_url = data[0]['url'];
			console.log('successfully saved to '+msg_url);
			$('#messageurl').val(msg_url).focus();
			$('body').attr('data-url',msg_url);
			var mailto = $('#sendviamail').attr('href');
			$('#sendviamail.mailto').attr('href',mailto+msg_url);
			switchtool('send');
		} else {
			console.log('server error');
		}
	});
}
function sendToClient(){
	console.log('attempt to send');
	var senddata = { messageurl: $('body').attr('data-url') };
	$.post(
		"_/sendtoclient.php",
		senddata,
		function(){}, 'json'
	).done(function(data){
		if(data[0]['status'] == 'success'){
			console.log('successfully sent');
			$('menu#finish .send a.sendtoclient').addClass('inactive');
		}
		else { console.log('server error'); }
	});
}
function listen(){
	console.log('listen ...');
	var senddata = { hey: 'hello. someone there?' };
	$.post(
		"_/listen.php",
		senddata,
		function(){}, 'json'
	).done(function(data){
		if(data[0]['status'] == 'success'){
			var count_messages = data[0]['num'];
			console.log(count_messages+' new messages');
			$('#popups ul.message-recieved .message .num').text(count_messages);
			$('#popups ul.message-recieved a.openmessage').attr('href',data[0][count_messages-1]);
			if($('body').hasClass('canvasfilled')){
				$('#popups ul.message-recieved a.openmessage').attr('target','_blank');
			} else {
				// im selben fenster öffnen
			}
			popup('message-recieved');
		}
		else { console.log('server error'); }
	});
}
function downloadDataUri(options) {
	if (!options.url)
		options.url = "http://download-data-uri.appspot.com/";
	$('<form method="post" action="' + options.url
		+ '" style="display:none"><input type="hidden" name="filename" value="'
		+ options.filename + '"/><input type="hidden" name="data" value="'
		+ options.data + '"/></form>').appendTo('body').submit().remove();
}
function downloadSVG(){
	var svg = project.exportSVG({ asString: true });
	downloadDataUri({
		data: 'data:image/svg+xml;base64,' + btoa(svg),
		filename: 'crytch.svg'
	});
}
function validateEmail(email){
	if(email== ""){ return false; }
	if(email== " "){ return false; }
	if(email.length < 5){ return false; }
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test(email);
}
function sendMail(){
	var email = $('#sendtomail').val();
	if(validateEmail(email) == false){
		return false;
	}
	// console.log('attempt to send');
	var senddata = {
		messageurl: $('body').attr('data-url'),
		sendtoemail: email
	};
	console.log(senddata);
	$.post(
		"_/sendviaemail.php",
		senddata,
		function(){}, 'json'
	).done(function(data){
		if(data[0]['status'] == 'success'){
			console.log('successfully sent');
			$('.sendviamail a.exesend').addClass('inactive');
			$('#sendviamail.sling').removeClass('open');
			$('#sendtomail').val("");
		}
		else { console.log('server error'); }
	});
}






// start with tools
Cursor('create');
PreviewPath('create');
highlightSegment('create');
switchtool('lastUsed');
if($('body').attr('data-listen') == 1){
	setInterval(function(){
		listen();
	}, 7500);
}







// P E N   T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
pathlength = 0;
tool_pen.onMouseDown = function(event){
	var snapped = new paper.Point();
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var point = new Point(snapped);
	if(!path){
		startNewPath();
	}

	if(path.lastSegment){
		if(point.x == path.lastSegment.point.x && point.y == path.lastSegment.point.y){
			// last segment and new point to add have identical position
			var samepos = true;
		} else { var samepos = false; }
	} else { var samepos = false; }

	if(path.firstSegment){
		if(point.x == path.firstSegment.point.x && point.y == path.firstSegment.point.y){
			// first segment and new point to add have identical position
			var firstpos = true;
		} else { var firstpos = false; }
	} else { var firstpos = false; }

	if(firstpos == true){
		closePath();
	} else {	
		if(!samepos){
			path.add(point);
			pathlength++;
		}
	}

	if(pathlength == 1){
		path.pivot = new Point(path.firstSegment.point.x,path.firstSegment.point.y);
	}
	if(pathlength == 2){
		canvasFilled('deleteEmpty');
	}

	if(pathlength > 0){
		highlightSegment('hide');
		PreviewPath('show');
	}
}
tool_pen.onMouseDrag = function(event){
	var snapped = new paper.Point();
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var point = new Point(snapped);

	if(path.lastSegment){
		if(point.x == path.lastSegment.point.x && point.y == path.lastSegment.point.y){
			// last segment and new point to add have identical position
			var samepos = true;
		} else { var samepos = false; }
	} else { var samepos = false; }
	if(path.firstSegment){
		if(point.x == path.firstSegment.point.x && point.y == path.firstSegment.point.y){
			// first segment and new point to add have identical position
			var firstpos = true;
		} else { var firstpos = false; }
	} else { var firstpos = false; }
	
	if(firstpos == true){
		closePath();
	} else {	
		if(!samepos){
			path.add(point);
			pathlength++;
		}
	}

	pathpreview.lastSegment.point = point;
	pathpreview.firstSegment.point = point;
}
tool_pen.onMouseUp = function(event){
	var snapped = new paper.Point();
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var point = new Point(snapped);

	pathpreview.lastSegment.point = point;
	pathpreview.firstSegment.point = point;

	canvasFilled();
}
tool_pen.onMouseMove = function(event){
	var snapped = new paper.Point();
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var point = new Point(snapped);
	segmenthighlight.position = point;
	if(pathlength > 0){
		pathpreview.lastSegment.point = point;
	}
}
// keyboard shortcuts for different tools
tool_pen.onKeyDown = function(event){
	// switch tools
	if(event.key == 'p'){ switchtool('pen'); }
	if(event.key == 'd'){ switchtool('pen'); }
	if(event.key == 'space'){ switchtool('pen'); }
	if(event.key == 'c'){ closePath(); }

	if(event.key == 'v'){ switchtool('move'); }
	if(event.key == 'a'){ switchtool('move'); }
	if(event.key == 'm'){ switchtool('move'); }

	if(event.key == 't'){ switchtool('text'); }
	if(event.key == 'w'){ switchtool('text'); }

	// move segment last drawn
	if(event.key == 'up'){
		moveWithSteps(path.lastSegment,'up');
		moveWithSteps(pathpreview.firstSegment,'up');
	}
	if(event.key == 'down'){
		moveWithSteps(path.lastSegment,'down');
		moveWithSteps(pathpreview.firstSegment,'down');
	}
	if(event.key == 'left'){
		moveWithSteps(path.lastSegment,'left');
		moveWithSteps(pathpreview.firstSegment,'left');
	}
	if(event.key == 'right'){
		moveWithSteps(path.lastSegment,'right');
		moveWithSteps(pathpreview.firstSegment,'right');
	}
	if(event.key == 'delete' || event.key == 'backspace'){
		event.preventDefault();
		deleteObjects(path.lastSegment);
		if(path.lastSegment){
			var newlastsegment = path.lastSegment.point;
			pathpreview.firstSegment.point = newlastsegment;
		} else if (path.firstSegment){
			var newlastsegment = path.firstSegment.point;
			pathpreview.firstSegment.point = newlastsegment;
		} else {
			PreviewPath('reset');
			pathlength = 0;
			highlightSegment('show');
		}
		console.log(path.segments.length);
	}
}






// M O V E  T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
var hitOptions = { segments:true, stroke:true, fill:false, tolerance:5 };
tool_move.onMouseDown = function(event){
	segment = null;
	stroke = null;
	var hitResult = project.hitTest(event.point, hitOptions);
	if(hitResult){
		if(hitResult.type == 'segment') {
			segment = hitResult.segment;
			console.log('hit segment');
			highlightSegment('show');
			return;
		}
		if(hitResult.type == 'stroke') {
			stroke = hitResult.item;
			console.log('hit path');
		}
	}
}
tool_move.onMouseMove = function(event){
	var snapped = event.point;
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var newpos = new Point(snapped);

	// overwrites hittest :)
	// segment = null;
	// stroke = null;
	var hitResult = project.hitTest(event.point, hitOptions);
	if(hitResult){
		if(hitResult.type == 'segment') {
			highlightSegment('show');
			segmenthighlight.position = newpos;
			return;
		} else {
			highlightSegment('hide');
		}
	} else {
		highlightSegment('hide');
	}
}
tool_move.onMouseDrag = function(event){
	var snapped = event.point;
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var newpos = new Point(snapped);
	segmenthighlight.position = newpos;

	if(segment){
		segment.point = newpos;
		return;
	}
	if(stroke){
		stroke.position = newpos;
	}
}
tool_move.onMouseUp = function(event){
	highlightSegment('hide');
}
tool_move.onKeyDown = function(event){
	// switch tools
	if(event.key == 'p'){ switchtool('pen'); }
	if(event.key == 'd'){ switchtool('pen'); }
	if(event.key == 't'){ switchtool('text'); }
	if(event.key == 'w'){ switchtool('text'); }
	if(segment){ var select = segment;
	} else if(stroke){ var select = stroke; }
	if(select){
		if(event.key == 'up'){ moveWithSteps(select,'up'); }
		if(event.key == 'down'){ moveWithSteps(select,'down'); }
		if(event.key == 'left'){ moveWithSteps(select,'left'); }
		if(event.key == 'right'){ moveWithSteps(select,'right'); }
		if(event.key == 'delete' || event.key == 'backspace'){
			event.preventDefault();
			console.log('delete');
			select.remove();
			canvasFilled('deleteEmpty');
		}
	}
}





// T E X T   T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
function backspace(){
	if(layer_text.children.length < 1){
		canvasFilled();
		Cursor('backspace');
	}
	if(layer_text.lastChild){
		Cursor('backspace',layer_text.lastChild.pivot);
		layer_text.lastChild.remove();
	}
}
// actually draw a character defined by any set of anchorpoints
function drawCharacter(anchorpoints,letterwidth){
	var path = new Path(anchorpoints);
	path.style = pathstyle;
	path.selected = pathselected;
	path.pivot = new Point(0,0);
	path.position = cursor.position;
	path.scale(gridsize*letterscale);
	
	Cursor('move',letterwidth*letterscale);
	canvasFilled(); 
}

// all letters minfied
function print_a(){var n=3,t=[new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,5),new Point(1,4),new Point(2,4),new Point(3,4),new Point(2,4)];drawCharacter(t,n)}function print_b(){var n=3,t=[new Point(0,0),new Point(0,7),new Point(2,7),new Point(3,6),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,6),new Point(2,7),new Point(0,7)];drawCharacter(t,n)}function print_c(){var n=3,t=[new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,3),new Point(1,2)];drawCharacter(t,n)}function print_d(){var n=3,t=[new Point(3,0),new Point(3,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,3),new Point(1,2),new Point(3,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7)];drawCharacter(t,n)}function print_e(){var n=3,t=[new Point(0,4),new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,3)];drawCharacter(t,n)}function print_f(){var n=2,t=[new Point(2,0),new Point(1,0),new Point(0,1),new Point(0,7),new Point(0,3),new Point(2,3),new Point(0,3),new Point(0,7),new Point(0,1),new Point(1,0),new Point(2,0),new Point(1,0),new Point(0,1),new Point(0,7)];drawCharacter(t,n)}function print_g(){var n=3,t=[new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,3),new Point(1,2),new Point(3,2),new Point(3,8),new Point(2,9),new Point(1,9),new Point(0,8),new Point(1,9),new Point(2,9),new Point(3,8)];drawCharacter(t,n)}function print_h(){var n=3,t=[new Point(0,0),new Point(0,7),new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,7),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,7),new Point(0,0),new Point(0,7)];drawCharacter(t,n)}function print_i(){var n=2,t=[new Point(1,2),new Point(2,2),new Point(2,0),new Point(0,0),new Point(0,2),new Point(1,2),new Point(1,7),new Point(0,7),new Point(2,7),new Point(0,7),new Point(1,7),new Point(1,2),new Point(0,2),new Point(0,0)];drawCharacter(t,n)}function print_j(){var n=2,t=[new Point(0,3),new Point(0,2),new Point(2,2),new Point(2,8),new Point(1,9),new Point(0,8),new Point(1,9),new Point(2,8),new Point(2,2),new Point(0,2),new Point(0,3),new Point(0,2),new Point(2,2),new Point(2,8)];drawCharacter(t,n)}function print_k(){var n=3,t=[new Point(0,0),new Point(0,7),new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,4),new Point(2,5),new Point(1,5),new Point(0,4),new Point(3,7),new Point(0,4),new Point(1,5),new Point(2,5)];drawCharacter(t,n)}function print_l(){var n=2,t=[new Point(0,4),new Point(2,2),new Point(2,0),new Point(0,0),new Point(0,6),new Point(1,7),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,0),new Point(2,0),new Point(2,2),new Point(0,4),new Point(2,2)];drawCharacter(t,n)}function print_m(){var n=6,t=[new Point(0,2),new Point(0,7),new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,7),new Point(3,3),new Point(4,2),new Point(5,2),new Point(6,3),new Point(6,7),new Point(6,3),new Point(5,2)];drawCharacter(t,n)}function print_n(){var n=3,t=[new Point(0,2),new Point(0,7),new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,7),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,7),new Point(0,2),new Point(0,7)];drawCharacter(t,n)}function print_o(){var n=3,t=[new Point(0,3),new Point(0,7),new Point(2,7),new Point(3,6),new Point(3,2),new Point(1,2),new Point(0,3),new Point(1,2),new Point(3,2),new Point(3,6),new Point(2,7),new Point(0,7),new Point(0,3),new Point(0,7)];drawCharacter(t,n)}function print_p(){var n=3,t=[new Point(0,2),new Point(0,9),new Point(0,7),new Point(2,7),new Point(3,6),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,6),new Point(2,7)];drawCharacter(t,n)}function print_q(){var n=3,t=[new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,3),new Point(1,2),new Point(3,2),new Point(3,9),new Point(3,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7)];drawCharacter(t,n)}function print_r(){var n=3,t=[new Point(0,7),new Point(3,7),new Point(1,7),new Point(1,3),new Point(2,2),new Point(3,2),new Point(3,3),new Point(3,2),new Point(2,2),new Point(1,3),new Point(1,7),new Point(3,7),new Point(0,7),new Point(3,7)];drawCharacter(t,n)}function print_s(){var n=3,t=[new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,4),new Point(1,4),new Point(2,5),new Point(3,5),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,5)];drawCharacter(t,n)}function print_t(){var n=3,t=[new Point(1,1),new Point(1,2),new Point(0,2),new Point(3,2),new Point(1,2),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,5),new Point(3,6),new Point(2,7),new Point(1,7),new Point(1,2),new Point(3,2)];drawCharacter(t,n)}function print_u(){var n=3,t=[new Point(0,2),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,7),new Point(3,2),new Point(3,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,2),new Point(0,6)];drawCharacter(t,n)}function print_v(){var n=3,t=[new Point(0,2),new Point(0,7),new Point(1,7),new Point(3,5),new Point(3,2),new Point(3,5),new Point(1,7),new Point(0,7),new Point(0,2),new Point(0,7),new Point(1,7),new Point(3,5),new Point(3,2),new Point(3,5)];drawCharacter(t,n)}function print_w(){var n=4,t=[new Point(0,2),new Point(0,6),new Point(1,7),new Point(2,6),new Point(3,7),new Point(4,6),new Point(4,2),new Point(4,6),new Point(3,7),new Point(2,6),new Point(1,7),new Point(0,6),new Point(0,2),new Point(0,6)];drawCharacter(t,n)}function print_x(){var n=4,t=[new Point(0,3),new Point(0,2),new Point(2,4),new Point(4,2),new Point(4,3),new Point(4,2),new Point(2,4),new Point(2,5),new Point(0,7),new Point(0,6),new Point(0,7),new Point(2,5),new Point(4,7),new Point(4,6)];drawCharacter(t,n)}function print_y(){var n=3,t=[new Point(0,2),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,2),new Point(3,8),new Point(2,9),new Point(1,9),new Point(0,8),new Point(1,9),new Point(2,9),new Point(3,8),new Point(3,2)];drawCharacter(t,n)}function print_z(){var n=3,t=[new Point(0,3),new Point(0,2),new Point(3,2),new Point(3,3),new Point(0,6),new Point(0,7),new Point(3,7),new Point(3,6),new Point(3,7),new Point(0,7),new Point(0,6),new Point(3,3),new Point(3,2),new Point(3,2)];drawCharacter(t,n)}function print_ß(){var n=4,t=[new Point(0,2),new Point(1,2),new Point(1,7),new Point(1,1),new Point(2,0),new Point(3,0),new Point(4,1),new Point(4,2),new Point(3,3),new Point(4,4),new Point(4,6),new Point(3,7),new Point(4,6),new Point(4,4)];drawCharacter(t,n)}
function print_A(){var n=4,t=[new Point(0,7),new Point(0,1),new Point(1,0),new Point(3,0),new Point(4,1),new Point(4,7),new Point(4,4),new Point(0,4),new Point(4,4),new Point(4,7),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1)];drawCharacter(t,n)}function print_B(){var n=4,t=[new Point(0,0),new Point(3,0),new Point(4,1),new Point(4,2),new Point(3,3),new Point(0,3),new Point(3,3),new Point(4,4),new Point(4,6),new Point(3,7),new Point(0,7),new Point(0,0),new Point(0,7),new Point(3,7)];drawCharacter(t,n)}function print_C(){var n=4,t=[new Point(4,2),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1),new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,5),new Point(4,6),new Point(3,7),new Point(1,7),new Point(0,6)];drawCharacter(t,n)}function print_D(){var n=4,t=[new Point(0,0),new Point(0,7),new Point(3,7),new Point(4,6),new Point(4,1),new Point(3,0),new Point(0,0),new Point(3,0),new Point(4,1),new Point(4,6),new Point(3,7),new Point(0,7),new Point(0,0),new Point(0,7)];drawCharacter(t,n)}function print_E(){var n=4,t=[new Point(4,1),new Point(4,0),new Point(0,0),new Point(0,4),new Point(3,4),new Point(3,3),new Point(3,5),new Point(3,4),new Point(0,4),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7)];drawCharacter(t,n)}function print_F(){var n=4,t=[new Point(4,1),new Point(4,0),new Point(0,0),new Point(0,4),new Point(3,4),new Point(3,3),new Point(3,5),new Point(3,4),new Point(0,4),new Point(0,7),new Point(0,4),new Point(3,4),new Point(3,5),new Point(3,3)];drawCharacter(t,n)}function print_G(){var n=4,t=[new Point(2,3),new Point(4,3),new Point(4,6),new Point(3,7),new Point(1,7),new Point(0,6),new Point(0,1),new Point(1,0),new Point(3,0),new Point(4,1),new Point(4,2),new Point(4,1),new Point(3,0),new Point(1,0)];drawCharacter(t,n)}function print_H(){var n=4,t=[new Point(0,0),new Point(0,7),new Point(0,3),new Point(4,3),new Point(4,0),new Point(4,7),new Point(4,0),new Point(4,3),new Point(0,3),new Point(0,7),new Point(0,0),new Point(0,7),new Point(0,3),new Point(4,3)];drawCharacter(t,n)}function print_I(){var n=2,t=[new Point(0,0),new Point(2,0),new Point(1,0),new Point(1,7),new Point(0,7),new Point(2,7),new Point(0,7),new Point(1,7),new Point(1,0),new Point(2,0),new Point(0,0),new Point(2,0),new Point(1,0),new Point(1,7)];drawCharacter(t,n)}function print_J(){var n=3,t=[new Point(0,1),new Point(0,0),new Point(3,0),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,4),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,0),new Point(0,0)];drawCharacter(t,n)}function print_K(){var n=4,t=[new Point(0,0),new Point(0,7),new Point(0,3),new Point(2,3),new Point(4,1),new Point(4,0),new Point(4,1),new Point(2,3),new Point(4,5),new Point(4,7),new Point(4,5),new Point(2,3),new Point(4,1),new Point(4,0)];drawCharacter(t,n)}function print_L(){var n=4,t=[new Point(0,0),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7),new Point(0,0),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7),new Point(0,0),new Point(0,7)];drawCharacter(t,n)}function print_M(){var n=6,t=[new Point(0,7),new Point(0,0),new Point(3,3),new Point(6,0),new Point(6,7),new Point(6,0),new Point(3,3),new Point(0,0),new Point(0,7),new Point(0,0),new Point(0,7),new Point(0,0),new Point(3,3),new Point(6,0)];drawCharacter(t,n)}function print_N(){var n=4,t=[new Point(0,7),new Point(0,0),new Point(4,4),new Point(4,0),new Point(4,7),new Point(4,0),new Point(4,4),new Point(0,0),new Point(0,7),new Point(0,0),new Point(4,4),new Point(4,0),new Point(4,7),new Point(4,0)];drawCharacter(t,n)}function print_O(){var n=4,t=[new Point(0,1),new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,5),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1),new Point(1,0),new Point(3,0),new Point(4,1),new Point(4,5)];drawCharacter(t,n)}function print_P(){var n=4,t=[new Point(0,4),new Point(3,4),new Point(4,3),new Point(4,1),new Point(3,0),new Point(0,0),new Point(0,7),new Point(0,0),new Point(3,0),new Point(4,1),new Point(4,3),new Point(3,4),new Point(0,4),new Point(3,4)];drawCharacter(t,n)}function print_Q(){var n=5,t=[new Point(5,7),new Point(5,8),new Point(4,8),new Point(3,7),new Point(1,7),new Point(0,6),new Point(0,1),new Point(1,0),new Point(3,0),new Point(4,1),new Point(4,6),new Point(3,7),new Point(4,6),new Point(4,1)];drawCharacter(t,n)}function print_R(){var n=4,t=[new Point(0,7),new Point(0,0),new Point(3,0),new Point(4,1),new Point(4,3),new Point(3,4),new Point(0,4),new Point(3,4),new Point(4,5),new Point(4,7),new Point(4,5),new Point(3,4),new Point(0,4),new Point(3,4)];drawCharacter(t,n)}function print_S(){var n=4,t=[new Point(4,2),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1),new Point(0,2),new Point(1,3),new Point(3,3),new Point(4,4),new Point(4,6),new Point(3,7),new Point(1,7),new Point(0,6),new Point(0,5)];drawCharacter(t,n)}function print_T(){var n=4,t=[new Point(0,1),new Point(0,0),new Point(4,0),new Point(4,1),new Point(4,0),new Point(2,0),new Point(2,7),new Point(1,7),new Point(3,7),new Point(1,7),new Point(2,7),new Point(2,0),new Point(4,0),new Point(4,1)];drawCharacter(t,n)}function print_U(){var n=4,t=[new Point(0,0),new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,0),new Point(4,6),new Point(3,7),new Point(1,7),new Point(0,6),new Point(0,0),new Point(0,6),new Point(1,7),new Point(3,7)];drawCharacter(t,n)}function print_V(){var n=4,t=[new Point(0,0),new Point(0,5),new Point(2,7),new Point(4,5),new Point(4,0),new Point(4,5),new Point(2,7),new Point(0,5),new Point(0,0),new Point(0,5),new Point(2,7),new Point(4,5),new Point(4,0),new Point(4,5)];drawCharacter(t,n)}function print_W(){var n=6,t=[new Point(0,0),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,0),new Point(3,6),new Point(4,7),new Point(5,7),new Point(6,6),new Point(6,0),new Point(6,6),new Point(5,7),new Point(4,7)];drawCharacter(t,n)}function print_X(){var n=6,t=[new Point(0,0),new Point(3,3),new Point(6,0),new Point(3,3),new Point(3,4),new Point(0,7),new Point(3,4),new Point(6,7),new Point(3,4),new Point(0,7),new Point(3,4),new Point(3,3),new Point(6,0),new Point(3,3)];drawCharacter(t,n)}function print_Y(){var n=4,t=[new Point(0,0),new Point(0,2),new Point(2,4),new Point(4,2),new Point(4,0),new Point(4,2),new Point(2,4),new Point(2,7),new Point(0,7),new Point(4,7),new Point(0,7),new Point(2,7),new Point(2,4),new Point(4,2)];drawCharacter(t,n)}function print_Z(){var n=4,t=[new Point(0,1),new Point(0,0),new Point(4,0),new Point(4,1),new Point(0,5),new Point(0,7),new Point(4,7),new Point(4,5),new Point(4,7),new Point(0,7),new Point(0,5),new Point(4,1),new Point(4,0),new Point(0,0)];drawCharacter(t,n)}
function print_ae(){var n=[2,3],t=[[new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,4),new Point(3,5),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,5),new Point(1,4),new Point(2,4),new Point(3,4)],[new Point(0,4),new Point(1,4),new Point(2,4),new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,4),new Point(0,5),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6)]];drawCharacter(t[0],n[0]),drawCharacter(t[1],n[1])}function print_oe(){var n=[2,3],t=[[new Point(0,3),new Point(0,7),new Point(2,7),new Point(3,6),new Point(3,2),new Point(1,2),new Point(0,3),new Point(1,2),new Point(3,2),new Point(3,6),new Point(2,7),new Point(0,7),new Point(0,3),new Point(0,7)],[new Point(0,4),new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,3)]];drawCharacter(t[0],n[0]),drawCharacter(t[1],n[1])}function print_ue(){var n=[2,3],t=[[new Point(0,2),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,2),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,2),new Point(0,6),new Point(1,7),new Point(2,7)],[new Point(0,4),new Point(1,4),new Point(2,4),new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,4),new Point(0,5),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6)]];drawCharacter(t[0],n[0]),drawCharacter(t[1],n[1])}function print_AE(){var n=[3,4],t=[[new Point(0,7),new Point(0,1),new Point(1,0),new Point(3,0),new Point(4,1),new Point(4,7),new Point(4,4),new Point(0,4),new Point(4,4),new Point(4,7),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1)],[new Point(4,1),new Point(4,0),new Point(0,0),new Point(0,4),new Point(3,4),new Point(3,3),new Point(3,5),new Point(3,4),new Point(0,4),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7)]];drawCharacter(t[0],n[0]),drawCharacter(t[1],n[1])}function print_OE(){var n=[3,4],t=[[new Point(0,1),new Point(0,6),new Point(1,7),new Point(4,7),new Point(4,5),new Point(4,0),new Point(1,0),new Point(0,1),new Point(1,0),new Point(4,0),new Point(4,5),new Point(4,7),new Point(1,7),new Point(0,6)],[new Point(4,1),new Point(4,0),new Point(0,0),new Point(0,4),new Point(3,4),new Point(3,3),new Point(3,5),new Point(3,4),new Point(0,4),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7)]];drawCharacter(t[0],n[0]),drawCharacter(t[1],n[1])}function print_UE(){var n=[3,4],t=[[new Point(0,0),new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,0),new Point(4,6),new Point(3,7),new Point(1,7),new Point(0,6),new Point(0,0),new Point(0,6),new Point(1,7),new Point(3,7)],[new Point(4,1),new Point(4,0),new Point(0,0),new Point(0,4),new Point(3,4),new Point(3,3),new Point(3,5),new Point(3,4),new Point(0,4),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7)]];drawCharacter(t[0],n[0]),drawCharacter(t[1],n[1])}
function print_1(){var n=3,t=[new Point(0,2),new Point(0,1),new Point(1,0),new Point(2,0),new Point(2,7),new Point(0,7),new Point(3,7),new Point(0,7),new Point(2,7),new Point(2,0),new Point(1,0),new Point(0,1),new Point(0,2),new Point(0,1)];drawCharacter(t,n)}function print_2(){var n=4,t=[new Point(0,2),new Point(0,1),new Point(1,0),new Point(3,0),new Point(4,1),new Point(4,3),new Point(3,4),new Point(1,4),new Point(0,5),new Point(0,7),new Point(4,7),new Point(4,6),new Point(4,7),new Point(0,7)];drawCharacter(t,n)}function print_3(){var n=4,t=[new Point(0,1),new Point(0,0),new Point(4,0),new Point(4,1),new Point(2,3),new Point(4,5),new Point(4,6),new Point(3,7),new Point(1,7),new Point(0,6),new Point(0,5),new Point(0,6),new Point(1,7),new Point(3,7)];drawCharacter(t,n)}function print_4(){var n=4,t=[new Point(4,5),new Point(0,5),new Point(0,3),new Point(3,0),new Point(3,7),new Point(1,7),new Point(4,7),new Point(1,7),new Point(3,7),new Point(3,0),new Point(0,3),new Point(0,5),new Point(4,5),new Point(0,5)];drawCharacter(t,n)}function print_5(){var n=4,t=[new Point(4,1),new Point(4,0),new Point(0,0),new Point(0,3),new Point(3,3),new Point(4,4),new Point(4,6),new Point(3,7),new Point(0,7),new Point(3,7),new Point(4,6),new Point(4,4),new Point(3,3),new Point(0,3)];drawCharacter(t,n)}function print_6(){var n=4,t=[new Point(4,2),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1),new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,4),new Point(3,3),new Point(1,3),new Point(0,4),new Point(1,3)];drawCharacter(t,n)}function print_7(){var n=4,t=[new Point(0,0),new Point(4,0),new Point(4,2),new Point(0,7),new Point(4,2),new Point(4,0),new Point(0,0),new Point(4,0),new Point(4,2),new Point(0,7),new Point(4,2),new Point(4,0),new Point(0,0),new Point(4,0)];drawCharacter(t,n)}function print_8(){var n=3,t=[new Point(1,0),new Point(2,0),new Point(3,1),new Point(3,2),new Point(0,5),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(3,5),new Point(0,2),new Point(0,1),new Point(1,0),new Point(0,1)];drawCharacter(t,n)}function print_9(){var n=4,t=[new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1),new Point(0,3),new Point(1,4),new Point(3,4),new Point(4,3),new Point(3,4),new Point(1,4)];drawCharacter(t,n)}function print_0(){var n=4,t=[new Point(0,1),new Point(0,6),new Point(4,2),new Point(0,6),new Point(1,7),new Point(3,7),new Point(4,6),new Point(4,5),new Point(4,1),new Point(3,0),new Point(1,0),new Point(0,1),new Point(1,0),new Point(3,0)];drawCharacter(t,n)}
function print_period(){var n=2,t=[new Point(0,5),new Point(0,7),new Point(2,7),new Point(2,5),new Point(0,5),new Point(2,5),new Point(2,7),new Point(0,7),new Point(0,5),new Point(0,7),new Point(2,7),new Point(2,5),new Point(2,7),new Point(0,7)];drawCharacter(t,n)}function print_comma(){var n=2,t=[new Point(2,7),new Point(0,7),new Point(0,5),new Point(2,5),new Point(2,7),new Point(2,8),new Point(1,9),new Point(2,8),new Point(2,7),new Point(2,5),new Point(0,5),new Point(0,7),new Point(2,7),new Point(0,7)];drawCharacter(t,n)}function print_question(){var n=3,t=[new Point(1,5),new Point(2,5),new Point(2,7),new Point(0,7),new Point(0,5),new Point(1,5),new Point(1,4),new Point(3,2),new Point(3,1),new Point(2,0),new Point(1,0),new Point(0,1),new Point(0,2),new Point(0,1)];drawCharacter(t,n)}function print_exclamation(){var n=2,t=[new Point(1,5),new Point(2,5),new Point(2,7),new Point(0,7),new Point(0,5),new Point(1,5),new Point(1,0),new Point(1,5),new Point(0,5),new Point(0,7),new Point(2,7),new Point(2,5),new Point(1,5),new Point(2,5)];drawCharacter(t,n)}function print_ampersand(){var n=5,t=[new Point(5,4),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,5),new Point(3,2),new Point(3,1),new Point(2,0),new Point(1,0),new Point(0,1),new Point(0,2),new Point(5,7),new Point(0,2),new Point(0,1)];drawCharacter(t,n)}function print_dash(){var n=3,t=[new Point(0,3),new Point(3,3),new Point(0,3),new Point(3,3),new Point(0,3),new Point(3,3),new Point(0,3),new Point(3,3),new Point(0,3),new Point(3,3),new Point(0,3),new Point(3,3),new Point(0,3),new Point(3,3)];drawCharacter(t,n)}function print_bracketopen(){var n=1,t=[new Point(1,0),new Point(0,0),new Point(0,7),new Point(1,7),new Point(0,7),new Point(0,0),new Point(1,0),new Point(0,0),new Point(0,7),new Point(1,7),new Point(0,7),new Point(0,0),new Point(1,0),new Point(0,0)];drawCharacter(t,n)}function print_bracketclosed(){var n=1,t=[new Point(0,0),new Point(1,0),new Point(1,7),new Point(0,7),new Point(1,7),new Point(1,0),new Point(0,0),new Point(1,0),new Point(1,7),new Point(0,7),new Point(1,7),new Point(1,0),new Point(0,0),new Point(1,0)];drawCharacter(t,n)}function print_roundbracketopen(){var n=1,t=[new Point(1,0),new Point(0,1),new Point(0,6),new Point(1,7),new Point(0,6),new Point(0,1),new Point(1,0),new Point(0,1),new Point(0,6),new Point(1,7),new Point(0,6),new Point(0,1),new Point(1,0),new Point(0,1)];drawCharacter(t,n)}function print_roundbracketclosed(){var n=1,t=[new Point(0,0),new Point(1,1),new Point(1,6),new Point(0,7),new Point(1,6),new Point(1,1),new Point(0,0),new Point(1,1),new Point(1,6),new Point(0,7),new Point(1,6),new Point(1,1),new Point(0,0),new Point(1,1)];drawCharacter(t,n)}function print_curlybracketopen(){var n=2,t=[new Point(2,0),new Point(1,1),new Point(1,2),new Point(0,3),new Point(0,4),new Point(1,5),new Point(1,6),new Point(2,7),new Point(1,6),new Point(1,5),new Point(0,4),new Point(0,3),new Point(1,2),new Point(1,1)];drawCharacter(t,n)}function print_curlybracketclosed(){var n=2,t=[new Point(0,0),new Point(1,1),new Point(1,2),new Point(2,3),new Point(2,4),new Point(1,5),new Point(1,6),new Point(0,7),new Point(1,6),new Point(1,5),new Point(2,4),new Point(2,3),new Point(1,2),new Point(1,1)];drawCharacter(t,n)}function print_colon(){var n=2,t=[new Point(2,4),new Point(0,4),new Point(0,2),new Point(2,2),new Point(2,4),new Point(0,5),new Point(0,7),new Point(2,7),new Point(2,5),new Point(0,5),new Point(2,5),new Point(0,5),new Point(2,5),new Point(2,7)];drawCharacter(t,n)}function print_semicolon(){var n=2,t=[new Point(2,4),new Point(0,4),new Point(0,2),new Point(2,2),new Point(2,4),new Point(0,5),new Point(0,7),new Point(2,7),new Point(2,8),new Point(1,9),new Point(2,8),new Point(2,7),new Point(2,5),new Point(0,5)];drawCharacter(t,n)}function print_euro(){var n=4,t=[new Point(4,0),new Point(2,0),new Point(1,1),new Point(1,3),new Point(3,3),new Point(0,3),new Point(1,3),new Point(1,4),new Point(3,4),new Point(0,4),new Point(1,4),new Point(1,6),new Point(2,7),new Point(4,7)];drawCharacter(t,n)}function print_dollar(){var n=4,t=[new Point(4,0),new Point(1,0),new Point(0,1),new Point(0,2),new Point(1,3),new Point(2,3),new Point(2,1),new Point(2,6),new Point(2,3),new Point(3,3),new Point(4,4),new Point(4,6),new Point(3,7),new Point(0,7)];drawCharacter(t,n)}function print_sterling(){var n=4,t=[new Point(4,2),new Point(4,1),new Point(3,0),new Point(2,0),new Point(1,1),new Point(1,4),new Point(0,4),new Point(3,4),new Point(1,4),new Point(1,6),new Point(0,7),new Point(3,7),new Point(4,6),new Point(3,7)];drawCharacter(t,n)}function print_at(){var n=4,t=[new Point(3,5),new Point(2,4),new Point(1,5),new Point(1,6),new Point(4,6),new Point(4,3),new Point(3,2),new Point(1,2),new Point(0,3),new Point(0,7),new Point(1,8),new Point(3,8),new Point(4,7),new Point(3,8)];drawCharacter(t,n)}function print_underscore(){var n=3,t=[new Point(0,7),new Point(3,7),new Point(0,7),new Point(3,7),new Point(0,7),new Point(3,7),new Point(0,7),new Point(3,7),new Point(0,7),new Point(3,7),new Point(0,7),new Point(3,7),new Point(0,7),new Point(3,7)];drawCharacter(t,n)}function print_slash(){var n=7,t=[new Point(0,7),new Point(7,0),new Point(0,7),new Point(7,0),new Point(0,7),new Point(7,0),new Point(0,7),new Point(7,0),new Point(0,7),new Point(7,0),new Point(0,7),new Point(7,0),new Point(0,7),new Point(7,0)];drawCharacter(t,n)}function print_backslash(){var n=7,t=[new Point(0,0),new Point(7,7),new Point(0,0),new Point(7,7),new Point(0,0),new Point(7,7),new Point(0,0),new Point(7,7),new Point(0,0),new Point(7,7),new Point(0,0),new Point(7,7),new Point(0,0),new Point(7,7)];drawCharacter(t,n)}function print_apostrophe(){var n=2,t=[new Point(1,4),new Point(2,3),new Point(2,0),new Point(0,0),new Point(0,2),new Point(2,2),new Point(0,2),new Point(0,0),new Point(2,0),new Point(2,3),new Point(1,4),new Point(2,3),new Point(2,0),new Point(0,0)];drawCharacter(t,n)}function print_a_acute(){var n=3,t=[new Point(0,3),new Point(1,2),new Point(2,2),new Point(3,1),new Point(2,2),new Point(3,3),new Point(3,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,5),new Point(1,4),new Point(3,4)];drawCharacter(t,n)}function print_a_grave(){var n=3,t=[new Point(0,3),new Point(1,2),new Point(0,1),new Point(1,2),new Point(2,2),new Point(3,3),new Point(3,7),new Point(3,6),new Point(2,7),new Point(1,7),new Point(0,6),new Point(0,5),new Point(1,4),new Point(3,4)];drawCharacter(t,n)}function print_e_acute(){var n=3,t=[new Point(0,4),new Point(3,4),new Point(3,3),new Point(2,2),new Point(3,1),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(2,7),new Point(1,7)];drawCharacter(t,n)}function print_e_grave(){var n=3,t=[new Point(0,4),new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,1),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7),new Point(3,6),new Point(2,7),new Point(1,7)];drawCharacter(t,n)}function print_c_cedille(){var n=3,t=[new Point(3,4),new Point(3,3),new Point(2,2),new Point(1,2),new Point(0,3),new Point(0,6),new Point(1,7),new Point(2,7),new Point(2,8),new Point(1,8),new Point(2,8),new Point(2,7),new Point(3,6),new Point(2,7)];drawCharacter(t,n)}function print_asterisk(){var n=4,t=[new Point(0,4),new Point(4,4),new Point(2,4),new Point(2,2),new Point(2,6),new Point(2,4),new Point(1,5),new Point(3,3),new Point(2,4),new Point(1,3),new Point(3,5),new Point(1,3),new Point(2,4),new Point(3,3)];drawCharacter(t,n)}function print_plus(){var n=4,t=[new Point(0,4),new Point(4,4),new Point(2,4),new Point(2,2),new Point(2,6),new Point(2,2),new Point(2,4),new Point(4,4),new Point(0,4),new Point(4,4),new Point(2,4),new Point(2,2),new Point(2,6),new Point(2,2)];drawCharacter(t,n)}function print_multiply(){var n=4,t=[new Point(0,2),new Point(4,6),new Point(2,4),new Point(4,2),new Point(0,6),new Point(4,2),new Point(2,4),new Point(4,6),new Point(0,2),new Point(4,6),new Point(2,4),new Point(4,2),new Point(0,6),new Point(4,2)];drawCharacter(t,n)}function print_hashtag(){var n=4,t=[new Point(1,2),new Point(1,6),new Point(1,3),new Point(0,3),new Point(4,3),new Point(1,3),new Point(1,5),new Point(0,5),new Point(4,5),new Point(3,5),new Point(3,6),new Point(3,2),new Point(3,6),new Point(3,5)];drawCharacter(t,n)}

tool_text.onKeyDown = function(event){
	// fire functions on keypress
	if(event.character == 'a'){ print_a(); } if(event.character == 'b'){ print_b(); } if(event.character == 'c'){ print_c(); } if(event.character == 'd'){ print_d(); } if(event.character == 'e'){ print_e(); } if(event.character == 'f'){ print_f(); } if(event.character == 'g'){ print_g(); } if(event.character == 'h'){ print_h(); } if(event.character == 'i'){ print_i(); } if(event.character == 'j'){ print_j(); } if(event.character == 'k'){ print_k(); } if(event.character == 'l'){ print_l(); } if(event.character == 'm'){ print_m(); } if(event.character == 'n'){ print_n(); } if(event.character == 'o'){ print_o(); } if(event.character == 'p'){ print_p(); } if(event.character == 'q'){ print_q(); } if(event.character == 'r'){ print_r(); } if(event.character == 's'){ print_s(); } if(event.character == 't'){ print_t(); } if(event.character == 'u'){ print_u(); } if(event.character == 'v'){ print_v(); } if(event.character == 'w'){ print_w(); } if(event.character == 'x'){ print_x(); } if(event.character == 'y'){ print_y(); } if(event.character == 'z'){ print_z(); }
	if(event.character == 'A'){ print_A(); } if(event.character == 'B'){ print_B(); } if(event.character == 'C'){ print_C(); } if(event.character == 'D'){ print_D(); } if(event.character == 'E'){ print_E(); } if(event.character == 'F'){ print_F(); } if(event.character == 'G'){ print_G(); } if(event.character == 'H'){ print_H(); } if(event.character == 'I'){ print_I(); } if(event.character == 'J'){ print_J(); } if(event.character == 'K'){ print_K(); } if(event.character == 'L'){ print_L(); } if(event.character == 'M'){ print_M(); } if(event.character == 'N'){ print_N(); } if(event.character == 'O'){ print_O(); } if(event.character == 'P'){ print_P(); } if(event.character == 'Q'){ print_Q(); } if(event.character == 'R'){ print_R(); } if(event.character == 'S'){ print_S(); } if(event.character == 'T'){ print_T(); } if(event.character == 'U'){ print_U(); } if(event.character == 'V'){ print_V(); } if(event.character == 'W'){ print_W(); } if(event.character == 'X'){ print_X(); } if(event.character == 'Y'){ print_Y(); } if(event.character == 'Z'){ print_Z(); }
	if(event.character == '1'){ print_1(); } if(event.character == '2'){ print_2(); } if(event.character == '3'){ print_3(); } if(event.character == '4'){ print_4(); } if(event.character == '5'){ print_5(); } if(event.character == '6'){ print_6(); } if(event.character == '7'){ print_7(); } if(event.character == '8'){ print_8(); } if(event.character == '9'){ print_9(); } if(event.character == '0'){ print_0(); }
	if(event.character == 'Ä'){ print_AE(); } if(event.character == 'Ö'){ print_OE(); } if(event.character == 'Ü'){ print_UE(); } if(event.character == 'ä'){ print_ae(); } if(event.character == 'ö'){ print_oe(); } if(event.character == 'ü'){ print_ue(); } if(event.character == 'ß'){ print_ß(); }
	if(event.key == '?'){ print_question(); }
	if(event.key == '!'){ print_exclamation(); }
	if(event.key == '.'){ print_period(); }
	if(event.key == ':'){ print_colon(); }
	if(event.key == ','){ print_comma(); }
	if(event.key == '-'){ print_dash(); }
	if(event.key == '–'){ print_dash(); }
	if(event.key == '&'){ print_ampersand(); }
	if(event.key == '('){ print_roundbracketopen(); } if(event.key == ')'){ print_roundbracketclosed(); } if(event.key == '['){ print_bracketopen(); } if(event.key == ']'){ print_bracketclosed(); } if(event.key == '{'){ print_curlybracketopen(); } if(event.key == '}'){ print_curlybracketclosed(); }
	if(event.key == ';'){ print_semicolon(); }
	if(event.key == '€'){ print_euro(); }
	if(event.key == '$'){ print_dollar(); }
	if(event.key == '£'){ print_sterling(); }
	if(event.key == '@'){ print_at(); }
	if(event.key == '_'){ print_underscore(); }
	if(event.key == '/'){ print_slash(); }
	if(event.character == '’'){ print_apostrophe(); }
	if(event.key == '*'){ print_asterisk(); }
	if(event.key == '×'){ print_multiply(); }
	if(event.key == '#'){ print_hashtag(); }
	// gehen nicht
	if(event.key == 'á'){ print_a_acute(); }
	if(event.key == 'à'){ print_a_grave(); }
	if(event.character == 'é'){ print_e_acute(); }
	if(event.character == 'è'){ print_e_grave(); }
	if(event.key == 'ç'){ print_c_cedille(); }
	// Prozent, Anführungszeichen, Vertikaler strich, +, = 
	if(event.character == '\\'){ print_backslash(); }
	if(event.key == 'space'){ Cursor('move'); }
	if(event.key == 'enter'){ Cursor('jumpline'); }
	if(event.key == 'delete' || event.key == 'backspace'){ event.preventDefault(); backspace(); }
	if(event.key == 'up'){ moveWithSteps(cursor,'up'); }
	if(event.key == 'down'){ moveWithSteps(cursor,'down'); }
	if(event.key == 'left'){ moveWithSteps(cursor,'left'); }
	if(event.key == 'right'){ moveWithSteps(cursor,'right'); }
}
// drag cursor
tool_text.onMouseDrag = function(event){
	var snapped = new paper.Point();
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var point = new Point(snapped);
	cursor.position = point;
}
tool_text.onMouseUp = function(event){
	var snapped = new paper.Point();
	snapped.x = snap(event.point.x, gridsize);
	snapped.y = snap(event.point.y, gridsize);
	var point = new Point(snapped);
	cursor.position = point;
}




// E N C R Y P T   T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
tool_encrypt.onKeyDown = function(event){
	// encrypt(event.key);
}




// Handle I N T E R F A C E  - - - - - - - - - - - - - - - - - - - - - - - - - - -
$('menu a').click(function(){
	var execute = $(this).attr('data-execute');
	if(!execute){
		var execute = $(this).parent().attr('data-execute');
	}
	if(!execute){ return true; }
	if($(this).hasClass('inactive')){ return false; }
	if($(this).parent('.contai').hasClass('inactive')){ return false; }
	if($(this).parent('menu').hasClass('inactive')){ return false; }

	console.log(execute);

	if(execute == 'pen'){ switchtool('pen'); }
	if(execute == 'text'){ switchtool('text'); }
	if(execute == 'move'){ switchtool('move'); }
	if(execute == 'encrypt'){
		if( $('body').attr('data-tool') == 'encrypt'){
			switchtool('lastUsed');
		} else {
			switchtool('encrypt');
		}
	}
	if(execute == 'export-svg'){ downloadSVG(); console.log('try to export'); }
	if(execute == 'clearall'){ clearAll(); }
	if(execute == 'confirm-clearall'){ popup('confirm-clear-canvas'); }
	if(execute == 'reload'){ window.location.assign("http://crytch.com"); }
	if(execute == 'save'){ saveMessage(); }
	if(execute == 'sendtoclient'){ sendToClient(); }
	if(execute == 'restyle'){
		reStyle( $(this).parent().attr('data-inst') , $(this).attr('data-val') );
	}
	if(execute == 'setlanguage'){
		setLanguage( $(this).attr('data-val') );
	}
	if(execute == 'sendmailsling'){
		sendMail();
	}
});

$("menu").hover(function(){
		PreviewPath('hide');
	},function(){
		PreviewPath('show');
});
$("#popups").hover(function(){
		PreviewPath('hide');
	},function(){
		PreviewPath('show');
});
$('#password').keyup(function() {
	var pw = validPW();
	encrypt(pw);
});
$("#messageurl").on("click",function(){
	$(this).select();
});
$('#strokewidth').keyup(function() {
	var width = $(this).val();
	reStyle('strokewidth',width);
});
$('#popups ul a.closepopup').click(function(){
	popup();
});
$('#sendtomail').keyup(function(){
	var email = $(this).val();
	if(validateEmail(email) == true){
		$('.sendviamail a.exesend').removeClass('inactive');
	} else {
		$('.sendviamail a.exesend').addClass('inactive');
	}
});
$('menu#about').click(function(){
	$('menu#about').addClass('open');
	$('body').addClass('menuopen');
	switchtool('notool');
});
$('#sendviamail.sling').click(function(){
	$(this).addClass('open');
	$('#sendtomail').focus();
});
$('canvas').click(function(){
	if(!$('body').hasClass('menuopen')){ return false; }	
	switchtool('lastUsed');
});
$('#popups ul.message-recieved a.openmessage').click(function(){
	popup();
});
$('#popups ul.confirm-clear-canvas a.clearall').click(function(){
	clearAll();
	popup();
});


if( $('.contactmail').length > 0 ){
	setTimeout(function(){
		var url = 'crytch.com';
		$('.contactmail').attr('href','mailto:secret@'+url);
	}, 2500);
}

$(window).resize(function(){ 
	var windowwidth = $(window).width(); var windowheight = $(window).height();
});

// end paper
}