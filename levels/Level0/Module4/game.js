const GAME_MODE_OPEN = 0
const GAME_MODE_ROAM = 1
const GAME_MODE_GHOST_APPEAR = 2
const GAME_MODE_QUESTION_ANSWER = 3
const GAME_MODE_QUESTION_RIGHT = 4
const GAME_MODE_QUESTION_WRONG = 5
const GAME_MODE_GHOST_DYING = 6
const GAME_MODE_CLICK_TO_CONT = 7
const GAME_MODE_INSTRUCTIONS = 8
const GAME_MODE_DEBUG = 9
const GAME_MODE_END = 10

const LESS_THAN_OP = 0;
const GREATER_THAN_OP = 1;
const LESS_THAN_EQ_OP = 2;
const GREATER_THAN_EQ_OP = 3;
const EQUAL_TO_OP = 4;
const NOT_EQUAL_OP = 5;

const TOTAL_OPS = 6;
const OPS_STR = [
    "<", ">", "<=", ">=", "==", "!="
];

class Question {
    correctAnswer;
    string;
};

var totalLevels = 10;
var totalGameTime = 0;

var currentGameMode = GAME_MODE_OPEN;

var currentQuestion;
var currentLevel;

var canvas;
var gl;

var textCanvas;
var textCtx;
var textSize;

var buttonDiv;
var codeDiv;

var trueButton;
var falseButton;

var startGameButton;
var howToPlayButton;

var gameCamera;
var gameLight = new Vector3(0, 5, 0);
var playerStartPosition;

var ghostEnabled = [];
var staticMeshes = [];
var animatedMeshes = [];
var particleEmitters = [];

var workStations = [];
var doors = [];

var collisionBoxes = [];
var boxMesh;

var starTime = 0;
var endTime = 0;
var deltaTime = 0;

var paused = false;

var ghostParticleEmitter;
var hitParticleEmitter;

var wordSpaceTexture;
var ghostStartPos;
var ghostRelocatePos;
var ghostMesh;

var gameStarted = false;
var gameOver = false;
var transitionToNextGhost = false;
var ghostSwoop = false;
var ghostShrink = false;
var swoopTime = 0;

var terrainMesh;

var mousePosition = new Vector2();
var lastMoustPosition = new Vector2();
var mouseDelta = new Vector2(0, 0);

var playerPosition = new Vector2(0, 0);
var playerVelocity = new Vector2(0, 0);

var cameraLockPosition;

var spaceDown = false;
var spaceTracker = true;
var ghostHealth;
var ghostsKilled = 0;

var wallTexture;
var doorTexture;

var msh;

var ghostLaughing = false;
var laughTimer = 0;

var startTime;

var titleTexture;

