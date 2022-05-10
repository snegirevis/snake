let Grid_size = 21
let lastRenderTime = 0 
const snake_speed = 5
const snakeBody =[{x:11, y:11}]
const gameBoard = document.getElementById('game-board')
let inputDirection = {x:0, y:0}
let lastInputDirection = {x:0,y:0}
let food = getRandomFoodPosition()
const expansion_rate = 1
let newSegments =0
let gameOver  = false


function main(currentTime){
    if(gameOver){
    	if(confirm('You lost. Press ok to restart')){
    		location.reload()
    	}
    	return
    }

	window.requestAnimationFrame(main)
	const secondsSinceLastReder = ((currentTime - lastRenderTime)/ 1000)
	if(secondsSinceLastReder < (1 / snake_speed)) return
	lastRenderTime = currentTime

	update()
	draw()

}

window.requestAnimationFrame(main)

function update(){
	update_snake()
	update_food()
	checkDeath()
}

function draw(){
	gameBoard.innerHTML = ''
	draw_snake(gameBoard)
	draw_food(gameBoard)
}

function update_snake(){
    addSegments()

	const inputDirection = getInputDirection()
  for(let i =snakeBody.length -2; i>=0; i--){
  	snakeBody[i+1] = { ...snakeBody[i] }
  }

  snakeBody[0].x += inputDirection.x
  snakeBody[0].y += inputDirection.y
}

function draw_snake(gameBoard){
 
  snakeBody.forEach(segment =>{
  	const snakeElement = document.createElement('div')
  	snakeElement.style.gridRowStart = segment.y
  	snakeElement.style.gridColumnStart = segment.x 
  	snakeElement.classList.add('snake')
  	gameBoard.appendChild(snakeElement) 
  })
}

window.addEventListener('keydown', e => {
	switch(e.key){
	  case 'ArrowUp':	
	  if(lastInputDirection.y !==0) break
	  inputDirection ={x: 0, y: -1}
	  break
	  case 'ArrowDown':	
	  if(lastInputDirection.y !==0) break
	  inputDirection ={x: 0, y: 1}
	  break
	  case 'ArrowLeft':	
	  if(lastInputDirection.x !==0) break
	  inputDirection ={x: -1, y: 0}
	  break
	  case 'ArrowRight':	
	  if(lastInputDirection.x !==0) break
	  inputDirection ={x: 1, y: 0}
	  break
	}
} )

function getInputDirection(){
	lastInputDirection = inputDirection
	return inputDirection
}

function update_food(){
	if(onSnake(food)){
		expandSnake(expansion_rate)
		food =  getRandomFoodPosition()
	}
}

function draw_food(gameBoard){ 
  
  	const foodElement = document.createElement('div')
  	foodElement.style.gridRowStart = food.y
  	foodElement.style.gridColumnStart = food.x 
  	foodElement.classList.add('food')
  	gameBoard.appendChild(foodElement) 
  }

function expandSnake(amount){
	newSegments += amount
}

function onSnake(position, {ignoreHead = false} = {}){
	return snakeBody.some((segment, index) =>{
		if (ignoreHead && index === 0) return false
		return equalPositions(segment,position)
	} )
}

function equalPositions(pos1, pos2){
	return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments(){
	for(let i = 0; i<newSegments; i++){
		snakeBody.push({ ...snakeBody[snakeBody.length -1]})
	}

	newSegments = 0
}

function getRandomFoodPosition(){
	let newFoodPosition 
	while( newFoodPosition == null || onSnake(newFoodPosition)){
		newFoodPosition = randomGridPosition()
	}

	return newFoodPosition
}

function randomGridPosition(){
	
	return{
	
		x: Math.floor(Math.random()* Grid_size) +1,
		y: Math.floor(Math.random()* Grid_size) +1
	}
}

function checkDeath(){
 gameOver = outsideGrid(getSnakeHead()) || snakeIntersection() 

}

function outsideGrid(position){
	if(position.x < 1 || position.x > 21|| position.y <1 || position.y > 21)
	return true
	
}

function getSnakeHead(){
	return snakeBody[0]
}

function snakeIntersection(){
	return onSnake(snakeBody[0], {ignoreHead: true})
}

