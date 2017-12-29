let switch_el = document.getElementById('switch'),
    start_el = document.getElementById('start'),
    strict_el = document.getElementById('strict'),
    count_el =  document.getElementById('count'),
    color_els = document.getElementById('color-grid').children,
    audio=document.createElement('audio'),
    color_audio = {
      yellow:0,
      green:1,
      red:2,
      blue:3,
      0:['yellow','rgb(247, 233, 101)','https://s3.amazonaws.com/freecodecamp/simonSound1.mp3','rgb(216, 199, 43)'],
      1:['green','rgb(90, 204, 75)','https://s3.amazonaws.com/freecodecamp/simonSound2.mp3','rgb(48, 155, 34)'],
      2:['red','rgb(206, 74, 74)','https://s3.amazonaws.com/freecodecamp/simonSound3.mp3','rgb(173, 17, 17)'],
      3:['blue','rgb(67, 139, 232)','https://s3.amazonaws.com/freecodecamp/simonSound4.mp3','rgb(7, 68, 147)']
    },
    game = {
      programSeq:[],
      state:false, //false=OFF, true=ON 
      strict: false,//true=strict mode active
      turn: false,//false=program turn, true=user turn
      count: 0,
      userCorrect: true,
      userClicks:0,
      looperFunc: function(){
        let i=0;
        game.looper = setInterval(function(){
          
          let arr = game.programSeq[i];
          audio.setAttribute('src', arr[2]);
          
          setTimeout(function(){//change background color + play audio
            audio.play();
            document.getElementById(arr[0]).style.backgroundColor = arr[1];
          },500);
          setTimeout(function(){//restor original background color
            document.getElementById(arr[0]).style.backgroundColor = arr[3];
          },900);
          
          i++;
          if (i===game.programSeq.length){
            clearInterval(game.looper); 
            game.userClicks=0;
            game.turn=true;
          }
        },1000);
      },//programTurn
      clearLooper: function(){
        clearInterval(game.looper);
      }
    };//game obj

window.onload = function(){
  
  //Click EventListeners
  switch_el.addEventListener('click', switch_func);
  start_el.addEventListener('click', start_func);
  strict_el.addEventListener('click',strict_func);
  for (var a=0;a<color_els.length;a++){
    color_els[a].addEventListener('click',user_color_click);
    color_els[a].addEventListener('mouseover',user_color_hover);
    color_els[a].addEventListener('mousedown',user_color_mousedown);
    color_els[a].addEventListener('mouseup',user_color_mouseup);
  }
  
  
};//window.onload

function switch_func(){
  if (this.style.justifyContent ==''){//turn game ON
    this.style.justifyContent ='flex-end';
    game.state=true;
    count_el.innerHTML = '--';
  }
  else {//turn game OFF
    this.style.justifyContent = '';
    game.state=false;
    count_el.innerHTML='';
    game.turn=false;
    strict_el.style.backgroundColor = 'rgb(255, 0, 0)';
    game.clearLooper();
  }
}//switch_func
function strict_func(){
  if (game.state){
    this.style.backgroundColor == 'rgb(255, 0, 0)' ? (
      this.style.backgroundColor = 'rgb(19, 145, 10)',
      game.strict=true 
    ):(
      this.style.backgroundColor = 'rgb(255, 0, 0)',
      game.strict=false
      );
  }//if
}//strict_func
function start_func(){
  if (game.state){
    //reset required game properties
    game.clearLooper();
    game.programSeq=[];
    game.count=0;
    game.userClicks=0;
    game.userCorrect=true;
    game.turn=false;//program's turn
    //call program_turn function
    program_turn();
  }//if
}//start_func

function program_turn(){
  let num = Math.floor(Math.random()*4),
      cur_target = color_audio[num];//[0]=color, [1]=color to change to, [2]=audio
  
  game.turn=false;
  
  if (game.userCorrect){
    //update count and change count display
    game.count++;
    count_el.innerHTML=game.count;
    //add cur_target to the programSeq
    game.programSeq.push(cur_target);
    
    game.looperFunc();  
  }//if game.userCorrect=true
  
  else if (!game.userCorrect){
    console.log('wrong');
    if (game.strict){
      setTimeout(function(){
        start_func();
        count_el.innerHTML=game.count;
    },2900);
    }
    else{
      setTimeout(function(){
        count_el.innerHTML=game.count;
        game.looperFunc();
    },2900);
    }
    
  }//if game.userCorrect=false
}//program_turn

function user_color_click(){
  
  if (game.turn){//check it is actually the user's turn
    let color_clicked = this.id;
    
    if (color_clicked===game.programSeq[game.userClicks][0]) {//check match
      game.userCorrect=true;
      game.userClicks++;
      if (game.userClicks===20){//start userClicks at 0 so... -> check to win game
        count_el.innerHTML='win';
        setTimeout(function(){
          count_el.innerHTML='--';
          game.turn=false;//program's turn
        },1600);
      }
      else if (game.userClicks===game.programSeq.length){ //-> check to see to advance to next stage/count
        //game.userCorrect will be true
        game.turn = false;
        game.userClicks=0;
        //update counter
        program_turn();
      }
    }
    else {//no match -> WRONG INPUT
      //update display with '!!' in count_el
      count_el.innerHTML='!!';
      let j=0,
          a = setInterval(function(){
            count_el.innerHTML==='!!' ? count_el.innerHTML='' : count_el.innerHTML='!!'
            j++;
            if (j===7){
              clearInterval(a);
            }
          },400);
      
      game.userCorrect=false;
      game.turn=false;
      program_turn();//repeats/starts new sequence if not in/in strict mode
    }
  }//if game.turn
  
}//user_color_click

function user_color_hover(){
  if (game.turn && game.state){
    let target = document.getElementById(this.id);
    target.style.cursor = 'pointer';
    
  }//if game.turn
}

function user_color_mousedown(){
  if(game.turn && game.state){
    let prop = color_audio[this.id];
    document.getElementById(this.id).style.background=color_audio[prop][1];
    audio.setAttribute('src', color_audio[prop][2]);
    audio.play();
  }
}
function user_color_mouseup(){
  let prop = color_audio[this.id];
  document.getElementById(this.id).style.background = color_audio[prop][3];
}