window.onload = function(){
    buttonDiv = document.getElementById("buttonDivID");
    canvas = document.getElementById("canvasID");
    textCanvas = document.getElementById("textCanvasID");
    textCtx = textCanvas.getContext("2d");

    window.addEventListener("resize", windowResize);
    window.addEventListener("mousedown", mousePressed);
    window.addEventListener("mousemove", mouseMoved);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    buttonDiv.style.position = 'absolute';
    canvas.style.position = 'absolute';
    canvas.style.border = 'solid';
    canvas.style.cursor = 'pointer';
    textCanvas.style.position = 'absolute';
    textCanvas.style.cursor = 'pointer';

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;


    trueButton = document.createElement('button');
    trueButton.onclick = trueButtonClicked;
    trueButton.innerHTML = "TRUE";
    trueButton.style.fontSize = '52';
    trueButton.style.border = 'solid';
    trueButton.style.borderRadius = "12px";
    trueButton.style.backgroundColor = "#FFBB00";
    falseButton = document.createElement('button');
    falseButton.onclick = falseButtonClicked;
    falseButton.innerHTML = "FALSE";
    falseButton.style.fontSize = '52';
    falseButton.style.border = 'solid';
    falseButton.style.borderRadius = "12px";
    falseButton.style.backgroundColor = "#FFBB00";
    buttonDiv.style.display = "none";

    startGameButton = document.createElement('button');
    startGameButton.onclick = startGameButtonClicked;
    startGameButton.innerHTML = "START GAME";
    startGameButton.style.fontSize = '52';
    startGameButton.style.border = 'solid';
    startGameButton.style.borderRadius = "12px";
    startGameButton.style.backgroundColor = "#FFBB00";

    howToPlayButton = document.createElement('button');
    howToPlayButton.onclick = howToPlayButtonClicked;
    howToPlayButton.innerHTML = "HOW TO PLAY";
    howToPlayButton.style.fontSize = '52';
    howToPlayButton.style.border = 'solid';
    howToPlayButton.style.borderRadius = "12px";
    howToPlayButton.style.backgroundColor = "#FFBB00";

    buttonDiv.appendChild(howToPlayButton);
    buttonDiv.appendChild(startGameButton);

    windowResize();    

    textCtx.font = "50px Arial";
    textCtx.fillText("LOADING...", 100, 100);

    gl = canvas.getContext('webgl2');
    gl.clearColor(1, 1, 1, 1);  
    gl.enable(gl.DEPTH_TEST); 
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gameCamera = new Camera();

    gameCamera.setPerspectiveProjection(70.0, canvas.width / canvas.height, 0.001, 1000.0);
    gameCamera.position = new Vector3(7, 5, 10);
    gameCamera.moveSpeed = 10;
    gameCamera.updateView();
    playerPosition = new Vector2(gameCamera.position.x, gameCamera.position.z);
    playerStartPosition = new Vector3(gameCamera.position.x, gameCamera.position.y, gameCamera.position.z);

    initCanvasRenderer(canvas.width, canvas.height);
    initSkyboxRenderer();
    initTexturedMeshRenderer();
    initAnimatedTexturedMeshRenderer();
    initParticleRenderer();

    loadSkyboxFaceImage(skyboxTextureData[0], 256, 256, "+x");
    loadSkyboxFaceImage(skyboxTextureData[1], 256, 256, "-x");
    loadSkyboxFaceImage(skyboxTextureData[2], 256, 256, "+y");
    loadSkyboxFaceImage(skyboxTextureData[3], 256, 256, "-y");
    loadSkyboxFaceImage(skyboxTextureData[4], 256, 256, "+z");
    loadSkyboxFaceImage(skyboxTextureData[5], 256, 256, "-z");

    let wallColor = [225, 225, 255, 255];
    wallTexture = generateGLTexture2D(wallColor, 1, 1, "linear");
    wallColor = [255, 100, 100, 255];
    doorTexture = generateGLTexture2D(wallColor, 1, 1, "linear");

    titleTexture = generateGLTexture2D(titleImageData, 957, 751, "linear");

    
    msh = createTexturedMesh(workStationMeshData[0], workStationMeshData[1]);
    msh.textureID = generateGLTexture2D(workStationTextureData, 1024, 1024, "linear");
    msh.position = new Vector3(0, 0, -5);
    msh.scale = new Vector3(1.25, 1.25, 1.25);
    msh.orientation.rotate(new Vector3(0, 1, 0), Math.PI);
    msh.orientation.rotate(new Vector3(1, 0, 0), -Math.PI * 0.5);
    // staticMeshes.push(msh);
    // workStations.push(msh);

    cvs = [];
    cis = [];
    generateUnitCubeVerticesIndexedWithNormalsTexCoords(cvs, cis);
    boxMesh = createTexturedMesh(cvs, cis);
    boxMesh.textureID = wallTexture;

    ghostStartPos = new Vector3(0, 5, 0);
    ghostMesh = createAnimatedTexturedMesh(boo_leanMeshData[0], boo_leanMeshData[1]);
    ghostMesh.textureID = generateGLTexture2D(boo_leanTextureData, 1024, 1024, "linear");
    ghostMesh.position = new Vector3(ghostStartPos.x, ghostStartPos.y, ghostStartPos.z);
    ghostMesh.orientation.rotate(new Vector3(1, 0, 0), -Math.PI * 0.5);
    ghostMesh.animations["idle"] = buildAnimation(boo_leanAnimation["idle"]);
    ghostMesh.currentAnimation = ghostMesh.animations["idle"];
    ghostMesh.color = generateRandomGhostColor();
    animatedMeshes.push(ghostMesh);
    ghostMesh = animatedMeshes[animatedMeshes.length - 1];

    setGhostHealth();

    /////////////////////////////////////////PARTICLES///////////////////////////////////////////////////
    let ghostParticleTex = [];
    for(let i = 0; i < 16; i++){
        for(let j = 0; j < 16; j++){
            let x = 8 - i;
            let y = 8 - j;
            ghostParticleTex.push(1);
            ghostParticleTex.push(1);
            ghostParticleTex.push(1);
            if(Math.sqrt(x * x + y * y) < 8){
                ghostParticleTex.push(Math.random() * 128);
            }else{
                ghostParticleTex.push(0);
            }
            
            
        }
    }
    let ghostPartTex = generateGLTexture2D(ghostParticleTex, 16, 16);
    ghostParticleEmitter = new ParticleEmitter();
    ghostParticleEmitter.position = new Vector3(ghostMesh.position.x, ghostMesh.position.y, ghostMesh.position.z - 0.5);
    ghostParticleEmitter.repeat = true;
    for(let i = 0; i < 32; i++){
        let sc = Math.random() * 0.5;
        ghostParticleEmitter.positions.push(new Vector3(ghostParticleEmitter.position.x + randomFloatInRange(-0.5, 0.5), 
                                                        ghostParticleEmitter.position.y, 
                                                        ghostParticleEmitter.position.z + randomFloatInRange(-0.5, 0.5)));
        ghostParticleEmitter.scales.push(new Vector3(sc, sc, sc));
        ghostParticleEmitter.orientations.push(new Quaternion());
        ghostParticleEmitter.durrations.push(Math.random() + 1);
        ghostParticleEmitter.startDelays.push(Math.random());
        ghostParticleEmitter.velocities.push(new Vector3(0.1 * Math.random() - 0.05, 0.05, 0.1 * Math.random() - 0.05));
    }
    ghostParticleEmitter.updateFunction = function(p, deltaTime){
        for(let i = 0; i < p.positions.length; i++){
            if(p.startDelays[i] > ghostParticleEmitter.totalTime) continue;
            p.positions[i].x += Math.sin((ghostParticleEmitter.totalTime + p.startDelays[i]) * 10) * 0.05;
            p.positions[i].z += Math.sin((ghostParticleEmitter.totalTime - p.startDelays[i]) * 10) * 0.05;
            p.positions[i].y += deltaTime * 5;
            let sv = deltaTime * 0.2;
            p.scales[i].add(new Vector3(sv, sv, sv));
            p.durrations[i] -= deltaTime;
            if(p.durrations[i] <= 0){
                if(p.repeat){
                    p.positions[i].x = p.position.x + randomFloatInRange(-0.5, 0.5);
                    p.positions[i].y = p.position.y;
                    p.positions[i].z = p.position.z + randomFloatInRange(-0.5, 0.5);
                    p.durrations[i] = Math.random() + 1;
                    let sc = Math.random() * 0.5;
                    p.scales[i] = new Vector3(sc, sc, sc);
                }
            }
        }
        if(!p.repeat){
            let st = true;
            for(let i = 0; i < p.durrations.length; i++){
                if(p.durrations[i] > 0){
                    st = false;
                    break;
                }
            }
            if(st){
                p.discard = true;
            }
        }
    };

    ghostParticleEmitter.textureID = ghostPartTex;

    hitParticleEmitter = new ParticleEmitter();
    hitParticleEmitter.position = new Vector3(ghostMesh.position.x, ghostMesh.position.y, ghostMesh.position.z + 0.5);
    hitParticleEmitter.repeat = false;
    for(let i = 0; i < 32; i++){
        let sc = Math.random() * 0.5;
        hitParticleEmitter.positions.push(new Vector3(hitParticleEmitter.position.x + randomFloatInRange(-0.5, 0.5), 
                                                        hitParticleEmitter.position.y, 
                                                        hitParticleEmitter.position.z + randomFloatInRange(-0.5, 0.5)));
        hitParticleEmitter.scales.push(new Vector3(sc, sc, sc));
        hitParticleEmitter.orientations.push(new Quaternion());
        hitParticleEmitter.durrations.push(1);
        hitParticleEmitter.velocities.push(new Vector3(Math.random() - 0.5, 
                                                       Math.random() - 0.5, 
                                                       0.1 * Math.random() - 0.05));
    }
    hitParticleEmitter.updateFunction = function(p, deltaTime){
        for(let i = 0; i < p.positions.length; i++){
            if(p.durrations[i] > 0){
                p.positions[i].add(p.velocities[i]);
                p.velocities[i].y -= 2 * deltaTime;
                let sv = deltaTime * 0.2;
                p.scales[i].add(new Vector3(sv, sv, sv));
                p.durrations[i] -= deltaTime;
            }
            if(!p.repeat){
                let st = true;
                for(let j = 0; j < p.durrations.length; j++){
                    if(p.durrations[j] > 0){
                        st = false;
                        break;
                    }
                }
                if(st){
                    p.discard = true;
                    for(let j = 0; j < p.durrations.length; j++){
                        p.positions[j].x = hitParticleEmitter.position.x + randomFloatInRange(-0.5, 0.5);
                        p.positions[j].y = hitParticleEmitter.position.y;
                        p.positions[j].z = hitParticleEmitter.position.z + randomFloatInRange(-0.5, 0.5);
                        p.velocities[j].x = Math.random() - 0.5;
                        p.velocities[j].y = Math.random() - 0.5;
                        p.velocities[j].z = 0.1 * Math.random() - 0.05;
                        let sc = Math.random() * 0.5;
                        p.scales[j].x = sc;
                        p.scales[j].y = sc;
                        p.scales[j].z = sc;
                        p.durrations[j] = 1;
                    }
                }
            }
        }
    };

    particleEmitters.push(ghostParticleEmitter);
    ghostParticleEmitter =  particleEmitters[particleEmitters.length - 1];
    ghostParticleEmitter.color = new Vector4(ghostMesh.color.x, ghostMesh.color.y, ghostMesh.color.x, ghostMesh.color.w);

    /////////////////////////////////////////PARTICLES///////////////////////////////////////////////////
    currentLevel = 1;
    currentQuestion = generateQuestion(currentLevel);

    wordSpaceTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, wordSpaceTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(wordSpace));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    startTime = new Date().getTime();
    interval = setInterval(updateScreen, 0);
}

