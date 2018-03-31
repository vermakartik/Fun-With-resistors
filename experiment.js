// For mouse detection
var oml = {
	BTL: "1", 
	BTR: "2", 
	BBL: "3", 
	BBR: "4", 
	VLF: "5", 
	VRF: "6", 
	HTF: "7", 
	HBF: "8", 
	MHF: "9", 
	MVF: "10", 
	TBL: "11",
	TBR: "12",
	RB: "13",
	BL: "14"
}
var raycaster= new THREE.Raycaster();
var mouse = new THREE.Vector2();
var fontHelvetick = null;
var fontGentilis = null;
var fontOptimer = null;
var disableImage = null;
var startScreen;
var showingStart = false;
var levelChangeUp =  null;
var levelChangeDown = null;
var currentLevel = null;
var curLevelText = null;
var levelTextInfo = null;
var lvl;
var fBoard;
var prevSize = window.innerWidth;
var pollingBool = false;

function polling(ms = 1000){
	pollingBool = true;
	let text = drawText("Loading...", 0xf0f0ff, 2, 0.001, fontGentilis, 0.0, true);
	let bx = getRestructuredBoundingBox(text, 2.0, 2.0, true, 0x000000, 0.6);
	text.position.z = 2.1;
	bx.position.z = 2.0;
	PIEaddElement(text);
	PIEaddElement(bx);
	let prevTime = new Date().getTime();
	while(new Date().getTime() - prevTime < ms){

	};
	PIEremoveElement(text);
	PIEremoveElement(bx);
	pollingBool = false;
	return;
}

const levelDet = {
	1: {
		"map": [
			oml.MHF + "-" + oml.RB + "-" + oml.MHF +"-" + oml.MHF + "-" + oml.RB + "-" + oml.MHF,
			oml.BL + "-" + oml.BTL + "-" + oml.RB + "-" + oml.BTR + "\n" +
			oml.MHF + "-" + oml.VLF + "-" + oml.BL + "-" + oml.VRF + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.RB + "-" + oml.BBR
		],
		"resistances": [1, 2, 3, 4],
		"solutions": [[0, 1], [1, 3]],
		"questions": [3, (4 / 3).toFixed(2)],
		"formula": ["( 0 + 1 )", "( ( 0 * 1 ) / ( 0 + 1 ) )"]
	},
	2: {
		"map": [
			oml.BL + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "\n" +
			oml.MHF + "-" + oml.TBL + "-" + oml.RB + "-" + oml.TBR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.RB + "-" + oml.BBR,
			oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.MHF + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.BBR
		],
		"resistances": [1, 2, 3, 4],
		"solutions": [[0, 1, 2], [0, 2, 3]],
		"questions": [(11 / 6).toFixed(2), 2],
		"formula": [
				"( 0 * 1 + 1 * 2 + 2 * 0 ) / ( 0 + 1 + 2 )",
				"( ( 0 + 1 ) * 2 ) / ( 0 + 1 + 2 )"
			]
	},
	3: {
		"map": [
			oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BBR,
			
			oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.VLF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.BTR + "-" + oml.BL + "-" + oml.VRF + "\n" + 
			oml.BL + "-" + oml.BBL + "-" + oml.BBL + "-" + oml.RB + "-" + oml.BBR + "-" + oml.MHF + "-" + oml.BBR,

			oml.BL  + "-" + oml.BL + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "\n" +
			oml.BL  + "-" + oml.BTL + "-" + oml.BBL + "-" + oml.RB +"-" + oml.BBR + "-" + oml.BTR + "\n" +
			oml.MHF + "-" + oml.VLF + "-" + oml.BL + "-" + oml.BL + "-" + oml.BL + "-" + oml.VRF + "-" + oml.MHF + "\n" +
			oml.BL  + "-" + oml.BBL + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "-" + oml.BBR + "\n" +
			oml.BL  + "-" + oml.BL + "-" + oml.BBL + "-" + oml.RB +"-" + oml.BBR
		],
		"resistances": [2, 3, 4, 5, 6],
		"solutions": [[0, 2, 1, 3], [1, 0, 2, 4], [3, 1, 2, 0]],
		"questions": [(48 / 14).toFixed(2), (120 / 74).toFixed(2), (45 / 14).toFixed(2)],
		"formula": [
			"( ( 0 + 1 ) * ( 2 + 3 ) ) / ( 0 + 1 + 2 + 3 )", 
			"( ( 0 + 1 ) * ( 2 * 3 ) ) / ( ( 2 * 3 ) + ( 2 + 3 ) * ( 0 + 1 ) )",
			"( 0 * 1 + 1 * 2 + 2 * 3 + 3 * 0 ) / ( 0 + 1 + 2 + 3 )"
		]
	},
	4: {
		"map": [
			oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.MHF + "-" +  oml.BBR,
			
			oml.BL  + "-" + oml.BTL + "-" + oml.MHF + "-" + oml.RB +"-" + oml.MHF + "-" + oml.BTR + "\n" +
			oml.MHF + "-" + oml.BBL + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "-" + oml.BBR + "-" + oml.MHF + "\n" +
			oml.BL  + "-" + oml.BL + "-" + oml.TBL + "-" + oml.RB +"-" + oml.TBR + "\n" + 
			oml.BL  + "-" + oml.BL + "-" + oml.BBL + "-" + oml.RB +"-" + oml.BBR
		],
		"resistances": [3, 4, 5, 6, 7],
		"solutions": [[1, 2, 0, 3], [3, 4, 1, 0]],
		"questions": [4, 5],
		"formula": [
			"( ( 0 + 1 + 2 ) * 3 ) / ( 0 + 1 + 2 + 3 )",
			"( 0 * 1 + 1 * 2 + 2 * 3 + 3 * 0 ) / ( 0 + 1 + 2 + 3 )"
		]
	},
	5: {
		"map": [
			oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.MHF + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.MHF + "-" +  oml.BBR,
		
			oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + + oml.MHF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BBL + "-" + oml.MHF + "-" + oml.MHF + "-" + oml.BTL + "-" + oml.RB + "-" + oml.BTR + "-" + oml.MHF + "-" + oml.MHF + "-" +  oml.BBR + "\n" + 
			oml.BL + "-" + oml.BL + "-" + oml.BL + "-" + oml.BL + "-" + oml.BBL + "-" + oml.RB + "-" + oml.BBR,

			oml.BL  + "-" + oml.BTL + "-" + oml.RB + "-" + oml.MHF + "-" + oml.MHF +"-" + oml.RB + "-" + oml.BTR + "\n" +
			oml.MHF + "-" + oml.BBL + "-" + oml.MHF + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "-" + oml.BBR + "-" + oml.MHF + "\n" +
			oml.BL + "-" + oml.BL  + "-" + oml.BL + "-" + oml.TBL + "-" + oml.RB +"-" + oml.TBR + "\n" + 
			oml.BL + "-" + oml.BL  + "-" + oml.BL + "-" + oml.BBL + "-" + oml.RB +"-" + oml.BBR,

			oml.BL  + "-" + oml.BL + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "\n" +
			oml.BL  + "-" + oml.BTL + "-" + oml.BBL + "-" + oml.RB +"-" + oml.BBR + "-" + oml.BTR + "\n" +
			oml.MHF + "-" + oml.VLF + "-" + oml.BL + "-" + oml.BL + "-" + oml.BL + "-" + oml.VRF + "-" + oml.MHF + "\n" +
			oml.BL  + "-" + oml.BBL + "-" + oml.BTL + "-" + oml.RB +"-" + oml.BTR + "-" + oml.BBR + "\n" +
			oml.BL  + "-" + oml.BL + "-" + oml.TBL + "-" + oml.RB +"-" + oml.TBR + "\n" + 
			oml.BL  + "-" + oml.BL + "-" + oml.BBL + "-" + oml.RB +"-" + oml.BBR
		],
		"resistances": [1, 2, 3, 4, 5, 6, 7],
		"solutions": [[2, 0, 1, 3, 5], [6, 5, 2, 1, 3], [1, 2, 3, 4, 5], [5, 0, 2, 4, 6]],
		"questions": [(60 / 16).toFixed(2), (128 / 104).toFixed(2), (370 / 149).toFixed(2), (101 / 22).toFixed(2)],
		"formula": [
			"( ( 0 + 1 + 2 ) * ( 3 + 4 ) ) / ( 0 + 1 + 2 + 3 + 4 )",
			"( ( 0 + 1 + 2 ) * ( 3 * 4 ) ) / ( ( 3 * 4 ) + ( 3 + 4 ) * ( 0 + 1 + 2 ) )",
			"( ( 0 + 1 ) * ( 2 * 3 + 3 * 4 + 4 * 2 ) ) / ( ( 2 * 3 + 3 * 4 + 4 * 2 ) + ( 0 + 1 ) * ( 2 + 3 + 4 ) )",
			"( ( 0 * 1 + 1 * 2 + 2 * 3 + 3 * 4 + 4 * 0 ) / ( 0 + 1 + 2 + 3 + 4 ) )"
		]
	}

}

