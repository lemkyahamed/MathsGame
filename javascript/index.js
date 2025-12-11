
var playing = false;
var score;
var hearts; 
var action;
var timeremaining;
var correctAnswer;
var challengeSolution; 
var challengeApiUrl = "../apicon.php"; // Call API URL


var difficulty;
var maxTime;
var levelSettings = {
    easy: {
        time: 60,
        x_min: 1, 
        x_max: 9,
        y_min: 1,
        y_max: 9
    },
    medium: {
        time: 90,
        x_min: 10, 
        x_max: 25,
        y_min: 2, 
        y_max: 9,
        z_min: 1, 
        z_max: 9
    },
    hard: {
        time: 120,
        x_min: 10,
        x_max: 30,
        y_min: 2, 
        y_max: 9,
        z_min: 1, 
        z_max: 9,
        div_quotient_min: 2,
        div_quotient_max: 10  
    }
};

// Function to start the game 
function startGame() {
    playing = true;
    
    
    score = 0;
    document.getElementById("scorevalue").innerHTML = score;
    
    
    hearts = 3; 
    document.getElementById("heartcount").innerHTML = hearts;
    show("hearts"); 
    show("timeremaining"); 
    timeremaining = maxTime; 
    document.getElementById("timeremainingvalue").innerHTML = timeremaining;
    hide("gameOver");
    
    
    
    startCountdown();
    
    // generate a new Q&A
    generateQA();
}



document.addEventListener("DOMContentLoaded", function() {

    
    const urlParams = new URLSearchParams(window.location.search);
    const difficultyParam = urlParams.get('difficulty');
    
    if (difficultyParam === 'medium') {
        difficulty = 'medium';
    } else if (difficultyParam === 'hard') {
        difficulty = 'hard';
    } else {
        difficulty = 'easy';
    }
    
   
    maxTime = levelSettings[difficulty].time;
    
    document.getElementById("timeremainingvalue").innerHTML = maxTime;
    
    startGame();


    document.getElementById("startreset").onclick = function(){
        
        if (playing == true) {
            stopCountdown();
            show("confirmQuitModal");
        } else {
            window.location.href = "mainmanu.php";
        }
    }


    document.getElementById("confirmQuitYes").onclick = function() {
        window.location.href = "mainmanu.php";
    }

    document.getElementById("confirmQuitNo").onclick = function() {
        hide("confirmQuitModal");
        if (playing == true) {
            startCountdown();
        }
    }


    document.getElementById("closeGameOver").onclick = function() {
        hide("gameOver");
    }

    for(let i=1; i<5; i++){
        document.getElementById("box"+i).onclick = function(){
        if(playing == true){
            if(this.innerHTML == correctAnswer){
                score++;
                document.getElementById("scorevalue").innerHTML = score;
                hide("wrong");
                show("correct");
                setTimeout(function(){
                    hide("correct");   
                }, 1000);
                
                generateQA();
            }else{
                
                stopCountdown(); // <<< TIMER STOPS HERE
                playing = false;
                
                hide("correct");
                hide("wrong"); 
                
                startheartChallenge(); // <<< MODAL STARTS HERE
            }
        }
    }   
    }

    
    document.getElementById("submitChallenge").onclick = function() {
        var playerInput = document.getElementById("challengeInput").value;
        var messageBox = document.getElementById("challengeMessage");
        
        
        if (playerInput == challengeSolution) {
           
            messageBox.innerHTML = "Correct! Life saved. Continuing game...";
            messageBox.style.color = "green";
            
            setTimeout(function() {
                hide("heartChallengeModal");
                playing = true; 
                startCountdown(); // <<< TIMER RESUMES HERE
                generateQA(); // Start a new main quiz question
            }, 1500);
            
        } else {
            
            messageBox.innerHTML = "Wrong answer. You lose a life!";
            messageBox.style.color = "red";
            
          
            setTimeout(failChallenge, 1500); 
        }
    };

});




function startCountdown(){
    action = setInterval(function(){
        timeremaining -= 1;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        if(timeremaining == 0){ 
            stopCountdown();
            show("gameOver");
            
           
            document.getElementById("gameOverContent").innerHTML = `
                <p>Game over!</p>
                <p>Your score is ${score}.</p>
                <p style="font-size:0.6em; color:#7f8c8d;">Saving score...</p>
            `;
            
            // --- CALL THE SAVE FUNCTION HERE ---
            saveScoreToBackend(score, difficulty); 

            hide("timeremaining");
            hide("hearts");
            hide("correct");
            hide("wrong");
            playing = false;
            document.getElementById("startreset").innerHTML = "Main Menu";
        }
    }, 1000);    
}

function stopCountdown(){
    clearInterval(action);   
}

function hide(Id){
    document.getElementById(Id).style.display = "none";   
}


function show(Id){
   
    if (Id === "heartChallengeModal" || Id === "gameOver" || Id === "confirmQuitModal") {
        document.getElementById(Id).style.display = "flex";
    } else {
       
        document.getElementById(Id).style.display = "block";
    }
}


