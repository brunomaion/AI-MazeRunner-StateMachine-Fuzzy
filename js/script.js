(function(){

    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");

    var WIDTH = cnv.width, HEIGHT = cnv.height;

    var LEFT  = 37, UP=38, RIGTH = 39, DOWN = 40;
    var mvLeft = mvUp = mvRigth = mvDown = false;

    var walls = [];

    var tamanhoBloco = 32;
    var distanciaPersegui = 100;

    var tempoReiniciar = 4000;
    var valorVidas = 3;
    var vidas = valorVidas;

    var limiteAvanco = 50;
    var tempoAtualizarAlerta = 1000;


    

    class Jogador {

        constructor(){
            this.x = (tamanhoBloco+2); 
            this.y = (tamanhoBloco+2);
            this.width = 20;
            this.height = 20;
            this.speed = 2;

            this.pos1 = {x: 5 * tamanhoBloco, y: 5 * tamanhoBloco};
            this.pos2 = {x: 15 * tamanhoBloco, y: 15 * tamanhoBloco};
            this.currentPos = this.pos1;
        }

        draw(){
            ctx.fillStyle = '#00FA2F'; //COR QUADRADO
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
        
    };

    class Enemy {
        constructor(){
            this.x = (tamanhoBloco+2)*8; 
            this.y = (tamanhoBloco+2)*8;
            this.width = 20;
            this.height = 20;
            this.speed = 1.8;
        }

        draw(){
            ctx.fillStyle = '#FF2D00'; //COR QUADRADO
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }


        collidesWithWall(x, y) {
            var col = Math.floor(x / tamanhoBloco);
            var row = Math.floor(y / tamanhoBloco);
            return walls[row][col] == 1;
        }

        isPlayerClose(player) {
            var dx = this.x - player.x;
            var dy = this.y - player.y;
            var dist = Math.sqrt(dx*dx + dy*dy);
            return dist < distanciaPersegui;
        }


        isPlayerLong(player) {
            var dx = this.x - player.x;
            var dy = this.y - player.y;
            var dist = Math.sqrt(dx*dx + dy*dy);
            return dist > distanciaPersegui;
        }

        patrol(player) {
            var self = this;
            setInterval(function() {
                if (self.isPlayerLong(player) || estadoAlerta == false) { // Se o jogador estiver próximo
                    estado = 1; // Muda o estado para patrulhando
                }

                if (self.isPlayerClose(player) || estadoAlerta == true) { // Se o jogador estiver próximo
                    estado = 2; // Muda o estado para perseguir
                }
                if (estado == 1) { // Se o estado é "patrulhando"
                    // Verifica se deve mudar a direção
                    if (Math.random() < 0.1) { // Chance de 10% de mudar de direção
                        var directions = ["left", "up", "right", "down"];
                        self.direction = directions[Math.floor(Math.random()*4)];
                    }
    
                    // Move na direção atual
                    if (self.direction == "left" && !self.collidesWithWall(self.x - self.speed, self.y)) {
                        self.x -= self.speed;
                    }
                    else if (self.direction == "up" && !self.collidesWithWall(self.x, self.y - self.speed)) {
                        self.y -= self.speed;
                    }
                    else if (self.direction == "right" && !self.collidesWithWall(self.x + self.speed, self.y)) {
                        self.x += self.speed;
                    }
                    else if (self.direction == "down" && !self.collidesWithWall(self.x, self.y + self.speed)) {
                        self.y += self.speed;
                    }
                }
                else if (estado == 2) { // Se o estado é "perseguindo"
                    // Calcula a direção para chegar até o jogador
                    var dx = player.x - self.x;
                    var dy = player.y - self.y;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (dx > 0 && !self.collidesWithWall(self.x + self.speed, self.y)) {
                            self.x += self.speed;
                            self.direction = "right";
                        }
                        else if (dx < 0 && !self.collidesWithWall(self.x - self.speed, self.y)) {
                            self.x -= self.speed;
                            self.direction = "left";
                        }
                    }
                    else {
                        if (dy > 0 && !self.collidesWithWall(self.x, self.y + self.speed)) {
                            self.y += self.speed;
                            self.direction = "down";
                        }
                        else if (dy < 0 && !self.collidesWithWall(self.x, self.y - self.speed)) {
                            self.y -= self.speed;
                            self.direction = "up";
                        }
                    }
                }
            }, 10); // A cada 100ms
        }
    
        
    };

    const enemy1 = new Enemy()


    const jogador = new Jogador()
    enemy1.patrol(jogador)


    //ESTADO INIMIGO INICIAR
    var estado = 1; // [0-PARADO][1 - VIGIAR][2-PERSEGUIR]
    
    var maze = [ // MAPA DO LABIRINTO
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,0,0,0,0,1,0,0,0,1,1,1,1,0,1],
        [1,0,0,1,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,0,1,0,0,0,1,0,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,0,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,0,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1,0,1,1,1,0,1,0,0,1],
        [1,0,1,1,1,1,0,0,1,0,1,0,0,0,0,0,1,0,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,0,0,1,0,1,1,1,1,0,1,1,1,0,1,1,1],
        [1,0,1,1,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,0,0,0,1,0,1,1,0,1,1,1,0,0],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]; 

    /*var maze = [ // MAPA DO LABIRINTO
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];*/





    function reiniciarJogador(){
        // aqui você pode redefinir todas as variáveis necessárias para reiniciar o jogo
        
        // reinicia a posição do jogador
        jogador.x = (tamanhoBloco+2); 
        jogador.y = (tamanhoBloco+2);
        jogador.currentPos = jogador.pos1;
        
        // reinicia a posição do inimigo
        //enemy1.x = (tamanhoBloco+2)*8; 
        //enemy1.y = (tamanhoBloco+2)*8;
        // reinicia o estado do inimigo
        //estado = 1;
    }

    function reiniciarJogo(){
        // aqui você pode redefinir todas as variáveis necessárias para reiniciar o jogo
        

        // reinicia a posição do jogador
        jogador.x = (tamanhoBloco+2); 
        jogador.y = (tamanhoBloco+2);
        jogador.currentPos = jogador.pos1;
        
        // reinicia a posição do inimigo
        enemy1.x = (tamanhoBloco+2)*8; 
        enemy1.y = (tamanhoBloco+2)*8;
        vidas = valorVidas;
        // reinicia o estado do inimigo
        estado = 1;
    }

    function verificarSaidaLabirinto(jogador) {
        var finalX = 20 * tamanhoBloco;
        var finalY = 15 * tamanhoBloco;
        if (jogador.x + jogador.width > finalX && jogador.y + jogador.height > finalY) {
          alert("Ganhou!");
        }
      }

    for(var i in maze){
        for(var j in maze[i]){

            var tile = maze[i][j];

            if(tile === 1){

                var wall = {

                    x: tamanhoBloco*j,
                    y: tamanhoBloco*i,
                    width: tamanhoBloco,
                    height: tamanhoBloco

                };

                walls.push(wall);
            }
        }
    }

    function blockRectangle(objA, objB){
        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2) //CENTRO DOS OBJETOS
        var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2) //CENTRO DOS OBJETOS
   
        var sumWidth = (objA.width+objB.width)/2
        var sumHeight = (objA.height+objB.height)/2

        if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){

            var overlapX = sumWidth - Math.abs(distX);
            var overlapY = sumHeight - Math.abs(distY);

            if(overlapX > overlapY){
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
            } else {
                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
            }
        }
    }


    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e){

        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = true;
                break;
           
            case UP:
                mvUp = true;
                break;            

            case RIGTH:
                mvRigth = true;
                break;

            case DOWN:
                mvDown = true;
                break;  

        }

    }

    function keyupHandler(e){

        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = false;
                break;
           
            case UP:
                mvUp = false;
                break;            

            case RIGTH:
                mvRigth = false;
                break;

            case DOWN:
                mvDown = false;
                break;  

        }

    }

    function gameOver() {
        if (vidas <=0) {
            ctx.font = "60px Arial";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("Fim de jogo !", WIDTH/2 - 150, HEIGHT/2);  

            setTimeout(reiniciarJogo, tempoReiniciar)
             
        }
     
    }

    function estadoAlerta() {
        if (contPixelAvanco > limiteAvanco*2) { //CORREU O DOBRO - PERSEGUIÇÇÃO
            return true
        } else if (contPixelAvanco > limiteAvanco) {         // ENTRE O LIMITE E O DOBRO  -- FUZZY!!

            var probabilidade = Math.random();

            var calc = 2*(1-(limiteAvanco/contPixelAvanco));

            if (calc>probabilidade) {
                return true
            }
        }

        return false
    }


    function update(){

        //movimentação jogador
        if(mvLeft && !mvRigth){
            jogador.x -= jogador.speed;
            contPixelAvanco += jogador.speed;
        } else 
        if(mvRigth && !mvLeft){
            jogador.x += jogador.speed;
            contPixelAvanco += jogador.speed;
        }

        if (mvUp && !mvDown){
            jogador.y -= jogador.speed;
            contPixelAvanco += jogador.speed;
        } else if (mvDown && !mvUp){
            jogador.y += jogador.speed;
            contPixelAvanco += jogador.speed;
        } 

        


        for(var i in walls) {
            var wall = walls[i];
            blockRectangle(jogador, wall);

        }

        for(var i in walls) {
            var wall = walls[i];
            blockRectangle(enemy1, wall);

        }

        acabouOjogo = false
        if (intersects(enemy1,jogador)){
            //window.location.reload(true);
            reiniciarJogador()
            decrementLives()
            
        }



        verificarSaidaLabirinto(jogador)
        
        

    }

    setTimeout(estadoAlerta, tempoAtualizarAlerta)

    function avancouAlerta() {
        if (contPixelAvanco > limiteAvanco) { 
            return true
        }

        return false
    }

    function atualizarContPixelAvanco() {
        contPixelAvanco = 0;
        setTimeout(atualizarContPixelAvanco, tempoAtualizarAlerta);
    }
    
    atualizarContPixelAvanco();
      

    function drawLives(){
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px Arial';
        ctx.fillText("Vidas: "+vidas, 20, 30);
    }

    function drawPixels(){
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px Arial';
        ctx.fillText("Pixel andados: "+contPixelAvanco, 450, 30);
    }

    function decrementLives(){
        vidas--;
    }

    function drawMaze() {
        for (var i = 0; i < maze.length; i++) {
          for (var j = 0; j < maze[i].length; j++) {
                var x = j * tamanhoBloco;
                var y = i * tamanhoBloco;
               
                if (maze[i][j] == 1) {
                    ctx.fillStyle = "#222";
                    ctx.fillRect(x, y, tamanhoBloco, tamanhoBloco);
                    
                    if (mazeState == "piscando") { // se o estado do labirinto for "piscando"
                            ctx.fillStyle = "#861414";
                            ctx.fillRect(x, y, tamanhoBloco, tamanhoBloco);
                        
                    } 

                    if (mazeState == "alerta") { // se o estado do labirinto for "alerta"
                        ctx.fillStyle = "#DDEA00";
                        ctx.fillRect(x, y, tamanhoBloco, tamanhoBloco);
                    } 


                } else {
                    ctx.fillStyle = "#888";
                    ctx.fillRect(x, y, tamanhoBloco, tamanhoBloco);
                }
          }
        }
    }



    function render(){
      
        ctx.clearRect(0,0, WIDTH, HEIGHT)
        ctx.save(); //salvar contexto


        checkDistance();
        drawMaze()
        drawPixels()
        enemy1.draw()
        jogador.draw()
        drawLives()
        gameOver()


        

        ctx.restore(); //RESTAURAR CONTEXTO
    }

    function intersects(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    var mazeState = "normal"; // estado inicial do labirinto

    function checkDistance() {
        var dx = jogador.x - enemy1.x;
        var dy = jogador.y - enemy1.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < distanciaPersegui) {
          mazeState = "piscando"; // alterna para o estado "piscando" se o jogador estiver perto do inimigo
        } else if (avancouAlerta()) {
            mazeState = "alerta";
        }  else {
          mazeState = "normal"; // volta ao estado "normal" se o jogador estiver longe do inimigo
        }
    }



	function loop(){
		update();
		render();
        

		requestAnimationFrame(loop,cnv);
        

	}
	
	requestAnimationFrame(loop,cnv);
}());