function deg2Rad(val) {
	return ((Math.PI * val) / 180);
}

var order = {
	"/": 2,
	"*": 2,
	"+": 1,
	"-": 1
}
var operators = ["/", "+", "-", "*"];
function processExpression(expression, valueSet){
	let tokens = expression.split(" ");
	console.log("value set: " + valueSet);
	let fExp = [];
	let stack = [];
	console.log(tokens);
	for(const tk of tokens){
		console.log(tk + " | stack : " + stack + " | fExp: " + fExp);
		if(tk == "("){
			console.log("pushing left bracket");
			stack.push(tk);
		}
		else if(parseInt(tk) >= 0){
			console.log('Token pushed on fExp');
			fExp.push(valueSet[parseInt(tk)]);
		}
		else if(tk == ")"){
			while(stack[stack.length - 1] != "(" && stack.length){
				console.log("last Elem " + stack[stack.length-1]);
				console.log("removing for left right paranthesis encounter " + stack);
				fExp.push(stack.pop());
			}
			console.log("popping after else if " + stack[stack.length - 1]);
			stack.pop();
		} else {
			while(stack.length != 0 && (stack[stack.length - 1] != "(" && (operators.includes(tk) && order[stack[stack.length-1]] >= order[tk]))){
				if(operators.includes(tk)){
					console.log("Orders on stack " + order[stack[stack.length-1]] + " _ " + order[tk]);
				}
				console.log("popped for else " + stack[stack.length - 1]);
				fExp.push(stack.pop());
			}
			console.log("pushing on stack for else");
			stack.push(tk);
		}
	}
	while(stack.length){
		fExp.push(stack.pop());
	}
	console.log(fExp);
	return calculateRPN(fExp);
}

function calculateRPN(rpnArray){
	let stack = [];
	for(const tk of rpnArray){
		console.log(tk + " | stack " + stack)
		if(operators.includes(tk)) {
			let r = stack.pop();
			let l = stack.pop();
			switch(tk){
				case "+": stack.push(r + l); break;
				case "-": stack.push(l - r); break;
				case "*": stack.push(r * l); break;
				case "/": stack.push(l / r); break;
			}
		} else {
			stack.push(tk);
		}
	}
	console.log(stack[0]);
	return stack[0];
}

function drawText(text, color, size, height, font, rotation = 0.2, basic = false){
	let geometry = new THREE.TextGeometry(text, {
		font : font,
		size : size,
		height : height,
		curveSegments : 10
	});
	geometry.computeBoundingBox();
	let textDrawen = undefined;
	if(basic == false){
		textDrawen =new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, transparent: true}));
		textDrawen.rotation.y += rotation;
	} else if(basic == true){
		textDrawen = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:color, transparent: true}));
		textDrawen.rotation.y += rotation;
	}
	return textDrawen;
}

function alignCenter(elem1, elem2, vert = true, hor = true){

	elem1Clone = elem1.clone();
	elem2Clone = elem2.clone();
	
	let elem1bb = new THREE.Box3().setFromObject(elem1Clone);
	let elem2bb = new THREE.Box3().setFromObject(elem2Clone);

	let elem1CenterX = (elem1bb.min.x + elem1bb.max.x) / 2;
	let elem1CenterY = (elem1bb.min.y + elem1bb.max.y) / 2;
	
	let elem2CenterX = (elem2bb.min.x + elem2bb.max.x) / 2;
	let elem2CenterY = (elem2bb.min.y + elem2bb.max.y) / 2;
	if(hor == true){
		elem1Clone.translateX(elem2CenterX - elem1CenterX);
	}
	if(vert == true){
		elem1Clone.translateY(elem2CenterY - elem1CenterY);
	}
	
	return [elem1Clone, elem2Clone];
}

function getPosition(obj){
	let bb = new THREE.Box3().setFromObject(obj);
	return new THREE.Vector3(bb.min.x, bb.min.y);
}

function getRestructuredBoundingBox(obj, scalex = 1.8, scaley = 1.5, boxOnly = false, color = 0xffffff, opacity= 0.1, alignZ = false){
	let bb = new THREE.Box3().setFromObject(obj);
	let Xwidth = bb.max.x - bb.min.x;
	let Ywidth = bb.max.y - bb.min.y;
	let Zwidth = bb.max.z - bb.min.z;
	let incXWidth = Xwidth * scalex;
	let incYWidth = Ywidth * scaley;

	let boxFromGm;
	if(alignZ == false){
		boxFromGm = new THREE.PlaneGeometry(incXWidth, incYWidth);
	} else {
		boxFromGm = new THREE.BoxGeometry(incXWidth, incYWidth, Zwidth);
	}
	let boxMaterial = new THREE.MeshBasicMaterial({color: color, transparent: true});
	boxMaterial.opacity = opacity;
	let bx = new THREE.Mesh(boxFromGm, boxMaterial);
	let  bbNew = new THREE.Box3().setFromObject(bx);

	let centerXPrev = (bb.max.x + bb.min.x)/2;
	let centerYPrev = (bb.max.y + bb.min.y)/2;
	let centerZPrev = (bb.max.z + bb.min.z)/2;

	let centerXNew = (bbNew.max.x + bbNew.min.x)/2;
	let centerYNew = (bbNew.max.y + bbNew.min.y)/2;
	let centerZNew = (bbNew.max.z + bbNew.min.z)/2;

	bx.translateX(centerXPrev - centerXNew);
	bx.translateY(centerYPrev - centerYNew);
	if(alignZ == true) bx.translateZ(centerZPrev - centerZNew);

	return bx;
}

function preLoad(){
	var floader = new THREE.FontLoader();
	var tloader = new THREE.TextureLoader();
	floader.load("./fonts/gentilis.json", function(font){fontGentilis = font});
	floader.load("./fonts/helvetiker_regular.json", function(font){fontHelvetick = font});
	floader.load("./fonts/optimer.json", function(font){fontOptimer = font
	runBootstrap();});
	tloader.load("./images/disable.png", function(img){
		var circleG = new THREE.CircleGeometry(0.4, 40);
		var circleO = new THREE.MeshPhongMaterial({map: img});
		disableImage = new THREE.Mesh(circleG, circleO);
		console.log("texture loaded");
		// disableImage.position.z = 0.7;
		// PIEaddElement(disableImage);
	})
}