function updateScreen(){
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    switch(currentGameMode){
        case GAME_MODE_INSTRUCTIONS :{
            renderQuad(new Vector2(0, 0), new Vector2(canvas.width, canvas.height), new Vector4(0.3, 0.3, 0.3, 0.3), titleTexture);
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            textCtx.font = "50px Arial";
            textCtx.fillText("You must defeat all of the BOO-LEANS to escape!", 50, 100);
            textCtx.fillText("Controls:", 200, 175);
            textCtx.font = "50px Arial";
            textCtx.fillText("W - move forward", 200, 225);
            textCtx.fillText("A - move left", 200, 275);
            textCtx.fillText("S - move back", 200, 325);
            textCtx.fillText("D - move right", 200, 375);
            textCtx.fillText("Move the mouse or use the arrow keys to look around.", 50, 450);
            textCtx.font = "30px Arial";
            textCtx.fillText("When facing a computer, CLICK or press SPACE to reveal a ghost.", 200, 500);
            textCtx.fillText("Click the button or use T and F to anwer the true or false question.", 200, 550);
            textCtx.fillText("Answer all of the questions correctly to vanish the ghost.", 200, 600);
            textCtx.fillText("Click START GAME or press SPACE to begin.", 200, 650);
            if(spacePressed()){
                mousePressed(null);
            }
            break;
        }
        case GAME_MODE_OPEN :{
            renderQuad(new Vector2(0, 0), new Vector2(canvas.width, canvas.height), new Vector4(1, 1, 1, 1), titleTexture);
            break;
        }
        case GAME_MODE_ROAM :{
            gameLight.x = gameCamera.position.x;
            gameLight.z = gameCamera.position.z;
            playerVelocity = new Vector2(0, 0);
            if(gameCamera.moveForward){
                playerVelocity.add(new Vector2(gameCamera.forward.x, gameCamera.forward.z));
            }
            if(gameCamera.moveBack){
                playerVelocity.add(new Vector2(-gameCamera.forward.x, -gameCamera.forward.z));
            }
            if(gameCamera.moveLeft){
                playerVelocity.add(new Vector2(-gameCamera.right.x, -gameCamera.right.z));
            }
            if(gameCamera.moveRight){
                playerVelocity.add(new Vector2(gameCamera.right.x, gameCamera.right.z));
            }
            if(gameCamera.pitchUp){
                if(gameCamera.forward.y < 0.9){
                    gameCamera.orientation.rotate(gameCamera.right, -deltaTime * gameCamera.rotateSpeed);
                }
            }
            if(gameCamera.pitchDown){
                if(gameCamera.forward.y > -0.9){
                    gameCamera.orientation.rotate(gameCamera.right, deltaTime * gameCamera.rotateSpeed);
                }
            }
            if(gameCamera.yawLeft){
                gameCamera.orientation.rotate(new Vector3(0, 1, 0), -deltaTime * gameCamera.rotateSpeed);
            }
            if(gameCamera.yawRight){
                gameCamera.orientation.rotate(new Vector3(0, 1, 0), deltaTime * gameCamera.rotateSpeed);
            }

            if(gameCamera.pitchUp){
                gameCamera.rot
            }
            handleCollisions();
            if(spacePressed()){
                checkForGhostArrival();
            } 
            gameCamera.updateView(deltaTime);
            
            if(gameCamera.position.z < totalLevels * -30 + 15 && !gameOver){
                currentGameMode = GAME_MODE_END;
            }

            updateParticles([ghostParticleEmitter], deltaTime);
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            playerPosition = new Vector2(gameCamera.position.x, gameCamera.position.z);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            totalGameTime += deltaTime;
            break;
        }
        case GAME_MODE_END :{
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderQuad(new Vector2(0, 0), new Vector2(canvas.width, canvas.height), new Vector4(1, 1, 1, 0.25), wordSpaceTexture);
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            textCtx.font = "50px Arial";
            textCtx.fillText("You have succesfully escaped the", 50, 100);
            textCtx.fillText("Boo-leans' haunted labrynth!", 60, 150);
            let div = totalGameTime / 60.0;
            let minutes = Math.floor(div);
            let seconds = (div - minutes) * 60;
            textCtx.fillText("Your time was " + minutes + " minute(s) and " + seconds.toFixed(2) + " seconds.", 60, 200);
            if(!gameOver){
                canvas.style.cursor = "pointer";
                textCanvas.style.cursor = "pointer";
                buttonDiv.removeChild(trueButton);
                buttonDiv.removeChild(falseButton);
                buttonDiv.appendChild(startGameButton);
                buttonDiv.appendChild(howToPlayButton);
                startGameButton.disabled = false;
                howToPlayButton.disabled = false;
                document.exitPointerLock();
                windowResizeWithButtons();
                gameOver = true;
            }else{

            }
            break;
        }
        case GAME_MODE_DEBUG :{
            playerVelocity = new Vector2(0, 0);
            if(gameCamera.moveForward){
                playerVelocity.add(new Vector2(gameCamera.forward.x, gameCamera.forward.z));
            }
            if(gameCamera.moveBack){
                playerVelocity.add(new Vector2(-gameCamera.forward.x, -gameCamera.forward.z));
            }
            if(gameCamera.moveLeft){
                playerVelocity.add(new Vector2(-gameCamera.right.x, -gameCamera.right.z));
            }
            if(gameCamera.moveRight){
                playerVelocity.add(new Vector2(gameCamera.right.x, gameCamera.right.z));
            }
            if(gameCamera.pitchUp){
                gameCamera.orientation.rotate(gameCamera.right, -deltaTime * gameCamera.rotateSpeed);
            }
            if(gameCamera.pitchDown){
                gameCamera.orientation.rotate(gameCamera.right, deltaTime * gameCamera.rotateSpeed);
            }
            if(gameCamera.yawLeft){
                gameCamera.orientation.rotate(new Vector3(0, 1, 0), -deltaTime * gameCamera.rotateSpeed);
            }
            if(gameCamera.yawRight){
                gameCamera.orientation.rotate(new Vector3(0, 1, 0), deltaTime * gameCamera.rotateSpeed);
            }

            if(gameCamera.pitchUp){
                gameCamera.rot
            }
            handleCollisions();
            if(spacePressed()){
                checkForGhostArrival();
            } 
            gameCamera.updateView(deltaTime);
            updateParticles([ghostParticleEmitter], deltaTime);
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            playerPosition = new Vector2(gameCamera.position.x, gameCamera.position.z);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            break;
        }
        case GAME_MODE_GHOST_APPEAR :{
            gameCamera.lookAt(cameraLockPosition, ghostMesh.position, new Vector3(0, 1, 0));
            ghostParticleEmitter.position = ghostMesh.position;
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            updateAnimations(animatedMeshes, deltaTime);
            renderAnimatedTexturedMeshes([ghostMesh], gameCamera, gameLight, deltaTime);
            updateParticles([ghostParticleEmitter], deltaTime);
            renderParticles([ghostParticleEmitter], gameCamera, deltaTime);
            ghostMesh.position.y += deltaTime * 5;
            if(ghostMesh.position.y > 7){
                windowResizeWithButtons();
                trueButton.disabled = false;
                falseButton.disabled = false;
                currentGameMode = GAME_MODE_QUESTION_ANSWER;
                canvas.style.cursor = "pointer";
                textCanvas.style.cursor = "pointer";
                document.exitPointerLock();
            }
            totalGameTime += deltaTime;
            break;
        }
        case GAME_MODE_QUESTION_ANSWER :{  
            gameCamera.lookAt(cameraLockPosition, ghostMesh.position, new Vector3(0, 1, 0));
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            updateAnimations(animatedMeshes, deltaTime);
            renderAnimatedTexturedMeshes([ghostMesh], gameCamera, gameLight, deltaTime);
            updateParticles(particleEmitters, deltaTime);
            renderParticles(particleEmitters, gameCamera, deltaTime);
            renderCanvasItems();
    
            textCtx.font = textSize + "px Arial";
            let qlines = currentQuestion.string.split("\n");
            for(let i = 0; i < qlines.length; i++){
                let tx = (textCanvas.width * 0.5) - ((qlines[i].length * (textSize * 0.4) * 0.5));
                if(i == qlines.length - 1){
                    textCtx.fillText(qlines[i] + "?", tx, textSize * (i + 1));
                }else{
                    textCtx.fillText(qlines[i], tx, textSize * (i + 1));
                }
            }
            totalGameTime += deltaTime;
            break;
        }
        case GAME_MODE_QUESTION_WRONG :{
            //gameCamera.lookAt(cameraLockPosition, ghostMesh.position, new Vector3(0, 1, 0));
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            updateAnimations(animatedMeshes, deltaTime);
            renderAnimatedTexturedMeshes([ghostMesh], gameCamera, gameLight, deltaTime);
            updateParticles([ghostParticleEmitter, hitParticleEmitter], deltaTime);
            renderParticles([ghostParticleEmitter, hitParticleEmitter], gameCamera, deltaTime);
            if(ghostLaughing){
                console.log(laughTimer);
                ghostMesh.position.y -= Math.sin(laughTimer * 2 * Math.PI * 2) * 0.1;
                laughTimer += deltaTime;
                if(laughTimer >= 1.5){
                    laughTimer = 0;
                    ghostMesh.position.y = 7;
                    ghostLaughing = false;
                }
            }else{
                setGhostHealth();
                currentGameMode = GAME_MODE_QUESTION_ANSWER;
            }
            totalGameTime += deltaTime;
            break;
        }
        case GAME_MODE_QUESTION_RIGHT :{
            gameCamera.lookAt(cameraLockPosition, ghostMesh.position, new Vector3(0, 1, 0));
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            updateAnimations(animatedMeshes, deltaTime);
            renderAnimatedTexturedMeshes([ghostMesh], gameCamera, gameLight, deltaTime);
            updateParticles([ghostParticleEmitter, hitParticleEmitter], deltaTime);
            renderParticles([ghostParticleEmitter, hitParticleEmitter], gameCamera, deltaTime);

            trueButton.disabled = false;
            falseButton.disabled = false;
            currentGameMode = GAME_MODE_QUESTION_ANSWER;
            totalGameTime += deltaTime;
            break;
        }
        case GAME_MODE_GHOST_DYING :{
            ghostMesh.position.y -= deltaTime * 5;
            ghostMesh.orientation.rotate(new Vector3(0, 1, 0), deltaTime);

            if(ghostMesh.position.y <= -7){
                ghostMesh.orientation = new Quaternion();
                ghostMesh.orientation.rotate(new Vector3(1, 0, 0), Math.PI);
                currentGameMode = GAME_MODE_CLICK_TO_CONT;
                let d = doors.pop();
                for(let i = 0; i < staticMeshes.length; i++){
                    if(staticMeshes[i] === d){
                        staticMeshes.splice(i, 1);
                        break;
                    }
                }
                if(ghostsKilled < totalLevels){
                    addRoom(ghostsKilled * 30);
                }
            }

            gameCamera.lookAt(cameraLockPosition, ghostMesh.position, new Vector3(0, 1, 0));
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            updateAnimations(animatedMeshes, deltaTime);
            renderAnimatedTexturedMeshes([ghostMesh], gameCamera, gameLight, deltaTime);
            updateParticles([ghostParticleEmitter, hitParticleEmitter], deltaTime);
            renderParticles([ghostParticleEmitter, hitParticleEmitter], gameCamera, deltaTime);
            totalGameTime += deltaTime;
            break;
        }
        case GAME_MODE_CLICK_TO_CONT :{
            gameCamera.lookAt(cameraLockPosition, Vector3.add(cameraLockPosition, gameCamera.forward), new Vector3(0, 1, 0));
            renderSkybox(gameCamera.projectionMatrix, gameCamera.orientation);
            renderTexturedMeshes(staticMeshes, gameCamera, gameLight);
            textCtx.font = "50px Arial";
            textCtx.fillStyle = "white";
            textCtx.fillText("Click anywhere or press SPACE to continue", 100, 50);
            if(spacePressed()){
                
                mousePressed(null);
            }
            totalGameTime += deltaTime;
            break;
        }
    }
    
    endTime = new Date().getTime();
    deltaTime = (endTime - startTime) / 1000.0;
    startTime = endTime;
}

