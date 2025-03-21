// C R Y T C H
// Encrypt a Sketch at crytch.com
// Concept by Leon Lukas Plum & Mori Waan
// Code by Mori Waan, Typeface by Leon Lukas Plum
// 2016+17 Bauhaus University Weimar, Germany

// works with paper.js
// We <3 Jürg Lehni

function setCookie(cname,cvalue,exdays){ var d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000)); var expires = "expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + "; " + expires;}
function rand(min, max) { return Math.floor(Math.random() * (max - min +1)) + min; }
function status(msg){ $('#status').text(msg); }


// install paper js
paper.install(window);
// define vars for paperscript
var tool_pen, tool_text, tool_move, tool_encrypt, tool_notool, layer_interface, layer_pen, layer_text, layer_conserve, path, background;

var matrix = { 0:[-4,3],1:[3,5],2:[4,2],3:[3,-4],4:[-3,-4],5:[-1,3],6:[4,-1],7:[1,3],8:[-3,2],9:[-4,4],a:[-1,5],b:[2,3],c:[1,3],d:[-2,4],e:[1,-4],f:[-2,-2],g:[3,2],h:[-3,3],i:[-2,1],j:[-2,-5],k:[2,2],l:[4,-3],m:[4,3],n:[1,-3],o:[1,5],p:[-2,-3],q:[-3,1],r:[-2,-4],s:[2,4],t:[5,-2],u:[4,1],v:[-4,-3],w:[-4,1],x:[-1,-4],y:[-1,4],z:[-4,-5],A:[-3,4],B:[2,-2],C:[3,-3],D:[3,-1],E:[4,4],F:[-2,2],G:[-1,-2],H:[-1,2],I:[3,-2],J:[1,-2],K:[1,4],L:[5,1],M:[-4,-2],N:[5,-1],O:[-3,-3],P:[2,-5],Q:[-2,-1],R:[5,3],S:[-5,-2],T:[2,-1],U:[-4,1],V:[-3,-1],W:[-3,5],X:[3,1],Y:[-2,3],Z:[2,-3] };
var grid = { size: 15, width: null, height: null }
var letters = {a:{s:3,p:[[0,3],[1,2],[2,2],[3,3],[3,7],[3,6],[2,7],[1,7],[0,6],[0,5],[1,4],[2,4],[3,4],[2,4]]},b:{s:3,p:[[0,0],[0,7],[2,7],[3,6],[3,3],[2,2],[1,2],[0,3]]},c:{s:3,p:[[3,4],[3,3],[2,2],[1,2],[0,3],[0,6],[1,7],[2,7],[3,6]]},d:{s:3,p:[[3,0],[3,7],[3,6],[2,7],[1,7],[0,6],[0,3],[1,2],[3,2]]},e:{s:3,p:[[0,4],[3,4],[3,3],[2,2],[1,2],[0,3],[0,6],[1,7],[2,7],[3,6],[2,7]]},f:{s:2,p:[[2,0],[1,0],[0,1],[0,7],[0,3],[2,3]]},g:{s:3,p:[[3,6],[2,7],[1,7],[0,6],[0,3],[1,2],[3,2],[3,8],[2,9],[1,9],[0,8]]},h:{s:3,p:[[0,0],[0,7],[0,3],[1,2],[2,2],[3,3],[3,7]]},i:{s:2,p:[[1,2],[2,2],[2,0],[0,0],[0,2],[1,2],[1,7],[0,7],[2,7],[0,7],[1,7],[1,2],[0,2],[0,0]]},j:{s:2,p:[[1,2],[0,2],[0,0],[2,0],[2,2],[1,2],[1,8],[0,9]]},k:{s:3,p:[[0,0],[0,7],[0,3],[1,2],[2,2],[3,3],[3,4],[2,5],[1,5],[0,4],[3,7]]},l:{s:2,p:[[0,4],[2,2],[2,0],[0,0],[0,6],[1,7],[2,7]]},m:{s:6,p:[[0,2],[0,7],[0,3],[1,2],[2,2],[3,3],[3,7],[3,3],[4,2],[5,2],[6,3],[6,7]]},n:{s:3,p:[[0,2],[0,7],[0,3],[1,2],[2,2],[3,3],[3,7]]},o:{s:3,p:[[0,3],[0,7],[2,7],[3,6],[3,2],[1,2],[0,3]]},p:{s:3,p:[[0,2],[0,9],[0,7],[2,7],[3,6],[3,3],[2,2],[1,2],[0,3]]},q:{s:3,p:[[3,6],[2,7],[1,7],[0,6],[0,3],[1,2],[3,2],[3,9]]},r:{s:3,p:[[0,7],[3,7],[1,7],[1,3],[2,2],[3,2],[3,3]]},s:{s:3,p:[[3,4],[3,3],[2,2],[1,2],[0,3],[0,4],[1,4],[2,5],[3,5],[3,6],[2,7],[1,7],[0,6],[0,5]]},t:{s:3,p:[[1,1],[1,2],[0,2],[3,2],[1,2],[1,7],[2,7],[3,6],[3,5]]},u:{s:3,p:[[0,2],[0,6],[1,7],[2,7],[3,6],[3,7],[3,2]]},v:{s:3,p:[[0,2],[0,7],[1,7],[3,5],[3,2]]},w:{s:4,p:[[0,2],[0,6],[1,7],[2,6],[3,7],[4,6],[4,2]]},x:{s:4,p:[[0,3],[0,2],[2,4],[4,2],[4,3],[4,2],[2,4],[2,5],[0,7],[0,6],[0,7],[2,5],[4,7],[4,6]]},y:{s:3,p:[[0,2],[0,6],[1,7],[2,7],[3,6],[3,2],[3,8],[2,9],[1,9],[0,8]]},z:{s:3,p:[[0,3],[0,2],[3,2],[3,3],[0,6],[0,7],[3,7],[3,6]]},"ß":{s:4,p:[[0,2],[1,2],[1,7],[1,1],[2,0],[3,0],[4,1],[4,2],[3,3],[4,4],[4,6],[3,7]]},A:{s:4,p:[[0,7],[0,1],[1,0],[3,0],[4,1],[4,7],[4,4],[0,4]]},B:{s:4,p:[[0,0],[3,0],[4,1],[4,2],[3,3],[0,3],[3,3],[4,4],[4,6],[3,7],[0,7],[0,0]]},C:{s:4,p:[[4,2],[4,1],[3,0],[1,0],[0,1],[0,6],[1,7],[3,7],[4,6],[4,5]]},D:{s:4,p:[[0,0],[0,7],[3,7],[4,6],[4,1],[3,0],[0,0]]},E:{s:4,p:[[4,1],[4,0],[0,0],[0,4],[3,4],[3,3],[3,5],[3,4],[0,4],[0,7],[4,7],[4,6]]},F:{s:4,p:[[4,1],[4,0],[0,0],[0,4],[3,4],[3,3],[3,5],[3,4],[0,4],[0,7]]},G:{s:4,p:[[2,3],[4,3],[4,7],[4,6],[3,7],[1,7],[0,6],[0,1],[1,0],[3,0],[4,1],[4,2]]},H:{s:4,p:[[0,0],[0,7],[0,3],[4,3],[4,0],[4,7]]},I:{s:2,p:[[0,0],[2,0],[1,0],[1,7],[0,7],[2,7]]},J:{s:3,p:[[0,1],[0,0],[3,0],[3,6],[2,7],[1,7],[0,6],[0,4]]},K:{s:4,p:[[0,0],[0,7],[0,3],[2,3],[4,1],[4,0],[4,1],[2,3],[4,5],[4,7]]},L:{s:4,p:[[0,0],[0,7],[4,7]]},M:{s:6,p:[[0,7],[0,0],[3,3],[6,0],[6,7],[6,0],[3,3],[0,0],[0,7]]},N:{s:4,p:[[0,7],[0,0],[4,4],[4,0],[4,7],[4,0],[4,4],[0,0],[0,7]]},O:{s:4,p:[[0,1],[0,6],[1,7],[3,7],[4,6],[4,5],[4,1],[3,0],[1,0],[0,1]]},P:{s:4,p:[[0,4],[3,4],[4,3],[4,1],[3,0],[0,0],[0,7],[0,0],[3,0],[4,1],[4,3],[3,4],[0,4]]},Q:{s:5,p:[[5,7],[5,8],[4,8],[3,7],[1,7],[0,6],[0,1],[1,0],[3,0],[4,1],[4,6],[3,7],[4,6],[4,1]]},R:{s:4,p:[[0,7],[0,0],[3,0],[4,1],[4,3],[3,4],[0,4],[3,4],[4,5],[4,7],[4,5]]},S:{s:4,p:[[4,2],[4,1],[3,0],[1,0],[0,1],[0,2],[1,3],[3,3],[4,4],[4,6],[3,7],[1,7],[0,6],[0,5]]},T:{s:4,p:[[0,1],[0,0],[4,0],[4,1],[4,0],[2,0],[2,7],[1,7],[3,7]]},U:{s:4,p:[[0,0],[0,6],[1,7],[3,7],[4,6],[4,0],[4,6],[3,7],[1,7],[0,6],[0,0]]},V:{s:4,p:[[0,0],[0,5],[2,7],[4,5],[4,0]]},W:{s:6,p:[[0,0],[0,6],[1,7],[2,7],[3,6],[3,0],[3,6],[4,7],[5,7],[6,6],[6,0],[6,6],[5,7],[4,7]]},X:{s:6,p:[[0,0],[3,3],[6,0],[3,3],[3,4],[0,7],[3,4],[6,7],[3,4],[0,7],[3,4],[3,3],[6,0]]},Y:{s:4,p:[[0,0],[0,2],[2,4],[4,2],[4,0],[4,2],[2,4],[2,7],[0,7],[4,7]]},Z:{s:4,p:[[0,1],[0,0],[4,0],[4,1],[0,5],[0,7],[4,7],[4,5]]},1:{s:3,p:[[0,2],[0,1],[1,0],[2,0],[2,7],[0,7],[3,7]]},2:{s:4,p:[[0,2],[0,1],[1,0],[3,0],[4,1],[4,3],[3,4],[1,4],[0,5],[0,7],[4,7],[4,6]]},3:{s:4,p:[[0,1],[0,0],[4,0],[4,1],[2,3],[4,5],[4,6],[3,7],[1,7],[0,6],[0,5]]},4:{s:4,p:[[4,5],[0,5],[0,3],[3,0],[3,7],[1,7],[4,7],[1,7],[3,7],[3,0],[0,3],[0,5],[4,5]]},5:{s:4,p:[[4,1],[4,0],[0,0],[0,3],[3,3],[4,4],[4,6],[3,7],[0,7],[3,7],[4,6],[4,4],[3,3],[0,3]]},6:{s:4,p:[[4,2],[4,1],[3,0],[1,0],[0,1],[0,6],[1,7],[3,7],[4,6],[4,4],[3,3],[1,3],[0,4]]},7:{s:4,p:[[0,0],[4,0],[4,2],[0,7],[4,2],[4,0],[0,0]]},8:{s:3,p:[[1,0],[2,0],[3,1],[3,2],[0,5],[0,6],[1,7],[2,7],[3,6],[3,5],[0,2],[0,1],[1,0],[0,1]]},9:{s:4,p:[[0,6],[1,7],[3,7],[4,6],[4,1],[3,0],[1,0],[0,1],[0,3],[1,4],[3,4],[4,3]]},0:{s:4,p:[[0,1],[0,6],[4,2],[0,6],[1,7],[3,7],[4,6],[4,5],[4,1],[3,0],[1,0],[0,1]]},period:{s:2,p:[[0,5],[0,7],[2,7],[2,5],[0,5]]},comma:{s:2,p:[[2,7],[0,7],[0,5],[2,5],[2,7],[2,8],[1,9]]},question:{s:3,p:[[1,5],[2,5],[2,7],[0,7],[0,5],[1,5],[1,4],[3,2],[3,1],[2,0],[1,0],[0,1],[0,2],[0,1]]},exclamation:{s:2,p:[[1,5],[2,5],[2,7],[0,7],[0,5],[1,5],[1,0]]},ampersand:{s:5,p:[[5,4],[2,7],[1,7],[0,6],[0,5],[3,2],[3,1],[2,0],[1,0],[0,1],[0,2],[5,7],[0,2],[0,1]]},dash:{s:3,p:[[0,4],[3,4]]},bracketopen:{s:1,p:[[1,0],[0,0],[0,7],[1,7]]},bracketclosed:{s:1,p:[[0,0],[1,0],[1,7],[0,7]]},roundbracketopen:{s:1,p:[[1,0],[0,1],[0,6],[1,7],[0,6],[0,1],[1,0]]},roundbracketclosed:{s:1,p:[[0,0],[1,1],[1,6],[0,7],[1,6],[1,1],[0,0]]},curlybracketopen:{s:2,p:[[2,0],[1,1],[1,2],[0,3],[0,4],[1,5],[1,6],[2,7]]},curlybracketclosed:{s:2,p:[[0,0],[1,1],[1,2],[2,3],[2,4],[1,5],[1,6],[0,7]]},colon:{s:2,p:[[2,4],[0,4],[0,2],[2,2],[2,4],[0,5],[0,7],[2,7],[2,5],[0,5],[2,5]]},semicolon:{s:2,p:[[2,4],[0,4],[0,2],[2,2],[2,4],[0,5],[0,7],[2,7],[2,8],[1,9],[2,8],[2,7],[2,5],[0,5]]},euro:{s:4,p:[[4,0],[2,0],[1,1],[1,3],[3,3],[0,3],[1,3],[1,4],[3,4],[0,4],[1,4],[1,6],[2,7],[4,7]]},dollar:{s:4,p:[[4,0],[1,0],[0,1],[0,2],[1,3],[2,3],[2,1],[2,6],[2,3],[3,3],[4,4],[4,6],[3,7],[0,7]]},sterling:{s:4,p:[[4,2],[4,1],[3,0],[2,0],[1,1],[1,4],[0,4],[3,4],[1,4],[1,6],[0,7],[3,7],[4,6]]},at:{s:4,p:[[3,5],[2,4],[1,5],[1,6],[4,6],[4,3],[3,2],[1,2],[0,3],[0,8],[1,9],[3,9],[4,8]]},underscore:{s:3,p:[[0,7],[3,7]]},slash:{s:7,p:[[0,7],[7,0]]},pipe:{s:2,p:[[1,0],[1,7]]},backslash:{s:7,p:[[0,0],[7,7]]},apostrophe:{s:2,p:[[1,4],[2,3],[2,0],[0,0],[0,2],[2,2]]},quotationenopen:{s:5,p:[[1,-2],[0,-1],[0,2],[2,2],[2,0],[0,0],[2,0],[2,2],[3,0],[5,0],[5,2],[3,2],[3,-1],[4,-2]]},quotationenclosed:{s:5,p:[[1,4],[2,3],[2,0],[0,0],[0,2],[2,2],[3,0],[5,0],[5,2],[3,2],[3,0],[3,2],[5,2],[5,3],[4,4]]},quotationdeopen:{s:5,p:[[1,9],[2,8],[2,5],[0,5],[0,7],[2,7],[3,5],[5,5],[5,7],[3,7],[3,5],[3,7],[5,7],[5,8],[4,9]]},a_acute:{s:3,p:[[0,3],[1,2],[2,2],[3,1],[2,2],[3,3],[3,7],[3,6],[2,7],[1,7],[0,6],[0,5],[1,4],[3,4]]},a_grave:{s:3,p:[[0,3],[1,2],[0,1],[1,2],[2,2],[3,3],[3,7],[3,6],[2,7],[1,7],[0,6],[0,5],[1,4],[3,4]]},e_acute:{s:3,p:[[0,4],[3,4],[3,3],[2,2],[3,1],[2,2],[1,2],[0,3],[0,6],[1,7],[2,7],[3,6]]},e_grave:{s:3,p:[[0,4],[3,4],[3,3],[2,2],[1,2],[0,1],[1,2],[0,3],[0,6],[1,7],[2,7],[3,6]]},c_cedille:{s:3,p:[[3,4],[3,3],[2,2],[1,2],[0,3],[0,6],[1,7],[2,7],[2,8],[1,8]]},asterisk:{s:4,p:[[0,4],[4,4],[2,4],[2,2],[2,6],[2,4],[1,5],[3,3],[2,4],[1,3],[3,5]]},plus:{s:4,p:[[0,4],[4,4],[2,4],[2,2],[2,6]]},multiply:{s:4,p:[[0,2],[4,6],[2,4],[4,2],[0,6]]},hashtag:{s:4,p:[[1,2],[1,6],[1,3],[0,3],[4,3],[1,3],[1,5],[0,5],[4,5],[3,5],[3,6],[3,2]]},ae:{s:6,p:[[0,3],[1,2],[2,2],[3,3],[3,6],[2,7],[1,7],[0,6],[0,5],[1,4],[6,4],[6,3],[5,2],[4,2],[3,3],[3,6],[4,7],[5,7],[6,6],[5,7],[4,7],[3,6],[3,3],[4,2],[5,2],[6,3],[6,4],[1,4]]},oe:{s:6,p:[[3,4],[3,6],[2,7],[0,7],[0,3],[1,2],[3,2],[3,4],[6,4],[6,3],[5,2],[4,2],[3,3],[3,6],[4,7],[5,7],[6,6],[5,7],[4,7],[3,6],[3,3],[4,2],[5,2],[6,3],[6,4],[3,4],[3,2],[1,2]]},ue:{s:6,p:[[0,2],[0,6],[1,7],[2,7],[3,6],[3,2],[3,4],[6,4],[6,3],[5,2],[4,2],[3,3],[3,6],[4,7],[5,7],[6,6],[5,7],[4,7],[3,6],[3,3],[4,2],[5,2],[6,3],[6,4],[3,4],[3,2],[3,6],[2,7]]},AE:{s:8,p:[[0,7],[0,1],[1,0],[3,0],[4,1],[4,4],[0,4],[7,4],[7,3],[7,5],[7,4],[4,4],[4,7],[8,7],[8,6],[8,7],[4,7],[4,0],[8,0],[8,1],[8,0],[4,0],[4,7],[8,7],[8,6],[8,7],[4,7],[4,4]]},OE:{s:8,p:[[8,6],[8,7],[1,7],[0,6],[0,1],[1,0],[1,0],[8,0],[8,1],[8,0],[4,0],[4,4],[7,4],[7,3],[7,5],[7,4],[4,4],[4,7],[4,4],[7,4],[7,5],[7,3],[7,4],[4,4],[4,0],[8,0],[8,1],[8,0]]},UE:{s:8,p:[[0,0],[0,6],[1,7],[3,7],[4,6],[4,0],[8,0],[8,1],[8,0],[4,0],[4,4],[7,4],[7,3],[7,5],[7,4],[4,4],[4,7],[8,7],[8,6],[8,7],[4,7],[4,4],[7,4],[7,5],[7,3],[7,4],[4,4],[4,0]]}};

