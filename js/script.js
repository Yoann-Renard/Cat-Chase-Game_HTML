/* initialisation */window.onload = init;


class Sprite {

    width; height;
    x= 50;
    y=50;
    actualWidth;
    actualHeight;
    xdirection;
    ydirection;
    ismoving = false;
    image;
    speedx;
    speedy;

    draw(context) {
    if (this.image != null) {
    context.drawImage(this.image, this.x, this.y, this.actualWidth, this.actualHeight);
     } else {
    // Draw a rectangle
     context.fillStyle = "#CCC";
     context.fillRect(this.x, this.y, this.actualWidth, this.actualHeight);
     }
    }
}

/// Variables --- //

//Info
var death_counter=0;
var sec = 0;
var sec_save;
var sec_histo=['--','--','--','--','--','--','--','--','--','--'];
var sec_best = [0,0,0,0,0,0,0,0,0,0];
var timer_pause;
var start = 0;
var pause_active =1;
// Pouvoirs
var tele_disp = 1;
var stop_disp = 1;
var pouvoir_actif = 0;
var tele;
var stop;
// Canvas
let canvas;
let context ;
// fps computing
let secondsPassed;
let oldTimeStamp;
let fps;
// Parametrage
var rectx =180, recty=100;
let speed=3;
var oldspeed = 2;
var oldspeedx = 3;
var oldspeedy = 3;
//mouse information
let mousex, mousey;
var varmousex;
var varmousey;
// --- Variables ///




function init() {
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Récupération des coordonnées de la souris
    canvas.onmousemove = (e) => {
    mousex = e.offsetX;
    mousey = e.offsetY;
    };

    // Entité Chat
    Entity_Cat = new Sprite();
    Cat_Swap('Cat2');


    // Entité souris
    Entity_Mouse = new Sprite();
    Mouse_Swap('Mouse3');

    // Entité Entity_Robot
    Entity_Robot = new Sprite();
    Entity_Robot.x=1000;
    Entity_Robot.y=500;
    Entity_Robot.width = 75;
    Entity_Robot.height = 75;
    Entity_Robot.actualHeight = 75;
    Entity_Robot.actualWidth = 75;
    Entity_Robot.speedx = 2;
    Entity_Robot.speedy = 2;
    Entity_Robot.image = document.getElementById('Robot1');

    // Le jeu commence en mode pause
    pause();

    window.requestAnimationFrame(gameLoop);

}

function draw() {

    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);


    Entity_Cat.x += (Entity_Cat.x < mousex-80) ? speed*Number(1) : -speed*Number(1);
    Entity_Cat.y += (Entity_Cat.y < mousey-40) ? speed*Number(1) : -speed*Number(1);


    Entity_Mouse.x = mousex -25;
    Entity_Mouse.y = mousey -25;


    Entity_Robot.x += Entity_Robot.speedx*Number(1);
    Entity_Robot.y += Entity_Robot.speedy*Number(1);
    // Draw a rectangle
    //context.fillStyle = "#CCC";
    //context.fillRect(100, 100, 150, 150);

    // On dessine la souris les 2 autres si start = 1

    Entity_Mouse.draw(context);



    if (start == 1){
      Entity_Cat.draw(context);
      Entity_Robot.draw(context);
    }

    // On test la collison du robot avec le bord
    collision_bord_Entity_Robot();
    // Si le chat touche le robot, il s'arrete pendant 500ms
    collision_chat_robot();

    // Game over uniquement si le chat bouge
    if (speed !=0){
    Game_Over();
    }
}