function renderCanvasItems(){
    renderQuad(new Vector2(0, canvas.height - canvas.height / 4), new Vector2(canvas.width, canvas.height / 4), new Vector4(1, 1, 1, 0.25), wordSpaceTexture);
}

function handleCollisions(){
    let npos = Vector2.add(new Vector2(gameCamera.position.x, gameCamera.position.z), Vector2.scale(playerVelocity, deltaTime * gameCamera.moveSpeed));
    if(currentGameMode == GAME_MODE_DEBUG){
        gameCamera.position.x = npos.x;
        gameCamera.position.z = npos.y;
        return;
    }
    
    for(let i = 0; i < collisionBoxes.length; i++){
        let hsx = collisionBoxes[i].scale.x / 2 + 1;
        let hsz = collisionBoxes[i].scale.z / 2 + 1;
        let xmin = collisionBoxes[i].position.x - hsx;
        let xmax = collisionBoxes[i].position.x + hsx;
        let zmin = collisionBoxes[i].position.z - hsz;
        let zmax = collisionBoxes[i].position.z + hsz;
        if(npos.x < xmin || npos.x > xmax
        || npos.y < zmin || npos.y > zmax){
            continue;
        }else{
            if(playerVelocity.x > 0 && gameCamera.position.x < xmin){
                playerVelocity.x = 0;
                npos.x = xmin - 0.01;
            }
            else if(playerVelocity.x < 0 && gameCamera.position.x > xmax){
                playerVelocity.x = 0;
                npos.x = xmax + 0.01;
            }
            if(playerVelocity.y > 0 && gameCamera.position.z < zmin){
                playerVelocity.y = 0;
                npos.y = zmin - 0.01;
            }
            else if(playerVelocity.y < 0 && gameCamera.position.z > zmax){
                playerVelocity.y = 0;
                npos.y = zmax + 0.01;
            }
        } 
    }

    for(let i = 0; i < doors.length; i++){
        let hsx = doors[i].scale.x / 2 + 1;
        let hsz = doors[i].scale.z / 2 + 1;
        let xmin = doors[i].position.x - hsx;
        let xmax = doors[i].position.x + hsx;
        let zmin = doors[i].position.z - hsz;
        let zmax = doors[i].position.z + hsz;
        if(npos.x < xmin || npos.x > xmax
        || npos.y < zmin || npos.y > zmax){
            continue;
        }else{
            if(playerVelocity.x > 0 && gameCamera.position.x < xmin){
                playerVelocity.x = 0;
                npos.x = xmin - 0.01;
            }
            else if(playerVelocity.x < 0 && gameCamera.position.x > xmax){
                playerVelocity.x = 0;
                npos.x = xmax + 0.01;
            }
            if(playerVelocity.y > 0 && gameCamera.position.z < zmin){
                playerVelocity.y = 0;
                npos.y = zmin - 0.01;
            }
            else if(playerVelocity.y < 0 && gameCamera.position.z > zmax){
                playerVelocity.y = 0;
                npos.y = zmax + 0.01;
            }
        } 
    }

    for(let i = 0; i < workStations.length; i++){
        let hsx = workStations[i].scale.x / 2 + 3;
        let hsz = workStations[i].scale.z / 2 + 3;
        let xmin = workStations[i].position.x - hsx;
        let xmax = workStations[i].position.x + hsx;
        let zmin = workStations[i].position.z - hsz;
        let zmax = workStations[i].position.z + hsz;
        if(npos.x < xmin || npos.x > xmax
        || npos.y < zmin || npos.y > zmax){
            continue;
        }else{
            if(playerVelocity.x > 0 && gameCamera.position.x < xmin){
                playerVelocity.x = 0;
                npos.x = xmin - 0.01;
            }
            else if(playerVelocity.x < 0 && gameCamera.position.x > xmax){
                playerVelocity.x = 0;
                npos.x = xmax + 0.01;
            }
            if(playerVelocity.y > 0 && gameCamera.position.z < zmin){
                playerVelocity.y = 0;
                npos.y = zmin - 0.01;
            }
            else if(playerVelocity.y < 0 && gameCamera.position.z > zmax){
                playerVelocity.y = 0;
                npos.y = zmax + 0.01;
            }
        } 
    }
    gameCamera.position.x = npos.x;
    gameCamera.position.z = npos.y;
}

