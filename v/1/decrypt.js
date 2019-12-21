// C R Y T C H
// Encrypt a Sketch at crytch.com
// Concept by Leon Plum & Mori Waan
// Code by Mori Waan, Typeface by Leon Plum
// 2016 Bauhaus University Weimar, Germany

// works with paper.js
// We <3 Jürg Lehni

function setCookie(cname,cvalue,exdays){ var d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000)); var expires = "expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + "; " + expires;}
function rand(min, max) { return Math.floor(Math.random() * (max - min +1)) + min; }
function status(msg){ $('#status').text(msg); }


// install paper js
paper.install(window);
// define vars for paperscript
var tool_decrypt, tool_notool, layer_decrypt, layer_message;

var matrix = { 0:[-4,3],1:[3,5],2:[4,2],3:[3,-4],4:[-3,-4],5:[-1,3],6:[4,-1],7:[1,3],8:[-3,2],9:[-4,4],a:[-1,5],b:[2,3],c:[1,3],d:[-2,4],e:[1,-4],f:[-2,-2],g:[3,2],h:[-3,3],i:[-2,1],j:[-2,-5],k:[2,2],l:[4,-3],m:[4,3],n:[1,-3],o:[1,5],p:[-2,-3],q:[-3,1],r:[-2,-4],s:[2,4],t:[5,-2],u:[4,1],v:[-4,-3],w:[-4,1],x:[-1,-4],y:[-1,4],z:[-4,-5],A:[-3,4],B:[2,-2],C:[3,-3],D:[3,-1],E:[4,4],F:[-2,2],G:[-1,-2],H:[-1,2],I:[3,-2],J:[1,-2],K:[1,4],L:[5,1],M:[-4,-2],N:[5,-1],O:[-3,-3],P:[2,-5],Q:[-2,-1],R:[5,3],S:[-5,-2],T:[2,-1],U:[-4,1],V:[-3,-1],W:[-3,5],X:[3,1],Y:[-2,3],Z:[2,-3] };
var grid = { size: 15, width: null, height: null }

function snap(x,y){
	if (typeof y === 'undefined') { return Math.round(x/grid.size)*grid.size; }
	return { x: Math.round(x/grid.size)*grid.size, y: Math.round(y/grid.size)*grid.size };
}
function blow(x,y){
	if (typeof y === 'undefined') { return x * grid.size; }
	return { x: x * grid.size, y: y * grid.size };
}	

// define vars for application use
var interface = {
	window_w: $(window).width(),
	window_h: $(window).height()
};
var message = {
	unique_url: null,
	publickey: null,
	c4secrets: false,
	is_compressed: false,
	is_decrypted: false
};