function runBootstrap(){
	startScreen = new THREE.Group();
	let textStartGame = drawText("START GAME", 0xbcbcbc, 0.8, 0.001, fontOptimer, 0.0, true);
	// let coverBoxGeo = new THREE.PlaneGeometry(8, 3);
	// let coverMaterial = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true});
	// coverMaterial.opacity = 0.3;
	let coverBox = getRestructuredBoundingBox(textStartGame, 1.4, 4.0, true, 0x000000, 0.3);
	textStartGame = alignCenter(textStartGame, coverBox)[0];
	textStartGame.position.z = 0.1;
	startScreen.add(textStartGame);
	startScreen.add(coverBox);
	startScreen.position.z = 0.2;
	startScreen.position.x = -4;
	showingStart = true;
	PIEaddElement(startScreen);
	PIErender();
}

const colorMappingsResistance = {
	1: 0xf96363,
	2: 0xf9b862,
	3: 0xe4f962,
	4: 0x18a02e,
	5: 0x18a08d,
	6: 0x1872a0,
	7: 0x1632ce,
	8: 0x6e1587,
	9: 0x911429,
	10: 0x911458
};
const wireColor = 0xbcbcbc;
class Resistance {
	constructor(value = 1) {
		if (value >= 1 && value <= 10) {
			this.value = value;
		}
		this.drawen = this.drawResistance();
	}

	get draw(){
		return this.drawen;
	}

	drawResistance() {
		var resistanceO = new THREE.Group();
		var resistanceSphereEndG = new THREE.CircleGeometry(0.6, 6);
		var resistanceSphereEndM = new THREE.MeshBasicMaterial({ color: colorMappingsResistance[this.value] });
		var resistanceSphereEndO = new THREE.Mesh(resistanceSphereEndG, resistanceSphereEndM);
		resistanceSphereEndO.position.z += 0.00;

		var resistanceFlatG = new THREE.BoxGeometry(2, 0.6);
		var resistanceFlatM = new THREE.MeshBasicMaterial({ color: colorMappingsResistance[this.value] });
		var resistanceFlatO = new THREE.Mesh(resistanceFlatG, resistanceFlatM);

		var resistanceWireG = new THREE.BoxGeometry(2, 0.15);
		var resistanceWireM = new THREE.MeshBasicMaterial({ color: wireColor });
		var resistanceWireO = new THREE.Mesh(resistanceWireG, resistanceWireM);
		resistanceWireO.position.z -= 0.005;
		
		var resistanceSphereDup = resistanceSphereEndO.clone();
		var resistanceWireDup = resistanceWireO.clone();

		resistanceSphereEndO.position.x = -1;
		resistanceSphereDup.position.x = 1;
		resistanceWireO.position.x = -1;
		resistanceWireDup.position.x = 1;

		resistanceO.add(resistanceFlatO);
		resistanceO.add(resistanceSphereDup);
		resistanceO.add(resistanceSphereEndO);
		resistanceO.add(resistanceWireO);
		resistanceO.add(resistanceWireDup);

		let text = drawText("" + this.value + " ohm", 0x111111, 0.4, 0.001, fontOptimer, 0.0, true);
		text = alignCenter(text, resistanceO)[0];
		// console.log(text);
		text.position.z = 0.05;
		resistanceO.add(text);
		resistanceO.position.z = 0.0;
		return resistanceO;
	}
}

const ALIGNTOP = 0;
const ALIGNBOTTOM = 1;
const ALIGNMIDDLE = 2;
const ALIGNLEFT = 0;
const ALIGNRIGHT = 1;

class Pipes{
	constructor(type, params = {}){
		this.type = type;
		this.params = params;
		if(this.type == "HORIZONTAL"){
			let paramsTemp = {align: ALIGNTOP, color: 0xffffff, half: true, part: true};
			for(const key of Object.keys(paramsTemp)){
				if(!params.hasOwnProperty(key)){
					params[key] = paramsTemp[key];
				}
			}
			this.object = this.horizontal();
		} else if(this.type == "VERTICAL") {
			let paramsTemp = {align: ALIGNLEFT, color: 0xffffff, half: true, part: true};
			for(const key of Object.keys(paramsTemp)){
				if(!params.hasOwnProperty(key)){
					params[key] = paramsTemp[key];
				}
			}
			this.object = this.vertical();
		}
	}

	get draw(){
		return this.object;
	}

	horizontal(){
		let align = this.params["align"];
		let color = this.params.color;
		let half = this.params.half;
		let leftPart = this.params.part;
		var pipeGeometry;
		if(half == false){
			pipeGeometry = new THREE.PlaneGeometry(1, 0.1, 1, 1);
		} else {
			pipeGeometry = new THREE.PlaneGeometry(0.55, 0.1, 1, 1);
		}
		var pipeMaterial = new THREE.MeshBasicMaterial({color: color});
		var pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
		if(align == ALIGNTOP){
			pipe.position.y = 0.45;
		} else if(align == ALIGNBOTTOM){
			pipe.position.y = -0.45;
		} else if(align == ALIGNMIDDLE){
			pipe.position.y = 0.0;
		}
		if(half == true){
			if(leftPart == true){
				pipe.position.x = -0.225;
			} else {
				pipe.position.x = 0.225;
			}
		}
		return pipe;
	}

	vertical(){
		let align = this.params.align;
		let color = this.params.color;
		let half = this.params.half;
		let topPart = this.params.part;
		var pipeGeometry;
		if(half == false){
			pipeGeometry = new THREE.PlaneGeometry(0.1, 1, 1, 1);
		} else {
			pipeGeometry = new THREE.PlaneGeometry(0.1, 0.55, 1, 1);
		}
		var pipeMaterial = new THREE.MeshBasicMaterial({color: color});
		var pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
		if(align == ALIGNLEFT){
			pipe.position.x = -0.45;
		}else if(align == ALIGNRIGHT){
			pipe.position.x = 0.45;
		} else if(align == ALIGNMIDDLE){
			pipe.position.x = 0.0;
		}
		if(half == true){
			if(topPart == true){
				pipe.position.y = 0.225;
			}else{
				pipe.position.y = -0.225;
			}
		}
		return pipe;
	}
}

var HORIZONTAL = "HORIZONTAL";
var VERTICAL = "VERTICAL";
class LevelBendObject{
	constructor(typeOfBend, color){
		this.color = color;
		this.typeOfBend = typeOfBend;
		this.object = this.parseObject();
	}

	get draw(){
		return this.object;
	}

	parseObject(){
		var bendO = new THREE.Group();
		if(this.typeOfBend == "TOPLEFT"){
			bendO.add(new Pipes(VERTICAL, {align: ALIGNLEFT, color: this.color, half: true, part: false}).draw);
			bendO.add(new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false, part:false}).draw);
		} else if(this.typeOfBend == "TOPRIGHT"){
			bendO.add(new Pipes(VERTICAL, {align: ALIGNRIGHT, color: this.color, half: true, part: false}).draw);
			bendO.add(new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false, part: false}).draw);
		} else if(this.typeOfBend == "BOTTOMLEFT"){
			bendO.add(new Pipes(VERTICAL, {align: ALIGNLEFT, color: this.color, half: true, part: true}).draw);
			bendO.add(new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false, part: false}).draw);
		} else if(this.typeOfBend == "BOTTOMRIGHT"){
			bendO.add(new Pipes(VERTICAL, {align: ALIGNRIGHT, color: this.color, half: true, part: true}).draw);
			bendO.add(new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false, part: false}).draw);
		} else if(this.typeOfBend == "T-LEFT"){
			bendO.add(new Pipes(VERTICAL, {align: ALIGNLEFT, color: this.color, half: false}).draw);
			bendO.add(new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false}).draw);
		} else if(this.typeOfBend == "T-RIGHT"){
			bendO.add(new Pipes(VERTICAL, {align: ALIGNRIGHT, color: this.color, half: false}).draw);
			bendO.add(new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false}).draw);
		}
		return bendO;
	}
}