function checkForGhostArrival(){
    for(let i = 0; i < workStations.length; i++){
        if(!ghostEnabled[i]){
            continue;
        }
        let pos = workStations[i].position;
        let spos = Vector3.add(gameCamera.position, gameCamera.forward);
        let len = Vector3.length(Vector3.sub(pos, spos));
        if(len < 8){
            ghostMesh.orientation = new Quaternion();
            let ss = Vector3.sub(pos, gameCamera.position);
            let dd = (Vector3.dot(new Vector3(0, 0, 1), Vector3.normal(new Vector3(ss.x, 0, ss.z))) + 1) * 0.5;
            if(gameCamera.position.x > pos.x){
                ghostMesh.orientation.rotate(new Vector3(0, 1, 0), dd * Math.PI);
            }else{
                ghostMesh.orientation.rotate(new Vector3(0, 1, 0), dd * -Math.PI);
            }
            
            ghostMesh.orientation.rotate(new Vector3(1, 0, 0), -Math.PI * 0.5);
    
            ghostMesh.color = generateRandomGhostColor();
            ghostMesh.position = new Vector3(pos.x, pos.y, pos.z);
            ghostMesh.position.y -= 3;
            ghostParticleEmitter.position = new Vector3(pos.x, pos.y, pos.z);
            currentGameMode = GAME_MODE_GHOST_APPEAR;
            updateParticles([ghostParticleEmitter], 0);
            cameraLockPosition = new Vector3(gameCamera.position.x, gameCamera.position.y, gameCamera.position.z);
            ghostEnabled[i] = false;
            break;
        }
    }
}