// start paperjs will be closed at end of document
window.onload = function(){
paper.setup('message');
// create tools
tool_decrypt = new Tool();
tool_notool = new Tool();



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
// noch nicht überarbeitet
function switchtool(tool){
	if(tool == 'lastUsed'){
		var lasttool = $('body').attr('data-toollastused');
		if(lasttool == 'decrypt'){ tool = 'decrypt'; }
		else { tool = 'notool'; }
	}
	console.log(tool+' tool');
	// switch to E N C R Y P T tool
	if(tool == 'decrypt'){
		// conserve
		layer_message = layer_decrypt.clone();

		layer_decrypt.activate();
		tool_decrypt.activate();
		$('body').attr('data-tool','decrypt');

		$('body').attr('data-tool','decrypt').attr('data-toollastused','decrypt');
		$('menu#decrypt > a.button').addClass('active');
		$('#password').prop("disabled",false).attr('type','text').focus();
		return;
	}
	if(tool == 'notool'){
		$('body').attr('data-tool','notool').attr('data-toollastused','notool');
		$('menu#decrypt').removeClass('open');
		$('menu#decrypt > a.button').removeClass('active');
		$('#password').prop("disabled",true).attr('type','password');
		layer_message.removeChildren();
		tool_notool.activate();
	}
}
function validPW(){
	var pw = $('#password').val();
	pw = pw.replace(/[^a-z0-9]/gi,'');
	$('#password').val(pw);
	return pw;
}
function UndoDecryption(){
	if(message.is_decrypted == false){
		return false;
	}
	layer_decrypt.removeChildren();
	layer_decrypt = layer_message.clone();
	layer_decrypt.visible = true;
	layer_message.visible = false;
	
	view.update(true);
	message.is_decrypted = false;
}
function StartDecryption(){
	if(message.is_decrypted == true){
		return false;
	}
	layer_decrypt.visible = true;
	layer_message.visible = false;

	view.update(true);
}
// noch nicht überarbeitet
function decrypt(key){
	var pw = key.replace(/[^a-z0-9]/gi,'');
	if(!pw || pw.length < 1){
		UndoDecryption();
		return;
	}
	StartDecryption();
	
	layer_decrypt.removeChildren();
	layer_decrypt = layer_message.clone();
	var countpaths = layer_decrypt._children.length;

	// pw in zeichen aufspalten
	var pw_c = pw.split('');
	var pw_l = pw_c.length;

	var salt=1;
	var modi=0;
	// go through password characters
	for (var i = 0; i < pw_l; i++) {
		var key = pw_c[i];
		// go through single paths of drawing
		for (var p = 0; p < countpaths; p++){
			var thispath = layer_decrypt._children[p];
			var pathlength = thispath._segments.length;
			// go through segments
			for (var s = modi; s < pathlength; salt++) {
				var move = {
					x:(matrix[key][0]) * grid.size,
					y:(matrix[key][1]) * grid.size
				};
				var movex2, movey2;
				if(modi == 0){ movex2 = -move.x; }
				if(modi == 1){ movey2 = -move.y; }
				if(modi == 2){ movex2 = move.x; }
				if(modi == 3){ movey2 = move.y; }
				if(salt % 4 == 1){ movex2 = move.x * 2; }
				if(salt % 4 == 2){ movex2 = move.y; movey2 = move.x; }
				if(salt % 4 == 3){ movex2 = -move.y; movey2 = -move.x; }
				if(!movex2){movex2 = grid.size;}
				if(!movey2){movey2 = grid.size;}
				thispath._segments[s].point.x -= movex2;
				thispath._segments[s].point.y -= movey2;
				s = s+4;
			}
		}
		modi++; if(modi>3){modi=0;}
	}
	message.is_decrypted = true;
	layer_message.visible = false;
	layer_decrypt.visible = true;
	view.update(true);
}
function listen(){
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
function loadMessage(){
	var message = $('#openmessage').text();
	project.importJSON(message);
	// loop throug layers and delete empty
	var layernum = project._children.length;
	for (var i = 0; i < layernum; i++) {
		if(project._children[i]._children.length < 1){
			project._children[i].remove();
		} else {
			layer_message = new Layer();
			layer_message.name = 'message';
			layer_message.addChildren(project._children[i]._children);

			layer_decrypt = new Layer();
			layer_decrypt.name = 'decrypt';
			layer_decrypt = layer_message.clone();
			layer_decrypt.activate();

			layer_message.visible = false;
		}
	}
	view.update(true);
}







loadMessage();
// start with tools
switchtool('notool');

if($('body').attr('data-listen') == 1){
	setInterval(function(){
		listen();
	}, 7500);
}



// Handle I N T E R F A C E  - - - - - - - - - - - - - - - - - - - - - - - - - - -
$('menu a').click(function(){
	var execute = $(this).attr('data-execute');
	if(!execute){
		var execute = $(this).parent().attr('data-execute');
	}
	if(!execute){ return; }
	if($(this).hasClass('inactive')){ return false; }
	if($(this).parent('.contai').hasClass('inactive')){ return false; }
	if($(this).parent('menu').hasClass('inactive')){ return false; }

	if(execute == 'decrypt'){
		if( $('body').attr('data-tool') == 'decrypt'){
			switchtool('notool');
		} else {
			switchtool('decrypt');
		}
	}
	if(execute == 'export-svg'){ downloadSVG(); console.log('try to export'); }
});


function menues(menu){
	$('menu').removeClass('open');
	if(menu == 'close'){
		console.log('close all menues');
		$('body').removeClass('menuopen');
		interface.prevent_input = false;
		switchtool('lastUsed');
		return;
	}
	menu.addClass('open');
	console.log('open menu');
	$('body').addClass('menuopen');
	interface.prevent_input = true;
	switchtool('notool');
}
$('menu .unfold').click(function(){
	if( $(this).parents('menu').hasClass('open') ){
		menues('close');
		return;
	}
	menues( $(this).parents('menu') );
});
$('canvas').click(function(){
	if($('body').hasClass('menuopen')){
		menues('close');
	}
});




$('#password').keyup(function() {
	var pw = validPW();
	decrypt(pw);
});
$('#popups ul a.closepopup').click(function(){
	popup();
});
$('#popups ul.message-recieved a.openmessage').click(function(){
	popup();
});
if( $('.contactmail').length > 0 ){
	setTimeout(function(){
		var url = 'crytch.com';
		$('.contactmail').attr('href','mailto:secret@'+url);
	}, 2500);
}

// end paper
}