class LevelCoverBoxEmptyObject{
	constructor(width = 1, height = 1, innerFillColor = 0x000000, outerFillColor = 0xffffff, thickness = 0.1, single = false){
		this.width = width;
		this.height = height;
		this.innerFillColor = innerFillColor;
		this.outerFillColor = outerFillColor;
		this.thickness = thickness;
		this.single = single;
		this.object = this.parseObject();
	}

	get draw(){
		return this.object;
	}

	parseObject(){
		var group = new THREE.Group();

		var outerBoxG = new THREE.PlaneGeometry(this.width, this.height);
		var outerBoxM = new THREE.MeshBasicMaterial({color: this.outerFillColor});
		var outerBoxO = new THREE.Mesh(outerBoxG, outerBoxM);

		if(this.single == true){
			return outerBoxO;
		}
		var innerBoxG = new THREE.PlaneGeometry(this.width - this.thickness, this.height - this.thickness);
		var innerBoxM = new THREE.MeshBasicMaterial({color: this.innerFillColor});
		var innerBoxO = new THREE.Mesh(innerBoxG, innerBoxM);

		outerBoxO.position.z = 0.0;
		innerBoxO.position.z = 0.05;

		group.add(innerBoxO);
		group.add(outerBoxO);

		return group;
	}
}

class ResistanceBox{
	constructor(values, position = new THREE.Vector3(0, 0, 0)){
		this.values = values;
		this.used = [];
		// this.position = new THREE.Vector3(position.x, position.y, (position.z + 0.4));
		for(let i = 0; i < this.values.length; ++i){
			this.used.push(false);
		}
		this.displaying = false;
		this.resistances = [];
		this.drawen = null;
		this.cross = null;
		this.forIndex = undefined;
	}

	get isDisplay(){
		return this.displaying;
	}

	freeResistance(index){
		this.used[index] = false;
	}

	mappingIndex(index){
		return this.values[index];
	}
	
	draw(index){
		this.drawen = this.parse();
		this.displaying = true;
		this.forIndex = index;
		console.log("Showing for " + this.forIndex);
		PIEaddElement(this.drawen);
		PIErender();
	}

	emptyDraw(){
		if(this.drawen != null){
			PIEremoveElement(this.drawen);
			this.displaying = false;
			this.resistances = [];
			this.forIndex = undefined;
		}
	}

	remove(){
		this.emptyDraw();
	}
	
	parse(){
		let group = new THREE.Group();
		// let coverG = new THREE.PlaneGeometry(8, this.values.length * 2);
		// let coverM = new THREE.MeshBasicMaterial({color: 0x666666});
		var chooseResistanceText = drawText("Choose Resistance", 0xffffff, 0.4, 0.001, fontOptimer, 0.0, true);
		chooseResistanceText.position.set(-2.5, 1, 0.7);
		group.add(chooseResistanceText);
		this.cross = drawText("x", 0xbcbcbc, 0.7, 0.001, fontOptimer, 0.0, true);
		this.cross.position.x = -3.5;
		this.cross.position.y = 1;
		this.cross.position.z = 0.7;
		group.add(this.cross);
		// group.add(cover);
		let curY = 0;
		for(let i = 0; i < this.values.length; ++i, curY -= 1.3){
			let rs = new Resistance(this.values[i]);
			rs.draw.position.y = curY;
			rs.draw.position.z = 0.1;
			if(this.used[i] == true){
				let ds = disableImage.clone();
				ds.position.y = curY;
				// ds.position.x = -2;
				ds.position.z = 0.6;
				// ds.scale.x = 
				group.add(ds);
			}
			this.resistances.push(rs.draw);
			group.add(rs.draw);
		}
		// group.position.set(this.position.x, this.position.y, this.position.z);
		let cover = getRestructuredBoundingBox(group, 1.3, 1.2, true, 0x555555, 1);
		// co
		group.add(cover);
		// cover.position.y = -2;
		console.log(this.position);
		// this.position
		group.scale.x = 1.2;
		group.scale.y = 1.2;
		group.position.set(0, 3, 4.0);
		// console.log("group displayed")
		// console.log(group.position)
		// console.log("drawer" + group);
		return group;
	}

	setPosition(position){
		// this.position = new THREE.Vector3(position.x, position.y, position.z + 0.4);
		// if(this.drawen)
		// {
		// 	this.drawen.position.set(this.position.x, this.position.y, this.position.z);
		// 	PIErender();
		// }
	}

	getResistance(index){
		this.used[index] = true;
		// let i = this.forIndex;
		let res = new Resistance(this.values[index]).draw;
		// this.emptyDraw();
		return res;
	}

	checkClick(){
		console.log("Check resistance box called ")
		if(this.displaying == false) return null;
		let intersects = raycaster.intersectObjects([this.cross]);
		if(intersects.length > 0){
			this.emptyDraw();
			return "closed";
		}
		for(let i = 0; i < this.values.length; ++i){
			console.log("checking for ... " + i);
			if(this.used[i] == false){
				console.log("checking for ... " + i);
				let intersects = raycaster.intersectObjects(this.resistances[i].children);
				if(intersects.length > 0){
					console.log("Check resistance box matched for " + i)
					return this.handleClick(i);
				}
			}
		}
		return null;
	}

	handleClick(index){
		this.used[index] = true;
		let i = this.forIndex;
		let res = this.resistances[index].clone();
		this.emptyDraw();
		return [res, i, index];
	}
}

class LevelPart{
	constructor(levelString, color, availableResistances, solution, formula){
		this.color = color;
		this.levelString = levelString;
		this.objects = [];
		this.formula = formula;
		this.solution = solution;
		this.positions = [];
		this.filled = [];
		// this.suplimentResPos = [];
		this.dialogOpenedForIndex = -1;
		this.mappedToResistance = [];
		this.drawen = this.parseLevel();
		this.buttonCANCEL = null;
		this.buttonDELETE = null;
		this.dialog = null;
		// this.setPosition();
		// console
		this.availableResistances = new ResistanceBox(availableResistances);
		for(let i = 0; i < this.availableResistances; ++i) this.isUsed.push(false);
	}

	draw(){
		console.log(this.drawen);
		// this.setPosition();
		this.redraw();
		PIEaddElement(this.drawen);
	}
	
	remove(){
		if(this.drawen) PIEremoveElement(this.drawen);
		if(this.dialog) PIEremoveElement(this.dialog);
		this.availableResistances.remove();
	}

	evaluate(){
		let valueSet = [];
		console.log("Mappings " + this.mappedToResistance);
		for(let i = 0; i < this.mappedToResistance.length; ++i){
			if(this.mappedToResistance[i] == -1) return "UNFILLED";
			else {
				valueSet.push(this.availableResistances.mappingIndex(this.mappedToResistance[i]));
			}
		}
		return processExpression(this.formula, valueSet);
	}