function windowResizeWithButtons(){
    buttonDiv.style.display = "block";
    buttonDiv.style.top = window.innerHeight - (window.innerHeight * 0.125)
    buttonDiv.style.width = window.innerWidth * 0.98;
    buttonDiv.style.height = window.innerHeight * 0.96 * 0.125;
    canvas.width = window.innerWidth * 0.98;
    canvas.height = window.innerHeight * 0.96 * 0.875;
    textCanvas.width = window.innerWidth * 0.98;
    textCanvas.height = window.innerHeight * 0.96 * 0.875;
    trueButton.style.width = canvas.width * 0.5;
    trueButton.style.height = buttonDiv.style.height;
    falseButton.style.width = canvas.width * 0.5;
    falseButton.style.height = buttonDiv.style.height;
    if(gl != null){
        gl.viewport(canvas.style.left, canvas.style.bottom, canvas.width, canvas.height);
    }
}

function addRoom(offset){
    msh = TexturedMesh.copy(msh);
    msh.position = new Vector3(0, 0, -5 - offset);
    msh.scale = new Vector3(1.25, 1.25, 1.25);
    staticMeshes.push(msh);
    workStations.push(msh);

    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.textureID = wallTexture;
    boxMesh.position = new Vector3(-10, 5, 0 - offset);
    boxMesh.scale = new Vector3(1, 10, 30);
    collisionBoxes.push(boxMesh);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    
    boxMesh.position = new Vector3(10, 5, 0 - offset);
    boxMesh.scale = new Vector3(1, 10, 30);
    collisionBoxes.push(boxMesh);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(0, -0.5, 0 - offset);
    boxMesh.scale = new Vector3(20, 1, 30);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(0, 10.5, 0 - offset);
    boxMesh.scale = new Vector3(20, 1, 30);
    staticMeshes.push(boxMesh);

    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(-7.5, 5, -15 - offset);
    boxMesh.scale = new Vector3(5, 10, 1);
    collisionBoxes.push(boxMesh);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(5, 5, -15 - offset);
    boxMesh.scale = new Vector3(9, 10, 1);
    collisionBoxes.push(boxMesh);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(-7.5, 5, 15 - offset);
    boxMesh.scale = new Vector3(5, 10, 1);
    collisionBoxes.push(boxMesh);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(5, 5, 15 - offset);
    boxMesh.scale = new Vector3(9, 10, 1);
    collisionBoxes.push(boxMesh);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(-2.25, 9, -15 - offset);
    boxMesh.scale = new Vector3(5.5, 3, 1);
    staticMeshes.push(boxMesh);
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.position = new Vector3(-2.25, 9, 15 - offset);
    boxMesh.scale = new Vector3(5.5, 3, 1);
    staticMeshes.push(boxMesh);

    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.textureID = doorTexture;
    boxMesh.position = new Vector3(-2.25, 3.5, -15 - offset);
    boxMesh.scale = new Vector3(5.5, 8, 1);
    staticMeshes.push(boxMesh);
    doors.push(boxMesh);
}

function windowResize(){
    switch(currentGameMode){
        case GAME_MODE_OPEN:{
            buttonDiv.style.display = "block";
            buttonDiv.style.top = window.innerHeight - (window.innerHeight * 0.125)
            buttonDiv.style.width = window.innerWidth * 0.98;
            buttonDiv.style.height = window.innerHeight * 0.96 * 0.125;
            canvas.width = window.innerWidth * 0.98;
            canvas.height = window.innerHeight * 0.96 * 0.875;
            textCanvas.width = window.innerWidth * 0.98;
            textCanvas.height = window.innerHeight * 0.96 * 0.875;
            startGameButton.style.width = canvas.width * 0.5;
            startGameButton.style.height = buttonDiv.style.height;
            howToPlayButton.style.width = canvas.width * 0.5;
            howToPlayButton.style.height = buttonDiv.style.height;
            if(gl != null){
                gl.viewport(canvas.style.left, canvas.style.bottom, canvas.width, canvas.height);
            }
            break;
        }
        default:{
            buttonDiv.style.display = "none";
            buttonDiv.style.top = window.innerHeight - (window.innerHeight * 0.125)
            buttonDiv.style.width = window.innerWidth * 0.98;
            buttonDiv.style.height = window.innerHeight * 0.96 * 0.125;
            canvas.width = window.innerWidth * 0.98;
            canvas.height = window.innerHeight * 0.96;
            textCanvas.width = window.innerWidth * 0.98;
            textCanvas.height = window.innerHeight * 0.96;
            if(gl != null){
                gl.viewport(canvas.style.left, canvas.style.bottom, canvas.width, canvas.height);
            }
        };
    }
}