function Game_Over() {
    // On test la collision avec le chat ou le robot
    if( (mousex-80 < Entity_Cat.x+30) && (mousex-80 > Entity_Cat.x-30) && ( mousey-40 < Entity_Cat.y+30) && ( mousey-40 > Entity_Cat.y-30)
    || ((mousex-25 < Entity_Robot.x+Entity_Robot.actualWidth) && (mousex-25 > Entity_Robot.x-Entity_Robot.actualWidth) && ( mousey-25 < Entity_Robot.y+Entity_Robot.actualHeight) && ( mousey-25 > Entity_Robot.y-Entity_Robot.actualHeight))) {

    //console.warn('Game_Over'); //( Test )

    // On change la couleur du cadre en rouge
    document.getElementById('canvas').style = "border: 2px solid red";

    // On replace le chat
    Entity_Cat.x = Math.floor(Math.random() * (1500 - Entity_Cat.actualWidth));
    Entity_Cat.y = Math.floor(Math.random() * (600 - Entity_Cat.actualHeight));

    // On replace le robot
    Entity_Robot.x = Math.floor(Math.random() * (1500 - Entity_Robot.actualWidth));
    Entity_Robot.y = Math.floor(Math.random() * (600 - Entity_Robot.actualHeight));

    // On ajoute une mort
    add_death();

    // On lance l'audio
    audio_play('Hurt_Sound');

    // On stop le chat et le robot pendant quelque temps
    pause();
    setTimeout(function () {
      resume();
    }, 900);

    // Apres 1s on remet la couleur du cadre en gris
    setTimeout(function () {
      document.getElementById('canvas').style = "border: 1px solid lightgrey";
    }, 1000);


    // On restart le timer et on sauvegarde le temps
    timer_stop();

    // On débloque les pouvoirs
    clearInterval(stop);
    stop_disp = 1;
    document.getElementById('stop_cooldown').innerHTML = '<b class="cd">up</b>';
    clearInterval(tele);
    tele_disp = 1;
    document.getElementById('tele_cooldown').innerHTML = '<b class="cd">up</b>';
  }
}


function gameLoop(timeStamp) {

    //update data
    //update();
    //then draw it
    draw();

    draw_fps(timeStamp);

    window.requestAnimationFrame(gameLoop);
    }

    function draw_fps(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    context.font = '12px Arial';
    context.fillStyle = 'white';
    context.fillText("FPS: " + fps, 0, 10);
}


function Cat_Swap(img_id) {
    new_img=document.getElementById(img_id);
    Entity_Cat.image = new_img;

    // Correction tailles
    switch (img_id) {
      case 'Cat4':
      Entity_Cat.width = 150;
      Entity_Cat.height = 150;
      Entity_Cat.actualWidth = 150;
      Entity_Cat.actualHeight = 150;
        break;
      case 'Cat3':
      Entity_Cat.width = 200;
      Entity_Cat.height = 150;
      Entity_Cat.actualWidth = 200;
      Entity_Cat.actualHeight = 150;
        break;
      case 'Cat2':
      Entity_Cat.width = 200;
      Entity_Cat.height = 125;
      Entity_Cat.actualWidth = 200;
      Entity_Cat.actualHeight = 125;
        break;
      case 'Cat1':
      Entity_Cat.width = 120;
      Entity_Cat.height = 150;
      Entity_Cat.actualWidth = 120;
      Entity_Cat.actualHeight = 150;
        break;
      default: break;
    }
    // On corrige l'affichage
    document.getElementById('affichage_taille').innerHTML = Entity_Cat.actualWidth;
}

function Mouse_Swap(img_id) {
    new_img=document.getElementById(img_id);
    Entity_Mouse.image = new_img;

    // Correction tailles
    switch (img_id) {
      case 'Mouse3':
      Entity_Mouse.width = 75;
      Entity_Mouse.height = 35;
      Entity_Mouse.actualWidth = 75;
      Entity_Mouse.actualHeight = 35;
        break;
      case 'Mouse4':
      Entity_Mouse.width = 60;
      Entity_Mouse.height = 60;
      Entity_Mouse.actualWidth = 60;
      Entity_Mouse.actualHeight = 60;

        break;
      case 'Mouse2':
      Entity_Mouse.width = 75;
      Entity_Mouse.height = 50;
      Entity_Mouse.actualWidth = 75;
      Entity_Mouse.actualHeight = 50;
        break;
      case 'Mouse1':
      Entity_Mouse.width = 50;
      Entity_Mouse.height = 50;
      Entity_Mouse.actualWidth = 50;
      Entity_Mouse.actualHeight = 50;
        break;
      default: break;

    }

}