	parseLevel(){
		let lines = this.levelString;
		
		lines = lines.split("\n");
		console.log(lines);
		let curX = 0;
		let curY = 0;
		let group = new THREE.Group();
		for(const line of lines){
			let parts = line.split("-");
			console.log("Parts: " + parts);
			curX = 0;
			for(const obj of parts){
				let temp;
				console.log("Current Element: " + obj);
				// obj = parseInt(obj);
				switch(obj){
					// cases for each object
					case oml.BTL: 
						console.log("matched: " + 1);
						temp = new LevelBendObject("TOPLEFT", this.color);
					break;
					case oml.BTR:
						console.log("matched: " + 2);
						temp = new LevelBendObject("TOPRIGHT", this.color);
					break;
					case oml.BBL:
						console.log("matched: " + 3);
						temp = new LevelBendObject("BOTTOMLEFT", this.color);
					break;
					case oml.BBR:
						console.log("matched: " + 4);
						temp = new LevelBendObject("BOTTOMRIGHT", this.color);
					break;
					case oml.HBF:
						console.log("matched: " + 5);
						temp = new Pipes(HORIZONTAL, {align: ALIGNBOTTOM, color: this.color, half: false});
					break;
					case oml.HTF:
						console.log("matched: " + 6);
						temp = new Pipes(HORIZONTAL, {align: ALIGNTOP, color: this.color, half: false});
					break;
					case oml.VLF:
						console.log("matched: " + 7);
						temp = new Pipes(VERTICAL, {align: ALIGNLEFT, color: this.color, half: false});
					break;
					case oml.VRF:
						console.log("matched: " + 8);
						temp = new Pipes(VERTICAL, {align: ALIGNRIGHT, color: this.color, half: false});
					break;
					case oml.MHF:
						console.log("matched: " + 9);
						temp = new Pipes(HORIZONTAL, {align: ALIGNMIDDLE, color: this.color, half: false});
					break;
					case oml.MVF:
						console.log("matched: " + 10);
						temp = new Pipes(VERTICAL, {align: ALIGNMIDDLE, color: this.color, half: false});
					break;
					case oml.TBL:
						console.log("matched: " + 11);
						temp = new LevelBendObject("T-LEFT", this.color);
					break;
					case oml.TBR:
						console.log("matched: " + 12);
						temp = new LevelBendObject("T-RIGHT", this.color);
					break;
					case oml.RB:
						console.log("matched: " + 13);
						temp = new LevelCoverBoxEmptyObject(1, 0.9, 0xc6c11b, this.color, 0.1);
						this.objects.push(temp.draw);
						this.filled.push(null);
						this.mappedToResistance.push(-1);
						// this.suplimentResPos.push(-1);
						// curX += 1
					break;
					case oml.BL:
						console.log("matched: " + 14);
						temp = null
					break;
				}
				console.log(temp);
				if(temp){
					temp.draw.position.x += curX; 
					temp.draw.position.y += curY;
					temp.draw.position.z = 0.0;

					group.add(temp.draw);
				}
				curX += 1;
			}
			 curY -= 1;
		}
		group.position.z = 1;

		group.scale.x = 1.0;
		group.scale.y = 1.0;

		let bb = new THREE.Box3().setFromObject(group);
		let bbBoard = new THREE.Box3().setFromObject(fBoard);
		// let Zwidth = bb.max.z - bb.min.z;
		// let incXWidth = Xwidth * sc?alex;
		// let incYWidth = Ywidth * scaley;
	
		let centerXbb = (bb.max.x + bb.min.x)/2;
		let centerYbb = (bb.max.y + bb.min.y)/2;
	
		let centerXBoard = (bbBoard.max.x + bbBoard.min.x)/2;
		let centerYBoard = (bbBoard.max.y + bbBoard.min.y)/2;
	
		group.position.x -= (centerXbb - centerXBoard);
		group.position.y -= (centerYbb - centerYBoard);
	
		// let
		// let bx = this.grou
		// group = alignCenter(group, fBoard)[0];
		// this.setPosition();
		// group.position.set(this.objPositions.x, this.objPositions.y, this.objPositions.z);
		// group.position.z = 0.8;
		// groz//

		return group;
	}

	checkClick(){
		console.log("resistance check called");
		let elems = this.availableResistances.checkClick();
		if(elems === "closed") return true;
		if(elems){
			let res = elems[0];
			let index = elems[1];
			let mappingIndex = elems[2];
			this.mappedToResistance[index] = mappingIndex;
			console.log(index);

			// let bb = new THREE.Box3().setFromObject(res);
			// let bbBoard = new THREE.Box3().setFromObject(this.objects[index]);
			// let Zwidth = bb.max.z - bb.min.z;
			// let incXWidth = Xwidth * sc?alex;
			// let incYWidth = Ywidth * scaley;
		
			// let centerXbb = (bb.max.x + bb.min.x)/2;
			// let centerYbb = (bb.max.y + bb.min.y)/2;
		
			// let centerXBoard = (bbBoard.max.x + bbBoard.min.x)/2;
			// let centerYBoard = (bbBoard.max.y + bbBoard.min.y)/2;
		
			// res.translateX(centerXbb - centerXBoard);
			// res.translateY(-centerYbb + centerYBoard);
			console.log(res);
			this.filled[index] = res;
			this.filled[index].position.z = 1.2;
			// this.filled[index].position.x += this.objPositions.x;
			// this.filled[index].position.y += this.objPositions.y;
			// this.filled[index]
			this.filled[index].scale.x = 0.7;
			this.filled[index].scale.y = 0.7;
			this.filled[index] = alignCenter(this.filled[index], this.objects[index])[0];
			// this.suplimentResPos[index] = new THREE.Vector3().getPositionFromMatrix(this.filled[index].children[5].matrixWorld);
			// console.log("Pushing position --- ")
			// console.log(new THREE.Vector3().getPositionFromMatrix(this.filled[index].children[5].matrixWorld));
			PIEaddElement(this.filled[index]);
			this.drawen.add(this.filled[index]);
			// console.log("Removing Box " + this.objects[index]);
			this.drawen.remove(this.objects[index]);
			PIEremoveElement(this.objects[index]);
			this.redraw();
			PIErender();
			return true;
		}
		// if(this.availableResistances.isDisplay) return true;
		if(this.dialog){
			let intersects = raycaster.intersectObjects(this.buttonCANCEL.children);
			if(intersects.length > 0){
				console.log("cancel clicked");
				PIEremoveElement(this.dialog);
				this.dialog = null;
				this.dialogOpenedForIndex = -1;
				return true;
			}
			intersects = raycaster.intersectObjects(this.buttonDELETE.children);
			if(intersects.length > 0){
				console.log("delete clicked");
				PIEremoveElement(this.dialog);
				console.log("Dialog open for " + this.dialogOpenedForIndex);
				console.log("Resistance in this " + this.filled[this.dialogOpenedForIndex]);
				PIEremoveElement(this.filled[this.dialogOpenedForIndex]);
				this.drawen.remove(this.filled[this.dialogOpenedForIndex]);
				this.availableResistances.freeResistance(this.mappedToResistance[this.dialogOpenedForIndex]);
				PIEaddElement(this.objects[this.dialogOpenedForIndex]);
				this.drawen.add(this.objects[this.dialogOpenedForIndex]);
				this.filled[this.dialogOpenedForIndex] = null;
				this.mappedToResistance[this.dialogOpenedForIndex] = -1;
				this.dialogOpenedForIndex = -1;
				this.dialog = null;
				return true;
			}
			return false;
		}
		for(let i = 0; i < this.objects.length; ++i){
			let bx;
			if(this.filled[i] != null) {
				bx = this.filled[i];
			} else {
				bx = this.objects[i];
			}
			let intersects = true;
			console.log(bx.children);
			intersects = raycaster.intersectObjects(bx.children);
			if(intersects.length > 0){
				this.handleClick(i);
				return true;
			}
		}
		return false;
	}
	