function generateQA(){
    
    let settings = levelSettings[difficulty];
    let questionString = "";

   
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    switch (difficulty) {
        case 'easy': {
            let x = getRandom(settings.x_min, settings.x_max);
            let y = getRandom(settings.y_min, settings.y_max);
            correctAnswer = x * y;
            questionString = x + "x" + y;
            break;
        }
            
        case 'medium': {
            let x = getRandom(settings.x_min, settings.x_max);
            let y = getRandom(settings.y_min, settings.y_max); 
            let z = getRandom(settings.z_min, settings.z_max); 
            let operation = (Math.random() > 0.5) ? '+' : '-';
            
            questionString = `${x} x ${y} ${operation} ${z}`;
            
            if (operation === '+') {
                correctAnswer = (x * y) + z;
            } else {
                correctAnswer = (x * y) - z;
            }
            break;
        }

        case 'hard': {
            let z = getRandom(settings.z_min, settings.z_max); 
            let operation = (Math.random() > 0.5) ? '+' : '-';
            
        
            if (Math.random() > 0.4) {
                
                let x = getRandom(settings.x_min, settings.x_max); 
                let y = getRandom(settings.y_min, settings.y_max); 
                
                questionString = `${x} x ${y} ${operation} ${z}`;
                
                if (operation === '+') {
                    correctAnswer = (x * y) + z;
                } else {
                    correctAnswer = (x * y) - z;
                }
            } else {
                
                let y = getRandom(settings.y_min, settings.y_max); 
                let quotient = getRandom(settings.div_quotient_min, settings.div_quotient_max); 
                let x = y * quotient; 
                
                questionString = `${x} ÷ ${y} ${operation} ${z}`;
                
                if (operation === '+') {
                    correctAnswer = quotient + z;
                } else {
                    correctAnswer = quotient - z;
                }
            }
            break;
        }
    }
    
    document.getElementById("question").innerHTML = questionString;
    
    var correctPosition = 1 + Math.round(3 * Math.random());
    document.getElementById("box" + correctPosition).innerHTML = correctAnswer; 
    

    var answers = [correctAnswer];
    
    for(let i=1; i<5; i++){
        if(i != correctPosition) {
            var wrongAnswer;
            
        
            do {
                
                let offset = getRandom(1, 12);
                
                if (Math.random() > 0.5) {
                    wrongAnswer = correctAnswer + offset;
                } else {
                    wrongAnswer = correctAnswer - offset;
                }

           
                if (wrongAnswer <= 0) {
                    wrongAnswer = correctAnswer + offset + 5; 
                }

            } while(answers.indexOf(wrongAnswer) > -1 || wrongAnswer === correctAnswer) 
            
            document.getElementById("box"+i).innerHTML = wrongAnswer;
            answers.push(wrongAnswer);
        }
    }
}


function startheartChallenge() {
    
    fetch(challengeApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.question && data.solution) {
                challengeSolution = data.solution; 
                
                document.getElementById("challengeImage").src = data.question;
                document.getElementById("challengeMessage").innerHTML = "";
                document.getElementById("challengeInput").value = "";
                
                show("heartChallengeModal"); 
            } else {
                console.error("API failed to return valid challenge data.");
                
                failChallenge();
            }
        })
        .catch(error => {
            console.error('Error fetching challenge data:', error);
           
            console.warn('Using local fallback challenge.');
            
            challengeSolution = "7"; 
            document.getElementById("challengeImage").src = "https://placehold.co/300x150/e8e8e8/a0a0a0?text=Find+the+'7'"; 
            document.getElementById("challengeMessage").innerHTML = "";
            document.getElementById("challengeInput").value = "";
            show("heartChallengeModal");
            
        });
}


function failChallenge() {
    hearts--;
    document.getElementById("heartcount").innerHTML = hearts;
    
    
    hide("heartChallengeModal"); 

   
    if (hearts <= 0) {
        
        stopCountdown(); 
        show("gameOver"); 
        
      
        document.getElementById("gameOverContent").innerHTML = `
            <p>Game over!</p>
            <p>You ran out of lives! </p>
            <p>Your score is ${score}.</p>
            <p style="font-size:0.6em; color:#7f8c8d;">Saving score...</p>
        `;
        
     
        saveScoreToBackend(score, difficulty);

        hide("timeremaining");
        hide("hearts");
        playing = false;
        document.getElementById("startreset").innerHTML = "Main Menu";
    } else {

        playing = true; 
        startCountdown(); 
        generateQA(); 
    }
}


function saveScoreToBackend(finalScore, difficultyLevel) {
   
    fetch('../backend/save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            score: finalScore,
            difficulty: difficultyLevel
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            console.log("Score saved successfully!");
            
        } else {
       
            console.warn("Could not save score:", data.message);
        }
    })
    .catch(error => console.error('Error saving score:', error));
}