function add_speed() {
  if (Entity_Robot.speedx != 0) {
    speed++;
    document.getElementById('affichage_vitesse').innerHTML=speed;
  }
}

function sub_speed() {
  if (Entity_Robot.speedx != 0) {
    speed--;
    document.getElementById('affichage_vitesse').innerHTML=speed;
  }
}


function add_death() {
  death_counter++;
  document.getElementById('dth').innerHTML= death_counter;

}

function pause() {
  if ( pouvoir_actif==0){
  pause_active=1;
  // Si le jeu n'est deja pas en pause, on sauvegarde les vitesses des entités
  if ( speed !=0 ){
  oldspeedx = Entity_Robot.speedx;
  oldspeedy = Entity_Robot.speedy;
  oldspeed = speed;
  }

  // On stop les entités
  speed = 0;
  Entity_Robot.speedx=0;
  Entity_Robot.speedy=0;
  // On met à jour l'affichage de la vitesse
  document.getElementById('affichage_vitesse').innerHTML=speed;
}
}

function resume() {
  pause_active=0;
  // On redonne la bonne vitesse aux entités
  speed=oldspeed;
  Entity_Robot.speedx=oldspeedx;
  Entity_Robot.speedy=oldspeedy;
  // On met à jour l'affichage de la vitesse
  document.getElementById('affichage_vitesse').innerHTML=speed;
}

function audio_play(x) {
  var audio = document.getElementById(x); // 'x' est l'ID de l'audio que l'on veut jouer

  audio.volume = 0.2; // On baisse le volume

  audio.play(); // On lance l'audio
}

function collision_bord_Entity_Robot(){
    if (Entity_Robot.x < 0){
      Entity_Robot.speedx = - Entity_Robot.speedx;
    }
    if (Entity_Robot.y < 0){
      Entity_Robot.speedy = - Entity_Robot.speedy;
    }
    if (Entity_Robot.x + Entity_Robot.actualWidth > 1500){
      Entity_Robot.speedx = - Entity_Robot.speedx;
    }
    if (Entity_Robot.y + Entity_Robot.actualHeight > 600){
      Entity_Robot.speedy = - Entity_Robot.speedy;
    }
}

function add_taille() {
  // On modifie la taille
  Entity_Cat.width += 10;
  Entity_Cat.actualWidth += 10;
  Entity_Cat.height += 10;
  Entity_Cat.actualHeight += 10;
  // On affiche la nouvelle taille
  document.getElementById('affichage_taille').innerHTML = Entity_Cat.actualWidth;
}

function sub_taille() {
  // On modifie la taille
  Entity_Cat.width -= 10;
  Entity_Cat.actualWidth -= 10;
  Entity_Cat.height -= 10;
  Entity_Cat.actualHeight -= 10;
  // On affiche la nouvelle taille
  document.getElementById('affichage_taille').innerHTML = Entity_Cat.actualWidth;
}

function Robot_Swap(img_id) {
    new_img=document.getElementById(img_id);
    Entity_Robot.image = new_img;
  }

function play() {
  start = 1;
  pause_active = 0;

  // On affiche les boutons pause / resume
  document.getElementById('bouton1').hidden =false;
  document.getElementById('bouton2').hidden =false;

  // On masque le bouton play
  document.getElementById('play').hidden = true;


  // On lance la partie
  resume();
}

function timer_play(){
    var timer = setInterval(function(){
        document.getElementById('temps_en_vie').innerHTML=sec + ' s';
        sec++;
    }, 1000);
}