	redraw(){
		// for()
		if(window.innerWidth < 640) {
			this.drawen.scale.x = 1.2;
			this.drawen.scale.y = 1.2;
			if(this.dialog) {
				this.dialog.scale.x = 2.5;
			}
			for(let rs of this.filled){
				if(rs){
					rs.children[5].scale.x = 1.7;
					rs.children[5].scale.y = 1.3;
					// rs.children[5].position.x -= 1.0;
				}
			}
		} else {
			this.drawen.scale.x = 1.0;
			this.drawen.scale.y = 1.0;
			if(this.dialog) {
				this.dialog.scale.x = 1.0;
			}
			for(let i = 0; i < this.filled.length; ++i){
				let rs = this.filled[i];
				if(rs){
					// console.log("Position for rs" + this.suplimentResPos[i]);
					// rs.children[5].position.set(this.suplimentResPos[i].x - 0.3, this.suplimentResPos[i].y, this.suplimentResPos[i].z);
					rs.children[5].scale.x = 1.0;
					rs.children[5].scale.y = 1.0;
				}
			}
		}
		PIErender();
	}

	getResistance(i, ind){
		let elems = this.availableResistances.getResistance(i);
		if(elems){
			let res = elems;
			console.log(res);
			let index = ind;
			let mappingIndex = i;
			this.mappedToResistance[index] = mappingIndex;
			console.log(index);
			// let bb = new THREE.Box3().setFromObject(res);
			// let bbBoard = new THREE.Box3().setFromObject(this.objects[index]);
			// let Zwidth = bb.max.z - bb.min.z;
			// let incXWidth = Xwidth * sc?alex;
			// let incYWidth = Ywidth * scaley;
		
			// let centerXbb = (bb.max.x + bb.min.x)/2;
			// let centerYbb = (bb.max.y + bb.min.y)/2;
		
			// let centerXBoard = (bbBoard.max.x + bbBoard.min.x)/2;
			// let centerYBoard = (bbBoard.max.y + bbBoard.min.y)/2;
		
			// res.translateX(centerXbb - centerXBoard);
			// res.translateY(-centerYbb + centerYBoard);
		
			this.filled[index] = res;
			this.filled[index].position.z = 1.2;
			// this.filled[index].position.x += this.objPositions.x;
			// this.filled[index].position.y += this.objPositions.y;
			// this.filled[index]
			this.filled[index].scale.x = 0.7;
			this.filled[index].scale.y = 0.7;
			this.filled[index] = alignCenter(this.filled[index], this.objects[index])[0];
			// this.suplimentResPos[index] = new THREE.Vector3().getPositionFromMatrix(this.filled[index].children[5].matrixWorld);
			PIEaddElement(this.filled[index]);
			this.drawen.add(this.filled[index]);
			// console.log("Removing Box " + this.objects[index]);
			this.drawen.remove(this.objects[index]);
			PIEremoveElement(this.objects[index]);
		}
		PIErender();
	}

	showSolution(){
		for(let i = 0; i < this.objects.length; ++i){
			if(this.filled[i]){
				this.availableResistances.freeResistance(this.mappedToResistance[i]);
				this.mappedToResistance[i] = -1;
				PIEremoveElement(this.filled[i]);
				this.drawen.remove(this.filled[i]);
				this.drawen.add(this.objects[i]);
				PIEaddElement(this.objects[i]);
			}
			this.getResistance(this.solution[i], i);
		}
	}

	handleClick(index){
		// for(int i =)
		 console.log("handle click called for " + index);
		if(this.filled[index]){
			this.dialogOpenedForIndex = index;
			var box = new LevelCoverBoxEmptyObject(10, 4, 0x333333, 0xffffff, 0.3).draw;
			var text1 = alignCenter(drawText("You Must delete this resistance", 0xffffff, 0.4, 0.001, fontHelvetick, 0.0, true), box, false, true)[0];
			var text2 = alignCenter(drawText("before using another", 0xffffff, 0.4, 0.001, fontHelvetick, 0.0, true), box, false, true)[0];
			text1.position.y = 1;
			text2.position.y = 0;
			text1.position.z = 0.1;
			text2.position.z = 0.1;
			var buttonCoverDELETE = new LevelCoverBoxEmptyObject(2, 1, 0x666666, 0x666666, 0.0, true).draw;
			buttonCoverDELETE.position.z = 0.0;
			var textDELETE = alignCenter(drawText("DELETE", 0xffffff, 0.3, 0.001, fontHelvetick, 0.0, true), buttonCoverDELETE, true, true)[0];
			textDELETE.position.z = 1;
			// textDELETE.position.y += 3;
			// text
			this.buttonDELETE = new THREE.Group();
			this.buttonDELETE.add(buttonCoverDELETE);
			this.buttonDELETE.add(textDELETE);
			// this.buttonDELETE = alignCenter(buttonCoverDELETE, box)[0];
			this.buttonDELETE.position.z = 0.1;
			
			let buttonCoverCANCEL = new LevelCoverBoxEmptyObject(2, 1, 0x666666, 0x666666, 0.0, true).draw;
			let textCANCEL = alignCenter(drawText("CANCEL", 0xffffff, 0.3, 0.001, fontHelvetick, 0.0, true), buttonCoverCANCEL)[0];
			textCANCEL.position.z = 0.1;
			this.buttonCANCEL = new THREE.Group();
			this.buttonCANCEL.add(buttonCoverCANCEL);
			this.buttonCANCEL.add(textCANCEL);
			// this.buttonCANCEL = alignCenter(buttonCoverCANCEL, box)[0];
			this.buttonCANCEL.position.z = 0.2;
			this.buttonCANCEL.position.x -= 1.5;
			this.buttonCANCEL.position.y -= 1;
			this.buttonDELETE.position.x += 1.5;
			this.buttonDELETE.position.y -= 1;
			if(this.dialog){
				this.dialog = null;
			}
			this.dialog = new THREE.Group();
			this.dialog.position.set(0, 0, 2.9);
			this.dialog.scale.x = 1.0;
			this.dialog.scale.y = 1.0;
			this.dialog.add(box);
			this.dialog.add(text1);
			this.dialog.add(text2);
			this.dialog.add(this.buttonCANCEL);
			this.dialog.add(this.buttonDELETE);
			PIEaddElement(this.dialog);
			this.redraw();
			return;
		}

		if(this.availableResistances.isDisplay == false){
			console.log("resistance display called");
			this.availableResistances.draw(index);
		}
	}
}

class Level {
	constructor(levelDetails, resistances, solutions, questions, formula) {
		this.levelDetails = levelDetails
		// this.positions = position;
		this.solutions = solutions;
		this.questions = questions;
		this.formula = formula;
		this.cache = [];
		for(let i = 0; i < this.levelDetails.length; ++i) this.cache.push(null);
		this.levelDrawen = null;
		this.color = 0xffffff;
		this.resistances = resistances;
		this.earlierShown = false; 
		this.currentPart = 0;
		this.changePartPrev = null;
		this.changePartNext = null;
		this.giveUpButton = null;
		this.gaveUpBool = [];
		this.levelDone = [];
		for(let i = 0; i < this.levelDetails.length; ++i){
			this.levelDone.push(false);
			this.gaveUpBool.push(false);
		}
		this.checkButton;
		this.questionPosed = null;
		this.resultText = null;
		this.resetText = null;
	}
	
	parseLevels() {
		// this.levelDrawen = [];
		// for(let index = 0; index < this.levelDetails.length; ++index){
		// 	let levelPart = this.levelDetails[index];
		// 	let lp = new LevelPart(levelPart, this.color, this.resistances);
		// 	console.log(this.positions);
		// 	this.levelDrawen.push(lp);
		// }
	}