function snap(x){
	if( Array.isArray(x) || typeof x === 'object' ){
		for (var i in x) {
			x[i] = Math.round(x[i]/grid.size)*grid.size;
		}
		return x;
	}
	if( Number.isInteger(parseInt(x)) ){ x = parseInt(x); }
	if( Number.isInteger(x) ){ return Math.round(x/grid.size)*grid.size; }
	console.log('zero');
	return 0;
}
function blow(x){
	if( Array.isArray(x) || typeof x === 'object' ){
		for (var i in x) {
			x[i] = Math.round(x[i] * grid.size );
		}
		return x;
	}
	if( Number.isInteger(parseInt(x)) ){ x = parseInt(x); }
	if( Number.isInteger(x) ){ return Math.round(x * grid.size ); }
	console.log('zero');
	return 0;
}
function shrink(x){
	if( Array.isArray(x) || typeof x === 'object' ){
		for (var i in x) {
			x[i] = Math.round(x[i]/grid.size);
		}
		return x;
	}
	if( Number.isInteger(parseInt(x)) ){ x = parseInt(x); }
	if( Number.isInteger(x) ){ return Math.round(x/grid.size); }
	console.log('zero');
	return 0;
}

// define vars for application use
var style = {
	background: '#ffffff',
	grey: '#bbbbbb',
	path: {
		strokeColor: '#000000',
		strokeWidth: 2,
		strokeCap: 'round',
		strokeJoin: 'round'
	}
};
var interface = {
	window_w: $(window).width(),
	window_h: $(window).height(),
	device: 'desktop',
	active_tool: null,
	last_tool: null,
	pathselected: false,
	pathpreview: null,
	segmenthighlight: null,
	highlight_home: blow([-10,-10]),
	prevent_input: false
};
var message = {
	unique_url: null,
	publickey: null,
	c4secrets: false,
	is_compressed: false,
	is_encrypted: false,
	maxpaths: 160,
	bounds: {
		x:0,
		y:0,
		w:0,
		h:0
	}
};
var type = {
	cursor: null,
	cursor_home: blow({x:4,y:6}),
	scale: 1,
	leading: 1,
	whitespace: 2,
	lineheight: 7
}
var pen = {
	pathlength: 0,
	dragged: 0,
	path_new: null
}
var hit_options = {
	segments: true,
	stroke: true,
	fill: false,
	tolerance: Math.floor(grid.size / 3)
};
grid.width = Math.floor(interface.window_w / grid.size);
grid.height = Math.floor(interface.window_h / grid.size);
if(interface.window_w <= 460 || interface.window_h <= 420 ){ interface.device = 'mobile'; }

