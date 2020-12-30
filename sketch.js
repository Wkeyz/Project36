//Create variables here
var dog,happyDog,database,foodS,foodStock;
var image1,image2;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var changeState,readState;
var bedroom,garden,washroom;
//var count=20;

function preload()
{
  //load images here
  image1=loadImage("images/Dog.png");
  image2=loadImage("images/dogImg1.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
}

function setup() {

  createCanvas(1000, 400);
  database = firebase.database();

  foodObj=new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock)

  fedTime=database.ref('fedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
})

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  dog=createSprite(200,200,50,100);
  dog.addImage(image1);
  dog.scale=0.15;
  
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


  
  
}


function draw() {  
background(46,129,87);

//text("Food Left-"+foodS,270,250);

textSize(25);


//text("Note: Press Up Arrow To Feed Draco Milk",10,20);

// fill(255,255,254);
// textSize(15);
// if(lastFed>=12){
//   text("Last Fed : "+lastFed%12+"PM",350,30);
// }else if(lastFed==0){
//   text("Last Fed : 12 AM",350,30);
// }else {
//   text("Last Fed : "+lastFed+" AM",350,30);
// }



  
  //add styles here
 
  currentTime=hour();
if(currentTime==(lastFed+1)){
  update("playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}else{
  update("hungry");
  foodObj.display();
}
if(gameState!=="hungry"){
feed.hide();
addFood.hide();
dog.remove();
}
else{
feed.show();
addFood.show();
dog.addImage(image1);
}
drawSprites();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    food:x
  })

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(image2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
   food:foodObj.getFoodStock(),
    fedTime:hour(),
gameState:"hungry"
    
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  });
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}