	evaluate(){
		let res = this.levelDrawen.evaluate();
		if(this.resultText) PIEremoveElement(this.resultText);
		if(res != "UNFILLED") {
			if(res - parseInt(res) != 0) res = res.toFixed(2);
		}
		if(res == "UNFILLED"){
			this.resultText = drawText("FILL ALL VALUES!", 0xffffff, 0.5, 0.001, fontOptimer, 0.0, true);	
			this.resultText.position.set(-3, -4.5, 1.6);
		} else if(res == this.questions[this.currentPart]){
			this.resultText = drawText("CORRECT!", 0x00ff00, 0.5, 0.001, fontOptimer, 0.0, true);
			this.resultText.position.set(-2, -4.5, 1.6);
			this.levelDone[this.currentPart] = true;
			this.resetText = drawText("click on Reset", 0xbcbcbc, 0.3, 0.001, fontOptimer, 0.0, true)
			this.resetText.position.set(-1.5, -3.8, 1.6);
			PIEaddElement(this.resetText);
		} else {
			this.resultText = drawText("WRONG!", 0xff0000, 0.5, 0.001, fontOptimer, 0.0, true);
			this.resultText.position.set(-2, -4.5, 1.6);
		}
		this.redrawLevel();
		PIEaddElement(this.resultText);
		PIErender();
		// if(this.levelDone[this.currentPart] == true){
		// 	polling();
		// 	for(let i = (this.currentPart + 1) % this.levelDetails.length; i != this.currentPart; i = (i + 1) % this.levelDetails.length){
		// 		if(this.levelDone[i] == false) {
		// 			this.changeLevel(i - this.currentPart);
		// 		}
		// 	}
		// }
	}

	checkClick(){
		if(this.changePartNext){
			let intersects = raycaster.intersectObjects(this.changePartNext.children);
			if(intersects.length > 0){
				this.changeLevel(1);
				return true;
			}
		}

		if(this.changePartPrev){
			let intersects = raycaster.intersectObjects(this.changePartPrev.children);
			if(intersects.length > 0){
				console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\nDecreasing level");
				this.changeLevel(-1);
				return true;
			}
		}

		if(this.levelDone[this.currentPart] == true || this.gaveUpBool[this.currentPart] == true){
			console.log("returning on level gaveup or done");
			 return;}
			
		if(this.levelDrawen.checkClick()){
			console.log("level drawen check called");
			if(this.resultText){
				PIEremoveElement(this.resultText);
				this.resultText = null;
			}
			if(this.resetText) {
				PIEremoveElement(this.resetText);
				this.resetText = null;
			}
			return true;
		}
			
		if(raycaster.intersectObjects(this.checkButton.children).length > 0 && this.gaveUpBool[this.currentPart] == false){
			console.log("checking solution");
			this.evaluate();
			return true;
		}
		
		if(raycaster.intersectObjects(this.giveUpButton.children).length > 0){
			console.log("Give up button called");
			if(this.resultText) PIEremoveElement(this.resultText);
			
			this.resetText = drawText("click on Reset", 0xbcbcbc, 0.3, 0.001, fontOptimer, 0.0, true);
			this.resetText.position.set(-1.5, -3.8, 1.6);
			PIEaddElement(this.resetText);
			
			PIEremoveElement(this.checkButton);
			this.gaveUpBool[this.currentPart] = true;
			this.getCheckButton();
			PIEaddElement(this.checkButton);
			this.levelDrawen.showSolution();
			this.redrawLevel();
			return true;
		}
		return false;
	}
	
	showLevel(reset = false){
		this.levelDrawen = null;
		if(this.cache[this.currentPart] && !reset){
			this.levelDrawen = this.cache[this.currentPart];
		} else {
			this.levelDrawen = new LevelPart(this.levelDetails[this.currentPart], this.color, this.resistances, this.solutions[this.currentPart], this.formula[this.currentPart]);
			this.cache[this.currentPart] = this.levelDrawen;	
		}
		this.levelDrawen.draw();
		if(this.levelDetails.length != 0){
			if(this.currentPart != this.levelDetails.length - 1){
				let nextText = drawText("NEXT >", 0xffffff, 0.7, 0.001, fontOptimer, 0.0, true);
				nextText.position.z = 0.1;
				let nextBox = getRestructuredBoundingBox(nextText, 1.2, 2.0);
				nextBox.position.z = 0.0;
				this.changePartNext = new THREE.Group();
				this.changePartNext.add(nextText);
				this.changePartNext.add(nextBox);
				this.changePartNext.position.z = 2.0;
				PIEaddElement(this.changePartNext);
				this.changePartNext.position.x = 10;
				this.changePartNext.position.y = -0.3;
			}
			if(this.currentPart != 0){
				let prevText = drawText("< PREV", 0xffffff, 0.7, 0.001, fontOptimer, 0.0, true);
				prevText.position.z = 0.1;
			 	let prevBox = getRestructuredBoundingBox(prevText, 1.2, 2.0);
				prevBox.position.z = 0.0;
				this.changePartPrev = new THREE.Group();
				this.changePartPrev.add(prevText);
				this.changePartPrev.add(prevBox);
				this.changePartPrev.position.z = 2.0;
				PIEaddElement(this.changePartPrev);
				this.changePartPrev.position.y = -0.3;
				this.changePartPrev.position.x = -13.4;
			}
		}	
		var giveUpText = drawText("GIVE UP", 0xdedede, 1, 0.001, fontHelvetick, 0.0, true);
		giveUpText.position.z = 0.6;
		var bx = getRestructuredBoundingBox(giveUpText, 1.6, 2.6, true, 0x225fc1, 1.0);
		bx.position.z = 0.0;
		this.giveUpButton = new THREE.Group();
		this.giveUpButton.add(giveUpText);
		this.giveUpButton.add(bx);
		this.giveUpButton.position.set(0.7, -6, 1.6);
		this.giveUpButton.scale.x = 0.6;
		this.giveUpButton.scale.y = 0.6;
		PIEaddElement(this.giveUpButton);

		let qt1 = drawText("Fill the resistances in box to make", 0xdedede, 0.5, 0.001, fontGentilis, 0.0, true);
		let qt2 = drawText("total resistance " + this.questions[this.currentPart] + " ohm of the circuit.", 0xdedede, 0.5, 0.001, fontGentilis, 0.0, true)
		qt2.position.x = -0.5;
		this.questionPosed = new THREE.Group();
		qt2.position.y = -0.7;
		this.questionPosed.add(qt1);
		this.questionPosed.add(qt2);
		this.questionPosed.position.set(-5, 4, 1.4);
		PIEaddElement(this.questionPosed);
		this.getCheckButton();
		PIEaddElement(this.checkButton);
		this.redrawLevel();
		
	}

	requestLevelUpgrade(){
		return "Upgrade";
	}

	filledAll(){
		for(let i = 0; i < this.levelDone.length; ++i){
			if(this.levelDone[i] == false) return false;
		}
		return true;
	}

	redrawLevel(){
		console.log("redraw called");
		// this.levelDrawen.setPosition();
		if(window.innerWidth < 640){
			this.questionPosed.scale.x = 2.4;
			this.questionPosed.scale.y = 1.0;
			this.questionPosed.position.set(-12, 4, 1.4);
			if(this.resetText){
				this.resetText.scale.x = 3.0;
				this.resetText.scale.y = 2.0
				this.resetText.position.set(-3.5, -3.8, 1.6);
			}
			if(this.resultText){
				this.resultText.scale.x = 2.0;
				this.resultText.position.set(-3, -4.5, 1.6);
			}
		} else {
			this.questionPosed.scale.x = 1.0;
			this.questionPosed.scale.y = 1.0;
			this.questionPosed.position.set(-5, 4, 1.4);
			if(this.resetText){
				this.resetText.scale.x = 1.0;
				this.resetText.position.set(-1.5, -3.8, 1.6);
			}
			if(this.resultText){
				this.resultText.scale.x = 1.0;
				this.resultText.position.set(-2, -4.5, 1.6);
			}
		}
		this.levelDrawen.redraw();
		PIErender();
	}