function timer_pause_start() {
  if (pouvoir_actif==0){
  oldsec = sec;
  timer_pause = setInterval(function(){
      sec = oldsec;
  }, 300);
}
}

function timer_pause_end() {
  clearInterval(timer_pause);
}

function timer_stop() {
  // On sauvegarde le temps
  sec_save = sec;
  sec=0;

  // On décale les temps dans l'array
  for (var i = sec_histo.length-1 ; i > 0 ; i--){
    sec_histo[i]=sec_histo[i-1];
  }

  // On enregistre le dernier temps
  sec_histo[0] = sec_save;

  // On affiche les temps
  for ( var i = 0; i< sec_histo.length; i++){
    document.getElementById('temps'+i).innerHTML=sec_histo[i] + ' s';
  }

  // On sauvegarde les meilleurs temps
  if ( sec_save > sec_best[9]){
    sec_best[9] = sec_save;
    sec_best.sort(function(a, b){return b - a});
    for ( var i = 0; i< sec_best.length; i++){
      document.getElementById('mtemps'+i).innerHTML=sec_best[i] + ' s';
    }
  }

  //console.log(sec_histo); //(test)
}

function power_trigger(event) {
  var key = event.keyCode;
  //console.log(key); // ( Test )


  if ( key == '69' && tele_disp == 1 && pause_active==0){power_teleportation();}
  if ( key == '82' && stop_disp ==1 && pause_active==0){power_time_stop();}

}

function power_teleportation() {
  audio_play('teleport_effect');
  power_teleportation_cooldown();
  if (speed != 0){oldspeed=speed;}
  pouvoir_actif = 1;
  speed=0;
  Mouse_Swap('teleport');
  document.getElementById('canvas').style = "border: 2px solid yellow";
  setTimeout(function () {
    speed=oldspeed;
    pouvoir_actif=0;
    Mouse_Swap('Mouse3');
    document.getElementById('canvas').style = "border: 1px solid lightgrey";
  }, 500)
}

function power_teleportation_cooldown() {
  tele_disp = 0;
  var cooldown = 5;
  tele=setInterval( function () {
    document.getElementById('tele_cooldown').innerHTML ='<b class="cd">'+ cooldown +' s</b>';
    cooldown--;
    if (cooldown<0){
      clearInterval(tele);
      tele_disp = 1;
      document.getElementById('tele_cooldown').innerHTML = '<b class="cd">up</b>';
    }
    //console.log(tele_disp); // ( Test )
  }, 1000)
}

function power_time_stop() {
  audio_play('stop_effect');
  power_time_stop_cooldown();
  pause();
  pouvoir_actif=1;
  document.getElementById('canvas').style = "border: 2px solid blue";
  setTimeout(function () {
    resume();
    pouvoir_actif=0;
    document.getElementById('canvas').style = "border: 1px solid lightgrey";
  },3000 )
}

function power_time_stop_cooldown() {
  stop_disp=0;
  var cooldown = 20;
  stop=setInterval( function () {
    document.getElementById('stop_cooldown').innerHTML = '<b class="cd">'+ cooldown +' s</b>';
    cooldown--;
    if (cooldown<0){
      clearInterval(stop);
      stop_disp = 1;
      document.getElementById('stop_cooldown').innerHTML = '<b class="cd">up</b>';
    }
    //console.log(tele_disp); // ( Test )
  }, 1000)
}

function collision_chat_robot() {
  if(((Entity_Cat.x+50 < Entity_Robot.x+Entity_Robot.actualWidth) && (Entity_Cat.x+50 > Entity_Robot.x-Entity_Robot.actualWidth) && ( Entity_Cat.y+40 < Entity_Robot.y+Entity_Robot.actualHeight) && ( Entity_Cat.y+40 > Entity_Robot.y-Entity_Robot.actualHeight))){
    if (speed!=0 && speed != 1){oldspeed=speed;}
    speed=1;
    setTimeout(function () {
      speed=oldspeed;
    }, 500)
  }

}