function generateQuestion(level){
    switch(level){
        case 1:{
            textSize = 60;
            let q = new Question();
            let l = Math.floor(Math.random() * 100);
            let r = Math.floor(Math.random() * 100);
            let op = getRandomRelationalOperator();

            q.string = l + " " + op + " " +r;
            q.answer = eval(q.string);
            
            return q;
        }
        case 2:{
            textSize = 40;
            let q = new Question();
            let x = Math.floor(Math.random() * 100);
            let r = Math.floor(Math.random() * 100);
            let op = getRandomRelationalOperator();

            q.string = "x = ";
            q.string += x + ";\n";
            q.string += "x " + op + " " + r;
            q.answer = eval(q.string);
            
            return q;
        }
        case 3:{
            textSize = 40;
            let q = new Question();
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let op = getRandomRelationalOperator();

            q.string = "x = ";
            q.string += x + ";\n";
            q.string += "y = ";
            q.string += y + ";\n";
            q.string += "x " + op + " y";
            q.answer = eval(q.string);
            
            return q;
        }
        case 4:{
            textSize = 35;
            let q = new Question();
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let z = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomLogicalOperator();

            q.string = "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "(x " + op1 + " y) " + op3 + " (y " + op2 + " " + z +")";
            q.answer = eval(q.string);
            
            return q;
        }
        case 5:{
            textSize = 35;
            let q = new Question();
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomLogicalOperator();

            q.string = "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "(x " + op1 + " y) " + op3 + " (y " + op2 + " x)";
            q.answer = eval(q.string);
            
            return q;
        }
        case 6:{
            textSize = 35;
            let q = new Question();
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let z = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomLogicalOperator();

            q.string = "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "z = " + z + ";\n";
            q.string += "(x " + op1 + " y) " + op3 + " (x " + op2 + " z)";
            q.answer = eval(q.string);
            
            return q;
        }
        case 7:{
            textSize = 30;
            let q = new Question();
            let w = Math.floor(Math.random() * 100);
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let z = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomLogicalOperator();

            let arr = ["w", "x", "y", "z"];
            shuffleArray(arr);

            q.string = "w = " + w + ";\n";
            q.string += "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "z = " + z + ";\n";
            q.string += "(" + arr[0] + " " + op1 + " " + arr[1] + ") " + op3 + " (" + arr[2] + " " + op2 + " " + arr[3] + ")";
            q.answer = eval(q.string);

            return q;
        }
        case 8:{
            textSize = 25;
            let q = new Question();
            let w = Math.floor(Math.random() * 100);
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let z = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomRelationalOperator();
            let lop1 = getRandomLogicalOperator();
            let lop2 = getRandomLogicalOperator();

            let arr = ["w", "x", "y", "z"];
            shuffleArray(arr);

            q.string = "w = " + w + ";\n";
            q.string += "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "z = " + z + ";\n";
            q.string += "((" + arr[0] + " " + op1 + " " + arr[1] + ") " + lop1 + " (" + arr[2] + " " + op2 + " " + arr[3] + ")) " 
                             + lop2 + " (" +  arr[0] + " " + op3 + " " + arr[3] + ")";
            q.answer = eval(q.string);

            return q;
        }
        case 9:{
            textSize = 20;
            let q = new Question();
            let w = Math.floor(Math.random() * 100);
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let z = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomRelationalOperator();
            let op4 = getRandomRelationalOperator();
            let lop1 = getRandomLogicalOperator();
            let lop2 = getRandomLogicalOperator();
            let lop3 = getRandomLogicalOperator();

            let arr = ["w", "x", "y", "z"];
            shuffleArray(arr);

            q.string = "w = " + w + ";\n";
            q.string += "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "z = " + z + ";\n";
            q.string += "((" + arr[0] + " " + op1 + " " + arr[1] + ") " + lop1 + " (" + arr[2] + " " + op2 + " " + arr[3] + ")) " 
               + lop2 + " ((" + arr[2] + " " + op3 + " " + arr[1] + ") " + lop3 + " (" + arr[3] + " " + op4 + " " + arr[0] + ")) "
            q.answer = eval(q.string);

            return q;
        }
        case 10:{
            textSize = 20;
            let q = new Question();
            let w = Math.floor(Math.random() * 100);
            let x = Math.floor(Math.random() * 100);
            let y = Math.floor(Math.random() * 100);
            let z = Math.floor(Math.random() * 100);
            let op1 = getRandomRelationalOperator();
            let op2 = getRandomRelationalOperator();
            let op3 = getRandomRelationalOperator();
            let op4 = getRandomRelationalOperator();
            let lop1 = getRandomLogicalOperator();
            let lop2 = getRandomLogicalOperator();
            let lop3 = getRandomLogicalOperator();
            let lop4 = getRandomLogicalOperator();
            let lop5 = getRandomLogicalOperator();
            let tf1 = Math.random() < 0.5 ? "true" : "false";
            let tf2 = Math.random() < 0.5 ? "true" : "false";

            let arr = ["w", "x", "y", "z"];
            shuffleArray(arr);

            q.string = "w = " + w + ";\n";
            q.string += "x = " + x + ";\n";
            q.string += "y = " + y + ";\n";
            q.string += "z = " + z + ";\n";
            q.string += "(((" + arr[0] + " " + op1 + " " + arr[1] + ") " + lop1 + " (" + arr[2] + " " + op2 + " " + arr[3] + ")) " + lop4 + " " + tf1 + ") "
               + lop2 + " (((" + arr[2] + " " + op3 + " " + arr[1] + ") " + lop3 + " (" + arr[3] + " " + op4 + " " + arr[0] + ")) " + lop5 + " " + tf2 + ") "
            q.answer = eval(q.string);

            return q;
        }
        default:{
            return generateQuestion(1);
        }

    }
}

function shuffleArray(arr){
    let l = arr.length;
    for(let i = 0; i < l; i++){
        let rnd = Math.floor(Math.random() * (l - i)) + i;
        let tmp = arr[i];
        arr[i] = arr[rnd];
        arr[rnd] = tmp;
    }
}

function getRandomLogicalOperator(){
    return Math.random() < 0.5 ? "&&" : "||";
}

function getRandomRelationalOperator(){
    return OPS_STR[Math.floor(Math.random() * TOTAL_OPS)];
}

function checkAnswer(actual, correct){
    if(actual == correct){
        currentLevel++;
        hitParticleEmitter.position = new Vector3(ghostMesh.position.x, ghostMesh.position.y, ghostMesh.position.z);
        ghostHealth -= 1;
        trueButton.disabled = true;
        falseButton.disabled = true;
        particleEmitters = [ghostParticleEmitter, hitParticleEmitter];

        if(ghostHealth <= 0){
            buttonDiv.style.display = "none";
            windowResize();
            ghostsKilled += 1;
            setGhostHealth();
            currentLevel = 1;
            currentGameMode = GAME_MODE_GHOST_DYING;
        }else{
            currentGameMode = GAME_MODE_QUESTION_RIGHT;
        }
    }else{
        currentLevel = 1;
        currentGameMode = GAME_MODE_QUESTION_WRONG;
        ghostLaughing = true;
    }
    currentQuestion = generateQuestion(currentLevel);
}

function trueButtonClicked(){
    checkAnswer(true, currentQuestion.answer);
}

function falseButtonClicked(){
    checkAnswer(false, currentQuestion.answer);
}