// start paperjs will be closed at end of document
window.onload = function(){
paper.setup('message');
// create tools
tool_pen = new Tool(); tool_text = new Tool(); tool_move = new Tool(); tool_encrypt = new Tool(); tool_notool = new Tool();
// create layers
layer_interface = new Layer(); layer_conserve = new Layer(); layer_pen = new Layer(); layer_text = new Layer();
layer_interface.name = 'interface';
layer_interface.sendToBack();

layer_pen.name = 'message';
layer_text.name = 'message';
layer_conserve.visible = false;

layer_pen.activate();

function Cursor(action,to){
	if(!type.cursor){ action = 'create'; }
	if(action == 'show'){ type.cursor.visible = true; return; }
	if(action == 'hide'){ type.cursor.visible = false; return; }
	if(action == 'moveto'){ type.cursor.position = to; return; }
	if(action == 'backspace'){
		if (typeof to === 'undefined'){
			// to jump backwards you shomehow need 2 more than you think ?!
			action = 'move'; var to = 0-type.whitespace-2;
		} else {
			type.cursor.position = to;
			return type.cursor.position;
		}
	}
	if(action == 'space'){ action = 'move'; to = type.whitespace; }
	if(action == 'move'){
		if (typeof to === 'undefined'){
			var to = type.whitespace;
		}
		if(to < grid.size && to > (0-grid.size) ){
			// 'to' given in grid steps
			to = blow(to);
		}
		type.cursor.position.x = type.cursor.position.x + to + blow( type.leading*type.scale );
		if(type.cursor.position.x > (interface.window_w - blow(type.whitespace+2)) ){
			action = 'jumpline';
		}
		if(type.cursor.position.x < type.cursor_home.x ){
			type.cursor.position.x = type.cursor_home.x;
			action = 'jumpline'; to = 'up';
		}
	}
	if(action == 'jumpline'){
		type.cursor.position.x = snap(type.cursor_home.x);
		if(to == 'up'){
			type.cursor.position.y = Math.max(type.cursor_home.y, type.cursor.position.y - blow(3) );
		} else {
			type.cursor.position.y = type.cursor.position.y + blow( (type.lineheight+(type.leading*2))*type.scale );
		}
		return type.cursor.position;
	}
	if(action == 'create'){
		type.cursor = new Path({ segments:[[0,0],[0, blow(type.lineheight) ]] });
		type.cursor.style = style.path;
		type.cursor.strokeColor = style.grey;
		type.cursor.strokeWidth++;
		layer_interface.addChild(type.cursor);
		type.cursor.pivot = new Point(0,0);
		type.cursor.visible = false;
		action = 'reset';
	}
	if(action == 'reset'){
		type.cursor.position = new Point(snap(type.cursor_home));
	}
	return type.cursor.position;
}
function PreviewPath(action,last_dock,mouse_pos){
	if(!interface.pathpreview){ action = 'create'; }
	if(action == 'show'){ interface.pathpreview.visible = true; return; }
	if(action == 'hide'){ interface.pathpreview.visible = false; return; }
	if(action == 'update'){
		interface.pathpreview.lastSegment.point = mouse_pos;
		interface.pathpreview.firstSegment.point = last_dock;
		interface.pathpreview.visible = true;
		return;
	}
	if(action == 'reset'){
		interface.pathpreview.visible = false;
		interface.pathpreview.firstSegment.point = interface.highlight_home;
		interface.pathpreview.lastSegment.point = interface.highlight_home;
		return;
	}
	if(action == 'create'){
		interface.pathpreview = new Path({segments:[interface.highlight_home,interface.highlight_home]});
		interface.pathpreview.visible = false;
		layer_interface.addChild(interface.pathpreview);
		interface.pathpreview.style = style.path;
		interface.pathpreview.strokeColor = style.grey;
		return;
	}
	return false;
}
function highlightSegment(action,pos){
	if(!interface.segmenthighlight){ action = 'create'; }
	if(action == 'show'){ interface.segmenthighlight.visible = true; return; }
	if(action == 'hide'){ interface.segmenthighlight.visible = false; return; }
	if(action == 'pos'){
		interface.segmenthighlight.position = pos;
		interface.segmenthighlight.visible = true;
		return true;
	}
	if (typeof pos === 'undefined'){
		var pos = interface.highlight_home;
	}
	if(action == 'reset'){
		interface.segmenthighlight.visible = false;
		interface.segmenthighlight.position = pos;
		return true;
	}
	if(action == 'recreate'){
		if(interface.segmenthighlight){
			pos = interface.segmenthighlight.position;
			interface.segmenthighlight.remove();
		}
		action = 'create';
	}
	if(action == 'create'){
		var size = Math.max(2, Math.ceil(style.path.strokeWidth*0.5) );
		interface.segmenthighlight = new Path.Circle(pos,size);
		interface.segmenthighlight.visible = false;
		layer_interface.addChild(interface.segmenthighlight);

		interface.segmenthighlight.style = {
			fillColor: style.grey,
			strokeColor: style.grey,
			strokeWidth: 5
		};

		if(style.path.strokeWidth > 14){ interface.segmenthighlight.strokeWidth = 8; }
		return true;
	}
	return false;
}
function startNewPath(){
	path = new Path();
	path.style = style.path;
	pen.pathlength = 0;
	highlightSegment('show');
	PreviewPath('reset');
}
function closePath(){
	if(!path){ return false; }
	path.closed = true;
	startNewPath();
}
function _color(choice){
	if(!choice){ choice = 'rand'; }
	if(choice == 'black' || choice == 'b'){ return '#000000'; }
	if(choice == 'white' || choice == 'w'){ return '#ffffff'; }
	if(choice == 'red' || choice == 'r'){ return '#ff0000'; }
	if(choice == 'grey'){ return style.grey; }
	if(choice == 'blue'){ return '#0000ff'; }
	if(choice == 'green'){ return '#00ff00'; }
	if(choice == 'dark'){ return '#555555'; }
	if(choice == 'light'){ return '#bbbbbb'; }
	if(choice == 'rand'){ return '#'+Math.floor(Math.random()*16777215).toString(16); }
	console.log(choice);
}
function reStyle(attr,value){
	if(attr == 'background'){
		var newcolor = _color(value);
		if(newcolor == '#000000'){
			$('body').addClass('bl');
			style.grey = _color('dark');
		} else {
			$('body').removeClass('bl');
			style.grey = _color('light');
		}
		$('body').css('background-color',newcolor);
		style.background = newcolor;
		return true;
	}
	if(attr == 'strokewidth'){
		var newwidth = value.replace(/\D/g,'');
		newwidth = newwidth.substring( (Math.abs(newwidth.length)-2) );
		if(!newwidth){ return; }
		newwidth = Math.min(Math.max(parseInt(newwidth),1),99);

		$('#strokewidth').val(newwidth);
		if(newwidth == style.path.strokeWidth){ return; }

		if(newwidth < 8){ type.leading = 1; }
		else if(newwidth < 26){ type.leading = 2; }
		else{ type.leading = 3; }

		style.path.strokeWidth = newwidth;

		interface.pathpreview.style.strokeWidth = newwidth;
		highlightSegment('recreate');
	}
	if(attr == 'color'){
		var newcolor = _color(value);
		style.path.strokeColor = newcolor;
	}
	layer_text.style = style.path;
	layer_pen.style = style.path;
	layer_conserve.style = style.path;
	view.update(true);
	return style.path;
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
	setCookie('language',lang,50);
	if($('body').hasClass('canvasfilled')){
		popup('change-on-reload');
	} else {
		location.reload();
	}
}
function canvasFilled(options){
	var t = 0;
	for (let content of layer_text._children) {
		if( content._segments.length > 1 ){
			t++;
		} else {
			content.remove();
		}
	}
	var p = 0;
	for (let content of layer_pen._children) {
		if( content._segments.length > 1 ){
			p++;
		} else {
			if(options == 'deleteEmpty'){
				content.remove();
			}
		}
	}
	// console.log(p+' + '+t+' = '+(p+t));
	if((p+t) > message.maxpaths){
		popup('max-paths');
		message.maxpaths = message.maxpaths+10;
	}
	if((p+t) > 0){
		// canvas is filled with pretty drawings
		if(!$('body').hasClass('canvasfilled') ){
			$('body').addClass('canvasfilled');
			$('menu a.clearall').removeClass('inactive');
			$('menu a.export-svg').removeClass('inactive');
			$('menu#encrypt').removeClass('inactive');
			$('menu.tools a.move').removeClass('inactive');
		}
		return true;
	}
	// canvas is empty
	if( $('body').hasClass('canvasfilled') ){
		$('body').removeClass('canvasfilled');
		$('menu a.clearall').addClass('inactive');
		$('menu a.export-svg').addClass('inactive');
		$('menu.tools a.move').addClass('inactive');
		$('menu#encrypt, menu#send').addClass('inactive').removeClass('active');
	}
	return false;
}
function deleteObjects(object){
	if(!object){ return false; }
	object.remove();
	canvasFilled('deleteEmpty');
	return true;
}
function moveWithSteps(object,dir){
	// className given by paperjs
	if(object.className == 'Path'){
		// is whole path
		if(dir == 'right'){ object.position.x += grid.size; return true; }
		if(dir == 'left'){ object.position.x -= grid.size; return true; }
		if(dir == 'up'){ object.position.y -= grid.size; return true; }
		if(dir == 'down'){ object.position.y += grid.size; return true; }
	} else {
		// is single segment
		if(dir == 'right'){ object.point.x += grid.size; return true; }
		if(dir == 'left'){ object.point.x -= grid.size; return true; }
		if(dir == 'up'){ object.point.y -= grid.size; return true; }
		if(dir == 'down'){ object.point.y += grid.size; return true; }	
	}
	return false;
}
// noch nicht überarbeitet
function switchtool(tool){
	if(tool == 'lastUsedStrict'){
		tool = 'lastUsed';
	} else {
		canvasFilled('deleteEmpty');
	}
	PreviewPath('reset');

	if(message.is_encrypted == true && tool != 'send'){ return false; }
	if(tool == 'notool'){
		if(interface.last_tool == 'encrypt' || interface.last_tool == 'send'){
			return false;
		}
	}

	if(tool == 'lastUsed'){
		if(interface.last_tool == 'text'){ tool = 'text'; }
		else if(interface.last_tool == 'move'){ tool = 'move'; }
		else { tool = 'pen'; }
	}
	if(interface.device == 'mobile'){
		// only pen on mobile devices
		if(tool == 'text' || tool == 'move'){ tool = 'pen'; }
	}

	if(tool == 'encrypt' || tool == 'send'){
		$('menu.tools a').removeClass('active');
		$('menu.tools').addClass('inactive');
	} else {
		$('menu.tools').removeClass('inactive');
		$('.br menu').removeClass('active');
	}

	if(tool == 'pen'){
		layer_pen.activate();
		tool_pen.activate();
		interface.active_tool = 'pen';
		interface.last_tool = 'pen';
		setCookie('toollastused','pen',5);

		$('menu a').not('.pen').removeClass('active');
		$('menu.tools a.pen').addClass('active');

		$('menu#about .context').not('.pen').hide();
		$('menu#about .context.pen').show();

		startNewPath();
	} else {
		highlightSegment('hide');
	}
	if(tool == 'text'){
		layer_text.activate();
		tool_text.activate();
		interface.active_tool = 'text';
		interface.last_tool = 'text';
		setCookie('toollastused','text',5);

		Cursor('show');
		$('menu a').not('.text').removeClass('active');
		$('menu.tools a.text').addClass('active');

		$('menu#about .context').not('.text').hide();
		$('menu#about .context.text').show();
	} else {
		Cursor('hide');
	}
	if(tool == 'move'){
		tool_move.activate();
		interface.active_tool = 'move';

		$('menu a').not('.move').removeClass('active');
		$('menu.tools a.move').addClass('active');

		$('menu#about .context').not('.move').hide();
		$('menu#about .context.move').show();
	}
	if(tool == 'encrypt'){

		layer_pen.activate();
		tool_encrypt.activate();
		interface.active_tool = 'encrypt';

		$('menu#encrypt').addClass('open');
		$('menu#encrypt > a.button').addClass('active');

		$('#password').prop("disabled",false).attr('type','text').focus();
		return tool;
	} else {
		$('#password').prop("disabled",true).attr('type','password');
		layer_conserve.removeChildren();
	}
	// not really a tool
	if(tool == 'send'){
		interface.active_tool = 'send';

		$('menu#encrypt').removeClass('open active').addClass('inactive');
		$('menu#encrypt > a.button').removeClass('active');
		$('menu#send').removeClass('inactive').addClass('open onetwo');
		$('menu#send > a.button').addClass('active');
		$('#messageurl').focus().select();
		return tool;
	}
	if(tool == 'notool'){
		interface.active_tool = 'notool';
		interface.prevent_input = true;
		tool_notool.activate();
	} else {
		$('menu').removeClass('open');
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
function UndoEncryption(){
	layer_pen.removeChildren();
	layer_pen = layer_conserve.clone();
	layer_pen.activate();
	layer_text.visible = true;
	layer_pen.visible = true;
	layer_conserve.visible = false;
	
	view.update(true);
	message.is_encrypted = false;
	$('a#save').addClass('inactive');
}
function StartEncryption(){
	if(layer_text.children.length > 0){
		var contents_layer_text = layer_text.children;
		layer_pen.addChildren(contents_layer_text);
		layer_text.removeChildren();
	}
	layer_conserve.removeChildren();
	layer_conserve = layer_pen.clone();

	layer_pen.activate();
	layer_pen.visible = true;
	layer_text.visible = false;
	layer_conserve.visible = false;

	message.bounds.x = layer_conserve.bounds._x;
	message.bounds.y = layer_conserve.bounds._y;
	message.bounds.w = layer_conserve.bounds._width;
	message.bounds.h = layer_conserve.bounds._height;
	message.bounds = shrink(message.bounds);

	console.log(message.bounds);

	view.update(true);
}
// noch nicht überarbeitet
function encrypt(key){
	var pw = key.replace(/[^a-z0-9]/gi,'');
	if(!pw || pw.length < 1){
		UndoEncryption();
		return;
	}
	// valid pw
	message.publickey = pw;
	if(message.is_encrypted == false){
		StartEncryption();
	}
	
	layer_pen.removeChildren();
	layer_pen = layer_conserve.clone();
	layer_pen.activate();
	var countpaths = layer_pen._children.length;

	// pw in zeichen aufspalten
	var pw_c = pw.split('');
	var pw_l = pw_c.length;

	var salt=1;
	// go through password characters
	for (var i = 0; i < pw_l; i++) {
		var key = pw_c[i];
		// go through single paths of drawing
		for (var p = 0; p < countpaths; p++){
			var thispath = layer_pen._children[p];
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

				thispath._segments[s].point.x += blow(manip.x);
				thispath._segments[s].point.y += blow(manip.y);
				salt++;
			}
		}
	}
	message.is_encrypted = true;
	$('a#save').removeClass('inactive');
	layer_conserve.visible = false;
	layer_pen.visible = true;
	view.update(true);
}
function clearAll(){
	if(message.is_compressed == true){ window.location.assign("https://crytch.com"); return true; }
	// delete just about everything from canvas
	layer_pen.removeChildren(); layer_pen.removeChildren();
	layer_text.removeChildren(); layer_text.removeChildren();
	layer_conserve.removeChildren(); layer_conserve.removeChildren();

	Cursor('reset');
	canvasFilled();
	switchtool('lastUsed');

	$('#password').val("");
	$('#messageurl').val("");
	$('#sendtomail').val("");
	$('menu.tools').removeClass('inactive');
	$('#sendviamail.sling .container').removeClass('open');
	$('menu#finish .send a.sendtoclient').removeClass('inactive');
	view.update(true);
	console.log('restart');
	return true;
}
function fetchCanvas(){
	message.is_compressed = true;
	layer_text.remove();
	layer_conserve.remove();
	layer_interface.remove();
	return layer_pen.exportJSON();
}
function saveMessage(){
	console.log('attempt to save');
	var canvas = fetchCanvas();
	var senddata = {
		grid_size: grid.size,
		grid_width: grid.width,
		grid_height: grid.height,
		window_width: interface.window_w,
		window_height: interface.window_h,
		message: canvas,
		style_color: style.path.strokeColor,
		style_background: $('body').css('background-color'),
		style_stroke: style.path.strokeWidth,
		language: $('body').attr('data-language'),
		bounds: message.bounds
	};
	if(message.c4secrets == true){
		senddata['public_key'] = message.publickey;
	}
	console.log(senddata);
	$.post(
		"_/savemessage.php",
		senddata,
		function(){},
		'json'
	).done(function(data){
		if(data[0]['status'] == 'success'){
			message.unique_url = data[0]['url'];
			console.log('message saved to '+message.unique_url);
			$('#messageurl').text(message.unique_url);
			$('body').attr('data-url',message.unique_url);
			$('#sendviamail').attr("href", function(){ return $(this).attr("href") + message.unique_url });
			switchtool('send');
		} else { console.log('server error'); }
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
	var senddata = {
		messageurl: message.unique_url,
		sendtoemail: email
	};
	$.post(
		"_/sendviaemail.php",
		senddata,
		function(){}, 'json'
	).done(function(data){
		if(data[0]['status'] == 'success'){
			console.log('successfully sent to '+email);
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
switchtool($('body').attr('data-dafaulttool'));
if($('body').attr('data-listen') == 1){
	setInterval(function(){
		listen();
	}, 7500);
}

// P E N   T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
tool_pen.onMouseDown = function(event){
	var point = new Point(snap([event.point.x,event.point.y]));
	if(!path){
		startNewPath();
	}

	if(path.lastSegment){
		if(point.x == path.lastSegment.point.x && point.y == path.lastSegment.point.y){
			// last segment and new point to add have identical position
			var samepos = true;
		} else { var samepos = false; }
	} else { var samepos = false; }

	if(!samepos){
		path.add(point);
		pen.pathlength++;
	}

	if(pen.pathlength == 1){
		// otherwise pivot is at center of path, which can be intbetween the grid
		path.pivot = new Point(path.firstSegment.point.x,path.firstSegment.point.y);
	}
	if(pen.pathlength > 0){
		highlightSegment('hide');
		PreviewPath('show');
	}
}
tool_pen.onMouseDrag = function(event){
	var point = new Point(snap([event.point.x,event.point.y]));
	if(path.lastSegment){
		if(point.x == path.lastSegment.point.x && point.y == path.lastSegment.point.y){
			// last segment and new point to add have identical position
			var samepos = true;
		} else { var samepos = false; }
	} else { var samepos = false; }
	
	if(!samepos){
		path.add(point);
		if(pen.pathlength == 1){
			pen.dragged++;
		}
		pen.pathlength++;
	}
	interface.segmenthighlight.position = point;
	interface.pathpreview.lastSegment.point = point;
	interface.pathpreview.firstSegment.point = point;
}
tool_pen.onMouseUp = function(event){
	var point = new Point(snap([event.point.x,event.point.y]));

	if(pen.pathlength > 1){
		if(path.lastSegment.point.x == path.firstSegment.point.x && path.lastSegment.point.y == path.firstSegment.point.y){
			// first segment and new point to add have identical position
			path.lastSegment.remove();
			closePath();
		}
	}

	interface.pathpreview.lastSegment.point = point;
	interface.pathpreview.firstSegment.point = point;

	if(pen.dragged > 0){
		if(layer_pen.children.length < 3){
			canvasFilled('deleteEmpty');
		}
		startNewPath();
		pen.dragged = 0;
	}
	if(pen.pathlength == 2){
		canvasFilled('deleteEmpty');
	}
}
tool_pen.onMouseMove = function(event){
	var point = new Point(snap([event.point.x,event.point.y]));
	interface.segmenthighlight.position = point;
	if(pen.pathlength > 0){
		interface.pathpreview.lastSegment.point = point;
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
		moveWithSteps(interface.pathpreview.firstSegment,'up');
	}
	if(event.key == 'down'){
		moveWithSteps(path.lastSegment,'down');
		moveWithSteps(interface.pathpreview.firstSegment,'down');
	}
	if(event.key == 'left'){
		moveWithSteps(path.lastSegment,'left');
		moveWithSteps(interface.pathpreview.firstSegment,'left');
	}
	if(event.key == 'right'){
		moveWithSteps(path.lastSegment,'right');
		moveWithSteps(interface.pathpreview.firstSegment,'right');
	}
	if(event.key == 'delete' || event.key == 'backspace'){
		event.preventDefault();
		deleteObjects(path.lastSegment);
		if(path.lastSegment){
			interface.pathpreview.firstSegment.point = path.lastSegment.point;
		} else if (path.firstSegment){
			interface.pathpreview.firstSegment.point = path.firstSegment.point;
		} else {
			startNewPath();
			PreviewPath('reset');
			// pen.pathlength = 0;
			highlightSegment('show');
		}
	}
}






// M O V E  T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
tool_move.onMouseDown = function(event){
	segment = null;
	stroke = null;
	var hitResult = project.hitTest(event.point, hit_options);
	if(hitResult){
		if(hitResult.type == 'segment') {
			segment = hitResult.segment;
			highlightSegment('show');
			return;
		}
		if(hitResult.type == 'stroke') {
			stroke = hitResult.item;
		}
	}
}
tool_move.onMouseMove = function(event){
	var newpos = new Point(snap([event.point.x,event.point.y]));

	// overwrites hittest :)
	// segment = null;
	// stroke = null;
	var hitResult = project.hitTest(event.point, hit_options);
	if(hitResult){
		if(hitResult.type == 'segment') {
			highlightSegment('show');
			interface.segmenthighlight.position = newpos;
			return;
		} else {
			highlightSegment('hide');
		}
	} else {
		highlightSegment('hide');
	}
}
tool_move.onMouseDrag = function(event){
	var newpos = new Point(snap([event.point.x,event.point.y]));
	interface.segmenthighlight.position = newpos;

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
			select.remove();
			if (canvasFilled('deleteEmpty') == false){
				switchtool('lastUsedStrict');
			}
		}
	}
}





// T E X T   T O O L - - - - - - - - - - - - - - - - - - - - - - - - - - -
function backspace(){
	if(layer_text.lastChild){
		console.log('remove');
		Cursor('backspace',layer_text.lastChild.pivot);
		layer_text.lastChild.remove();
		if(layer_text.children.length < 2){
			canvasFilled();
		}
	} else {
		Cursor('backspace');
	}
}

function printCharacter(char){
	var character = new Path(letters[char]['p']);
	character.style = style.path;
	character.pivot = new Point(0,0);
	character.position = type.cursor.position;
	character.scale( blow(type.scale) );
	
	Cursor('move',blow( letters[char]['s']*type.scale ));
	if(layer_text.children.length < 2){
		canvasFilled(); 
	}
}

tool_text.onKeyDown = function(event){
	if( interface.prevent_input == true ){
		return false;
	}
	var check = /^[A-Za-z0-9]$/;
	if( check.test(event.character) ){
		printCharacter(event.character);
		return;
	}
	if(event.key == 'space'){ Cursor('move'); }
	if(event.key == 'enter'){ Cursor('jumpline'); }
	if(event.key == 'delete' || event.key == 'backspace'){ event.preventDefault(); backspace(); }
	if(event.key == 'up'){ moveWithSteps(type.cursor,'up'); }
	if(event.key == 'down'){ moveWithSteps(type.cursor,'down'); }
	if(event.key == 'left'){ moveWithSteps(type.cursor,'left'); }
	if(event.key == 'right'){ moveWithSteps(type.cursor,'right'); }

	if(!event.character){ return; }

	if(event.character == 'Ä'){ printCharacter('AE'); }
	if(event.character == 'Ö'){ printCharacter('OE'); }
	if(event.character == 'Ü'){ printCharacter('UE'); }
	if(event.character == 'ä'){ printCharacter('ae'); }
	if(event.character == 'ö'){ printCharacter('oe'); }
	if(event.character == 'ü'){ printCharacter('ue'); }

	if(event.character == 'æ'){ printCharacter('ae'); }
	if(event.character == 'œ'){ printCharacter('oe'); }
	if(event.character == 'Æ'){ printCharacter('AE'); }
	if(event.character == 'Œ'){ printCharacter('OE'); }

	if(event.character == 'ß'){ printCharacter('ß'); }
	if(event.character == '?'){ printCharacter('question'); }
	if(event.character == '!'){ printCharacter('exclamation'); }

	if(event.character == '.'){ printCharacter('period'); }
	if(event.character == ':'){ printCharacter('colon'); }
	if(event.character == ','){ printCharacter('comma'); }
	if(event.character == ';'){ printCharacter('semicolon'); }
	if(event.character == '“'){ printCharacter('quotationenopen'); }
	if(event.character == '”'){ printCharacter('quotationenclosed'); }
	if(event.character == '„'){ printCharacter('quotationdeopen'); }
	if(event.character == '"'){ printCharacter('quotationenclosed'); }
	if(event.character == '-'){ printCharacter('dash'); }
	if(event.character == '–'){ printCharacter('dash'); }
	if(event.character == '_'){ printCharacter('underscore'); }
	if(event.character == '('){ printCharacter('roundbracketopen'); }
	if(event.character == ')'){ printCharacter('roundbracketclosed'); }
	if(event.character == '['){ printCharacter('bracketopen'); }
	if(event.character == ']'){ printCharacter('bracketclosed'); }
	if(event.character == '{'){ printCharacter('curlybracketopen'); }
	if(event.character == '}'){ printCharacter('curlybracketclosed'); }
	if(event.character == '/'){ printCharacter('slash'); }
	if(event.character == '\\'){ printCharacter('backslash'); }
	if(event.character == '+'){ printCharacter('plus'); }
	if(event.character == '|'){ printCharacter('pipe'); }

	if(event.character == '&'){ printCharacter('ampersand'); }
	if(event.character == '€'){ printCharacter('euro'); }
	if(event.character == '$'){ printCharacter('dollar'); }
	if(event.character == '£'){ printCharacter('sterling'); }
	if(event.character == '@'){ printCharacter('at'); }
	if(event.character == '*'){ printCharacter('asterisk'); }
	if(event.character == '#'){ printCharacter('hashtag'); }
	if(event.character == '’'){ printCharacter('apostrophe'); }
	if(event.character == '\''){ printCharacter('apostrophe'); }

	if(event.character == 'ç'){ printCharacter('c_cedille'); }
	// fallbacks
	if(event.character == '¿'){ printCharacter('question'); }
	if(event.character == '¡'){ printCharacter('exclamation'); }
	if(event.character == 'å'){ printCharacter('a'); }
	if(event.character == '¢'){ printCharacter('c'); }
	if(event.character == 'Ø'){ printCharacter('0'); }
	if(event.character == 'Á'){ printCharacter('A'); }
	if(event.character == 'Û'){ printCharacter('U'); }
	if(event.character == 'Å'){ printCharacter('A'); }
	if(event.character == 'Í'){ printCharacter('I'); }
	if(event.character == 'Ï'){ printCharacter('I'); }
	if(event.character == 'Ì'){ printCharacter('I'); }
	if(event.character == 'Ó'){ printCharacter('O'); }
	if(event.character == 'ı'){ printCharacter('i'); }

	if(event.character == ''){ printCharacter('C');printCharacter('R');printCharacter('Y');printCharacter('T');printCharacter('C');printCharacter('H');printCharacter('period');printCharacter('c');printCharacter('o');printCharacter('m'); }
	// bis hier geprüft
	
	if(event.character == '×'){ printCharacter('multiply'); }
	if(event.character == 'á'){ printCharacter('a_acute'); }
	if(event.character == 'à'){ printCharacter('a_grave'); }
	if(event.character == 'é'){ printCharacter('e_acute'); }
	if(event.character == 'è'){ printCharacter('e_grave'); }
	// missing: | « » ‹ › • ° © § % = ¥ ~ ∞ Ω ¢
}
// drag cursor
tool_text.onMouseDrag = function(event){
	var point = new Point(snap([event.point.x,event.point.y]));
	type.cursor.position = point;
}
tool_text.onMouseUp = function(event){
	var point = new Point(snap([event.point.x,event.point.y]));
	type.cursor.position = point;
}



function Call4Secrets(leak,paint){
	if(leak == 'yes'){
		console.log('L E A K');
		message.c4secrets = true;
		$('body').addClass('c4secrets');
		reStyle('background','b');
		reStyle('color','w');
		return true;
	}
	console.log('S E C R E T');
	message.c4secrets = false;
	$('body').removeClass('c4secrets');
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

	if(execute == 'pen'){ switchtool('pen'); }
	if(execute == 'text'){ switchtool('text'); }
	if(execute == 'move'){ switchtool('move'); }
	if(execute == 'encrypt'){
		if( interface.active_tool == 'encrypt'){
			switchtool('lastUsed');
		} else {
			switchtool('encrypt');
		}
	}
	if(execute == 'export-svg'){ downloadSVG(); console.log('try to export'); }
	if(execute == 'clearall'){ clearAll(); }
	if(execute == 'confirm-clearall'){ popup('confirm-clear-canvas'); }
	if(execute == 'reload'){ window.location.assign("https://crytch.com"); }
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
	if(execute == 'keep_leak'){
		Call4Secrets('nope');
	}
	if(execute == 'submit_leak'){
		Call4Secrets('yes');
	}
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






$("#popups").hover(function(){
		PreviewPath('hide');
		interface.prevent_input = true;
	},function(){
		PreviewPath('show');
		interface.prevent_input = false;
});




$('#strokewidth').bind('keyup change', function (e) {
	if(e.type == 'keyup'){
		if(e.keyCode < 48 || e.keyCode > 57){
			if(e.keyCode < 37 || e.keyCode > 40){
				if(e.keyCode != 8){ return false; }
			}
		}
	}
    var width = $(this).val();
	reStyle('strokewidth',width);        
});
$('#password').keyup(function() {
	var pw = validPW();
	encrypt(pw);
});
$("#messageurl").on("click",function(){
	$(this).select();
});


$('#sendtomail').keyup(function(){
	var email = $(this).val();
	if(validateEmail(email) == true){
		$('.sendviamail a.exesend').removeClass('inactive');
	} else {
		$('.sendviamail a.exesend').addClass('inactive');
	}
});
$('#sendviamail.sling').click(function(){
	$(this).addClass('open');
	$('#sendtomail').focus();
});
if( $('.contactmail').length > 0 ){
	setTimeout(function(){
		var url = 'crytch.com';
		$('.contactmail').attr('href','mailto:secret@'+url);
	}, 2500);
}

$('#popups ul a.closepopup').click(function(){
	popup();
});
$('#popups ul.message-recieved a.openmessage').click(function(){
	popup();
});
$('#popups ul.confirm-clear-canvas a.clearall').click(function(){
	clearAll();
	popup();
});






$(window).resize(function(){ 
	interface.window_w = $(window).width();
	interface.window_h = $(window).height();
	if(interface.window_w <= 460 || interface.window_h <= 420 ){
		var newdevice = 'mobile';
	} else {
		var newdevice = 'desktop';
	}
	if(newdevice != interface.device){
		interface.device = newdevice;
		switchtool('lastUsed');
	}
});

// end paper
}