	getCheckButton(){
		var checkText = drawText("CHECK", 0xdedede, 1, 0.001, fontHelvetick, 0.0, true);
		checkText.position.z = 0.6;
		var bxCheck;
		if(this.gaveUpBool[this.currentPart] == false){
			bxCheck = getRestructuredBoundingBox(checkText, 1.6, 2.6, true, 0x225fc1, 1.0);	
		} else{
			bxCheck = getRestructuredBoundingBox(checkText, 1.6, 2.6, true, 0x111111, 1.0);
		}
		bxCheck.position.z = 0.0;
		this.checkButton = new THREE.Group();
		this.checkButton.add(checkText);
		this.checkButton.add(bxCheck);
		this.checkButton.position.set(-4, -6, 1.6);
		this.checkButton.scale.x = 0.6;
		this.checkButton.scale.y = 0.6;
	}

	changeLevel(factor){
		console.log("----------------------------------------------------d")
		this.removeLevel();
		console.log("changeLevel called " + this.currentPart);
		if(factor > 0 && this.currentPart < this.levelDetails.length - 1){
			this.currentPart = this.currentPart + factor;
		} else if(factor < 0 && this.currentPart > 0) {
			console.log("degrading the part");
			this.currentPart = this.currentPart + factor;
		}
		this.showLevel();
		PIErender();
		// if(thi)
	}

	resetLevel(){
		this.levelDone[this.currentPart] = false;
		this.gaveUpBool[this.currentPart] = false;
		this.removeLevel();
		this.showLevel(true);
	}

	removeLevel(){
		if(this.resetText) PIEremoveElement(this.resetText);
		if(this.resultText) PIEremoveElement(this.resultText);
		if(this.questionPosed) PIEremoveElement(this.questionPosed);
		if(this.changePartNext) PIEremoveElement(this.changePartNext);
		if(this.changePartPrev) PIEremoveElement(this.changePartPrev); 	
		if(this.giveupButtom) PIEremoveElement(this.giveupButtom);
		this.resetText = this.resultText = this.changePartNext = this.changePartPrev = null;
		this.levelDrawen.remove();
	}
}

function initBackgroundForGame() {
	var boardG = new THREE.BoxGeometry(29.5, 14.5);
	var boardM = new THREE.MeshPhongMaterial({ color: 0x8fd1ef, transparent: true });
	var board = new THREE.Mesh(boardG, boardM);

	var boardCoverG = new THREE.BoxGeometry(30, 15);
	var boardCoverM = new THREE.MeshPhongMaterial({ color: 0x1a4499, transparent: true });
	var boardCover = new THREE.Mesh(boardCoverG, boardCoverM);
	boardCover.position.z = -0.01;

	fBoard = new THREE.Group();
	fBoard.add(board);
	fBoard.add(boardCover);
	PIEaddElement(fBoard);
}

var levelString = 
	oml.BL + "-" + oml.BTL + "-" + oml.RB + "-" + oml.BTR + "\n" +
	oml.BTL + "-" + oml.VLF + "-" + oml.BL + "-" + oml.VRF + "-" + oml.MHF + "-" + oml.RB + "-" + oml.BTR + "\n" + 
	 oml.VLF + "-" + oml.BBL + "-" + oml.RB + "-" + oml.BBR + "-" + oml.BL + "-" + oml.BL + "-" + oml.VRF; 

function loadExperimentElements() {
	preLoad();
	PIEsetAreaOfInterest(-10, 10, 10, -10);
	initBackgroundForGame();

	document.addEventListener("mousedown", onMouseDown, false);
}

function newLevel(newStart = false){
	if(newStart){
		currentLevel = 1;
		let boxLevelUp = new LevelCoverBoxEmptyObject(1.5, 1.5, 0xbcbcbc, 0xbcbcbc, 0.1, true).draw;
		let textLevelUp = alignCenter(drawText("<", 0x111111, 0.7, 0.001, fontOptimer, 0.0, true), boxLevelUp)[0];
		levelTextInfo = drawText("Level: ", 0xbcbcbc, 0.7, 0.001, fontGentilis, 0.0, true);
		levelChangeDown = new THREE.Group();
		levelChangeDown.add(boxLevelUp);
		levelChangeDown.add(textLevelUp);
		levelChangeUp = levelChangeDown.clone();
		levelChangeUp.rotation.z = deg2Rad(180);
		levelChangeDown.position.x = 0;
		levelChangeUp.position.x = 3;
		levelChangeUp.position.y = 6;
		levelChangeUp.position.z = 0.5;
		levelChangeDown.position.y = 6;
		levelChangeDown.position.z = 0.5;
		levelTextInfo.position.y = 5.8;
		levelTextInfo.position.x = -4;
		PIEaddElement(levelChangeUp);
		PIEaddElement(levelChangeDown);
		PIEaddElement(levelTextInfo);
		window.addEventListener("resize", onWindowResize, false);
	}
	if(curLevelText){
		PIEremoveElement(curLevelText);
	}
	curLevelText = drawText(currentLevel, 0xbcbcbc, 0.7, 0.001, fontOptimer, 0.0, true);
	curLevelText.position.x = 1.2;
	curLevelText.position.y = 5.7;
	if(lvl){lvl.removeLevel();}
	lvl = new Level(levelDet[currentLevel].map, levelDet[currentLevel].resistances, levelDet[currentLevel].solutions, levelDet[currentLevel].questions, levelDet[currentLevel].formula);
	// lvl.parseLevels();
	lvl.showLevel();
	PIEaddElement(curLevelText);
}

function changeLevel(change){
	if(change < 0){
		if(currentLevel + change < 1) return;
		else{
			currentLevel += change;
			newLevel();
			PIErender();
			return;
		}
	}
	
	if(change > 0){
		if(currentLevel + change > 5) return;
		else {
			currentLevel += change;
			newLevel();
			PIErender();
			return ;
		}
	}
}

function resetExperiment() {
	// this.pollingBool = false
	if(lvl) lvl.resetLevel();
}


function updateExperimentElements(t, dt) {

}

function onMouseDown(event){
	if(pollingBool) return;
	console.log("Mouse down called");
	PIErender();
	mouse.x = ( event.clientX / PIErenderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / PIErenderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, PIEcamera );
	let handled = false;
	if(showingStart == true && !handled){
		intersects = raycaster.intersectObjects(startScreen.children);
		if(intersects.length > 0){
			showingStart = false;
			PIEremoveElement(startScreen);
			console.log("Starting Game...");
			newLevel(true);
			PIErender();
			handled = true;
		}
	} 
	if(!handled && showingStart == false){
		console.log("change Level check");
		intersects = raycaster.intersectObjects(levelChangeUp.children);
		if(intersects.length > 0){
			changeLevel(1);
			PIErender();
			return;
		}
		intersects = raycaster.intersectObjects(levelChangeDown.children);
		if(intersects.length > 0){
			changeLevel(-1);
			PIErender();
			return;
		}
	}
	if(lvl && !handled){
		console.log("level check called")
		handled = lvl.checkClick();
		if(lvl.filledAll()){
			console.log("* * * * * * change level called on level completion * * * * * * ")
			changeLevel(1);
			PIErender();
			return;
		}
	}
	PIErender();
	return handled;
}

function onWindowResize(){
	if((prevSize <= 640 && window.innerWidth > 640) || (prevSize > 640 && window.innerWidth <= 640)){
		prevSize = window.innerWidth;
		if(lvl) lvl.redrawLevel();
	}
}