function startGameButtonClicked(){
    staticMeshes = [];
    doors = [];
    collisionBoxes = [];
    workStations = [];
    boxMesh = TexturedMesh.copy(boxMesh);
    boxMesh.textureID = doorTexture;
    boxMesh.position = new Vector3(-2.25, 3.5, 15);
    boxMesh.scale = new Vector3(5.5, 8, 1);
    staticMeshes.push(boxMesh);
    doors.push(boxMesh);
    addRoom(0);
    gameOver = false;
    

    ghostEnabled = [];
    for(let i = 0; i < totalLevels; i++){
        ghostEnabled.push(true);
    }
    totalGameTime = 0;
    ghostsKilled = 0;
    currentLevel = 1;
    setGhostHealth();
    currentGameMode = GAME_MODE_ROAM;
    gameCamera.position = new Vector3(playerStartPosition.x, playerStartPosition.y, playerStartPosition.z);
    gameStarted = true;
    buttonDiv.removeChild(startGameButton);
    buttonDiv.removeChild(howToPlayButton);
    buttonDiv.appendChild(trueButton);
    buttonDiv.appendChild(falseButton);
    windowResize();
    canvas.requestPointerLock();
}

function howToPlayButtonClicked(){
    currentGameMode = GAME_MODE_INSTRUCTIONS;
}

function generateRandomGhostColor(){
    return new Vector4(Math.random(),
                       Math.random(),
                       Math.random(),
                       (Math.random() * 0.5) + 0.5);
}

function spacePressed(){
    if(spaceDown && spaceTracker){
        spaceTracker = false;
        return true;
    }else if(!spaceDown){
        spaceTracker = true;
    }
    return false;
}


var bk = false;
var gk = false;
function keyUp(event){ 
    switch(event.keyCode){
        case KEY_W:{
            gameCamera.moveForward = false;
            break;
        }
        case KEY_A:{
            gameCamera.moveLeft = false;
            break;
        }
        case KEY_B:{
            bk = false;
            break;
        }
        case KEY_S:{
            gameCamera.moveBack = false;
            break;
        }
        case KEY_D:{
            gameCamera.moveRight = false;
            break;
        }
        case KEY_G:{
            gk = false;
            break;
        }
        case KEY_R:{
            //gameCamera.moveUp = false;
            break;
        }
        case KEY_F:{
            //gameCamera.moveDown = false;
            break;
        }
        case KEY_UP:{
            gameCamera.pitchUp = false;
            break;
        }
        case KEY_DOWN:{
            gameCamera.pitchDown = false;
            break;
        }
        case KEY_LEFT:{
            gameCamera.yawLeft = false;
            break;
        }
        case KEY_RIGHT:{
            gameCamera.yawRight = false;
            break;
        }
        case KEY_Q:{
            gameCamera.rollLeft = false;
            break;
        }
        case KEY_E:{
            gameCamera.rollRight = false;
            break;
        }
        case KEY_SPACE:{
            spaceDown = false;
            break;
        }
    }
}


function keyDown(event){
    switch(event.keyCode){
        case KEY_W:{
            gameCamera.moveForward = true;
            break;
        }
        case KEY_A:{
            gameCamera.moveLeft = true;
            break;
        }
        case KEY_B:{
            bk = true;
            break;
        }
        case KEY_G:{
            gk = true;
            break;
        }
        case KEY_U:{
            if(bk && gk){
                if(currentGameMode == GAME_MODE_ROAM){
                    currentGameMode = GAME_MODE_DEBUG;
                }else if(currentGameMode == GAME_MODE_DEBUG){
                    currentGameMode = GAME_MODE_ROAM;
                }
            }
            break;
        }
        case KEY_S:{
            gameCamera.moveBack = true;
            break;
        }
        case KEY_D:{
            gameCamera.moveRight = true;
            break;
        }
        case KEY_R:{
            //gameCamera.moveUp = true;
            break;
        }
        case KEY_T:{
            if(currentGameMode == GAME_MODE_QUESTION_ANSWER){
                checkAnswer(true, currentQuestion.answer)
            }
            break;
        }
        case KEY_F:{
            if(currentGameMode == GAME_MODE_QUESTION_ANSWER){
                checkAnswer(false, currentQuestion.answer)
            }
            break;
        }
        case KEY_UP:{
            gameCamera.pitchUp = true;
            break;
        }
        case KEY_DOWN:{
            gameCamera.pitchDown = true;
            break;
        }
        case KEY_LEFT:{
            gameCamera.yawLeft = true;
            break;
        }
        case KEY_RIGHT:{
            gameCamera.yawRight = true;
            break;
        }
        case KEY_Q:{
            gameCamera.rollLeft = true;
            break;
        }
        case KEY_E:{
            gameCamera.rollRight = true;
            break;
        }
        case KEY_SPACE:{
            if(currentGameMode == GAME_MODE_OPEN || currentGameMode == GAME_MODE_INSTRUCTIONS || currentGameMode == GAME_MODE_END){
                startGameButtonClicked();
            }
            spaceDown = true;
            break;
        }
        case KEY_P:{
            paused = !paused;
        }
    }
}

function mousePressed(event){
    if(currentGameMode == GAME_MODE_ROAM){
        checkForGhostArrival();
    }
    else if(currentGameMode == GAME_MODE_OPEN){
        
    }
    else if(currentGameMode == GAME_MODE_CLICK_TO_CONT){
        canvas.style.cursor = "none";
        textCanvas.style.cursor = "none";
        currentGameMode = GAME_MODE_ROAM;
        gameCamera.position = cameraLockPosition;
        canvas.requestPointerLock();
    }
}

function mouseMoved(event){
    if(currentGameMode == GAME_MODE_ROAM || currentGameMode == GAME_MODE_DEBUG){
        mousePosition = Vector2.add(mousePosition, new Vector2(event.movementX, event.movementY));
        mouseDelta = new Vector2(mousePosition.x - lastMoustPosition.x, mousePosition.y - lastMoustPosition.y);
        lastMoustPosition = new Vector2(mousePosition.x, mousePosition.y);
        let nr = new Vector3(gameCamera.right.x, 0, gameCamera.right.z);
        nr.normalize();

        let ang = deltaTime * gameCamera.rotateSpeed * mouseDelta.y * gameCamera.mouseSensitivity;
        gameCamera.orientation.rotate(gameCamera.forward, Vector3.dot(nr, gameCamera.up));
        
        if(gameCamera.forward.y > 0.9){
            gameCamera.orientation.rotate(nr, 0.1);
        }else if(gameCamera.forward.y < -0.9){
            gameCamera.orientation.rotate(nr, -0.1);
        }else{
            gameCamera.orientation.rotate(nr, ang);
        }
        
        
        
        gameCamera.orientation.rotate(new Vector3(0, 1, 0), deltaTime * gameCamera.rotateSpeed * mouseDelta.x * gameCamera.mouseSensitivity);
    }
}

function setGhostHealth(){
    ghostHealth = ghostsKilled + 1;
}