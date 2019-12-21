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
var tool_decrypt, tool_notool, layer_decrypt, layer_message, layer_interface, background;

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
var style = {
	background: '#ffffff',
	grey: '#bbbbbb',
	path: {
		strokeColor: '#000000',
		strokeWidth: 2
	}
};
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
		return true;
	}
	$('#popups ul.'+popup).show();
	$('#popups').fadeIn();
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
	if(tool == 'decrypt'){
		// conserve
		layer_message = layer_decrypt.clone();

		layer_decrypt.activate();
		tool_decrypt.activate();
		$('body').attr('data-tool','decrypt');

		$('body').attr('data-tool','decrypt').attr('data-toollastused','decrypt');
		$('menu#decrypt > a.button').addClass('active');
		$('menu#decrypt').addClass('open');
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
	// go through password characters
	for (var i = 0; i < pw_l; i++) {
		var key = pw_c[i];
		// go through single paths of drawing
		for (var p = 0; p < countpaths; p++){
			var thispath = layer_decrypt._children[p];
			var pathlength = thispath._segments.length;
			// go through segments
			for (var s = (i % 4); s < pathlength; s++) {
				var prex = null;
				var manip = { x:1, y:1 };
				if(s % 5 > 0){ manip.x = matrix[key][0]; }
				if(s % 5 < 3){ manip.y = matrix[key][1]; }

				if(salt % 4 > 2){ manip.x = manip.x * (-1); }
				if(salt % 4 < 0){ manip.x = manip.x * (-1); }

				if((salt+s) % 4 > 2){ var prex = manip.x; manip.x = manip.y; }
				if((salt+s) % 4 < 0){ if(prex){ manip.y = prex; } else { manip.y = manip.x; } }

				if(i<2){
					manip.x = Math.floor(manip.x *0.5);
					manip.y = Math.floor(manip.y *0.5);
				} else if(i<3){
					manip.x = Math.ceil(manip.x *0.5);
					manip.y = Math.ceil(manip.y *0.5);
				} else if(i>10){
					manip.x = Math.floor(manip.x *(i*0.1));
					manip.y = Math.floor(manip.y *(i*0.1));
				}

				thispath._segments[s].point.x -= blow(manip.x);
				thispath._segments[s].point.y -= blow(manip.y);
				salt++;
			}
		}
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
var downloadDataUri = function(options) {
	if(!options){ return; }
	$.isPlainObject(options) || (options = {data: options});
	options.filename || (options.filename = "download." + options.data.split(",")[0].split(";")[0].substring(5).split("/")[1]);
	options.url || (options.url = "https://download-data-uri.appspot.com/");
	$('<form method="post" action="'+options.url+'" style="display:none"><input type="hidden" name="filename" value="'+options.filename+'"/><input type="hidden" name="data" value="'+options.data+'"/></form>').submit().remove();
}
function downloadSVG(){
	background = new Shape.Rectangle({
		from: [0,0],
		to: [blow(grid.width), blow(grid.height)],
		fillColor: style.background
	});
	layer_interface.addChild(background);
	var svg = project.exportSVG({ asString: true });
	downloadDataUri({
		data: 'data:image/svg+xml;base64,' + btoa(svg),
		filename: 'crytch.svg'
	});
	background.remove();
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

			layer_message.visible = false;
		}
	}
	layer_interface = new Layer();
	layer_interface.sendToBack();
	layer_decrypt.activate();
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
		$('body').removeClass('menuopen');
		interface.prevent_input = false;
		switchtool('lastUsed');
		return;
	}
	menu.addClass('open');
	$('body').addClass('menuopen');
	interface.prevent_input = true;
	switchtool('notool');
}
$('menu .closemenu').click(function(event){
	// close menu definetly: click AND hover
	$('menu').removeClass('hover');
	menues('close');
	event.stopPropagation();
});
$('menu .unfold').click(function(){
	if( !$(this).parents('menu').hasClass('open') ){
		// keep menu open once it was clicked
		menues( $(this).parents('menu') );
	}
});
$('canvas').click(function(){
	if($('body').hasClass('menuopen')){
		// close menues when click on canvas
		menues('close');
	}
});
$(".corner.tl menu").hover(function(){
		$(this).addClass('hover');
	},function(){
		$(this).removeClass('hover');
});
$("menu").hover(function(){
		PreviewPath('hide');
		interface.prevent_input = true;
	},function(){
		PreviewPath('show');
		interface.prevent_input = false;
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