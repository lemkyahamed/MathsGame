//javascript.js
var playing = false;
var score;
var hearts; // New: Player lives
var action;
var timeremaining;
var correctAnswer;
var challengeSolution; // New: Solution for the image puzzle
var challengeApiUrl = "apicon.php"; // Call API URL

// --- NEW: Difficulty Settings ---
var difficulty;
var maxTime;
var levelSettings = {
    easy: {
        time: 60,
        x_min: 1, // Single digits
        x_max: 9,
        y_min: 1,
        y_max: 9
    },
    medium: {
        time: 90,
        x_min: 10, // Double digits (e.g., 10-25)
        x_max: 25,
        y_min: 2, // Single digits (e.g., 2-9)
        y_max: 9,
        z_min: 1, // For +/-
        z_max: 9
    },
    hard: {
        time: 120,
        x_min: 10, // Double digits (for mult)
        x_max: 30,
        y_min: 2, // Single digits (for mult/div)
        y_max: 9,
        z_min: 1, // For +/-
        z_max: 9,
        div_quotient_min: 2, // Min result for division
        div_quotient_max: 10  // Max result for division
    }
};

// --- NEW: Function to start the game ---
function startGame() {
    playing = true;
    
    // set score to 0
    score = 0;
    document.getElementById("scorevalue").innerHTML = score;
    
    // New: set hearts/lives
    hearts = 3; 
    document.getElementById("heartcount").innerHTML = hearts;
    show("hearts");
 
    // show countdown box 
    show("timeremaining");
    // Use the maxTime set by difficulty
    timeremaining = maxTime; 
    document.getElementById("timeremainingvalue").innerHTML = timeremaining;
    
    // hide game over box
    hide("gameOver");
    
    // The button is now "Main Menu", so we don't change its text
    
    // start countdown
    startCountdown();
    
    // generate a new Q&A
    generateQA();
}


// --- NEW: Wait for the DOM to be ready before setting up the game ---
document.addEventListener("DOMContentLoaded", function() {

    // --- Get Difficulty from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const difficultyParam = urlParams.get('difficulty');
    
    if (difficultyParam === 'medium') {
        difficulty = 'medium';
    } else if (difficultyParam === 'hard') {
        difficulty = 'hard';
    } else {
        difficulty = 'easy';
    }
    
    // Set the maxTime based on the chosen difficulty
    maxTime = levelSettings[difficulty].time;
    
    // Update the timer display to show the correct starting time
    document.getElementById("timeremainingvalue").innerHTML = maxTime;
    
    // --- NEW: Start the game automatically ---
    startGame();

    // --- All event listeners are now safely inside this function ---

    // Click on the start/reset button
    document.getElementById("startreset").onclick = function(){
        
        // --- NEW: Check if game is playing, then show modal ---
        if (playing == true) {
            // Pause the game and show confirmation
            stopCountdown();
            show("confirmQuitModal");
        } else {
            // If game is not playing (e.g., on game over screen), just go to main menu
            window.location.href = "mainmanu.php";
        }
    }

    // --- NEW: Listeners for the confirmation modal ---

    // Handle "Yes, Quit" button in the confirmation modal
    document.getElementById("confirmQuitYes").onclick = function() {
        window.location.href = "mainmanu.php";
    }

    // Handle "No, Cancel" button in the confirmation modal
    document.getElementById("confirmQuitNo").onclick = function() {
        hide("confirmQuitModal");
        // Resume the game only if it was playing
        if (playing == true) {
            startCountdown();
        }
    }


    // New: Add click listener for the game over close button
    document.getElementById("closeGameOver").onclick = function() {
        hide("gameOver");
    }

    // Clicking on an answer box
    for(let i=1; i<5; i++){
        document.getElementById("box"+i).onclick = function(){
        // check if we are playing     
        if(playing == true){
            if(this.innerHTML == correctAnswer){
            // correct answer
                score++;
                document.getElementById("scorevalue").innerHTML = score;
                // hide wrong box and show correct box
                hide("wrong");
                show("correct");
                setTimeout(function(){
                    hide("correct");   
                }, 1000);
                
                // Generate new Q&A
                generateQA();
            }else{
            // wrong answer -> START heart CHALLENGE
                
                // 1. Pause the main game
                stopCountdown(); // <<< TIMER STOPS HERE
                playing = false;
                
                // 2. Hide any lingering feedback
                hide("correct");
                hide("wrong"); 
                
                // 3. Start the heart Challenge
                startheartChallenge(); // <<< MODAL STARTS HERE
            }
        }
    }   
    }

    // Handle the challenge submission
    document.getElementById("submitChallenge").onclick = function() {
        var playerInput = document.getElementById("challengeInput").value;
        var messageBox = document.getElementById("challengeMessage");
        
        // Using == to allow for string/number comparison (e.g., "7" == 7)
        if (playerInput == challengeSolution) {
            // SUCCESS: Player continues
            messageBox.innerHTML = "Correct! Life saved. Continuing game...";
            messageBox.style.color = "green";
            
            setTimeout(function() {
                hide("heartChallengeModal");
                playing = true; 
                startCountdown(); // <<< TIMER RESUMES HERE
                generateQA(); // Start a new main quiz question
            }, 1500);
            
        } else {
            // FAILURE: Player loses a life
            messageBox.innerHTML = "Wrong answer. You lose a life!";
            messageBox.style.color = "red";
            
            // Wait a moment before processing the failure so the user can read the message
            setTimeout(failChallenge, 1500); 
        }
    };

});


/* Note: All functions below are defined globally, 
   so they can be called from inside the DOMContentLoaded listener.
*/


// --- Utility Functions ---

function startCountdown(){
    action = setInterval(function(){
        timeremaining -= 1;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        if(timeremaining == 0){ // game over (time ran out)
            stopCountdown();
            show("gameOver");
            
            // --- UPDATED GAME OVER CONTENT ---
            // We now show "Saving score..." to give feedback to the user
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

//
// --- THIS IS THE CORRECTED FUNCTION (NOW INCLUDES confirmQuitModal) ---
//
function show(Id){
    // Check if the ID is for an element that needs 'flex' to center
    // Your CSS for 'heartChallengeModal', 'gameOver', and now 'confirmQuitModal' uses flex
    if (Id === "heartChallengeModal" || Id === "gameOver" || Id === "confirmQuitModal") {
        document.getElementById(Id).style.display = "flex";
    } else {
        // All other elements can use 'block'
        document.getElementById(Id).style.display = "block";
    }
}

// --- NEW: generateQA updated for difficulty ---
function generateQA(){
    // Get the settings for the current difficulty
    let settings = levelSettings[difficulty];
    let questionString = "";

    // Helper function to get a random number in a specific range
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
            let x = getRandom(settings.x_min, settings.x_max); // 10-25
            let y = getRandom(settings.y_min, settings.y_max); // 2-9
            let z = getRandom(settings.z_min, settings.z_max); // 1-9
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
            let z = getRandom(settings.z_min, settings.z_max); // 1-9
            let operation = (Math.random() > 0.5) ? '+' : '-';
            
            // 60% chance of multiplication, 40% chance of division
            if (Math.random() > 0.4) {
                // Multiplication: e.g., (18 x 7) - 6
                let x = getRandom(settings.x_min, settings.x_max); // 10-30
                let y = getRandom(settings.y_min, settings.y_max); // 2-9
                
                questionString = `${x} x ${y} ${operation} ${z}`;
                
                if (operation === '+') {
                    correctAnswer = (x * y) + z;
                } else {
                    correctAnswer = (x * y) - z;
                }
            } else {
                // Division: e.g., (72 / 8) + 5
                // To get whole numbers, we generate the answer (quotient) first.
                let y = getRandom(settings.y_min, settings.y_max); // 2-9 (divisor)
                let quotient = getRandom(settings.div_quotient_min, settings.div_quotient_max); // 2-10 (answer)
                let x = y * quotient; // The number to be divided (e.g., 8 * 9 = 72)
                
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
    document.getElementById("box" + correctPosition).innerHTML = correctAnswer; //fill one box with the correct answer
    
    //fill other boxes with wrong answers
    var answers = [correctAnswer];
    
    for(let i=1; i<5; i++){
        if(i != correctPosition) {
            var wrongAnswer;
            
            // Generate plausible wrong answers close to the correct answer
            do {
                // Generate a random offset, e.g., +/- 1 to 12
                let offset = getRandom(1, 12);
                
                if (Math.random() > 0.5) {
                    wrongAnswer = correctAnswer + offset;
                } else {
                    wrongAnswer = correctAnswer - offset;
                }

                // Ensure wrong answer isn't 0 or negative
                if (wrongAnswer <= 0) {
                    wrongAnswer = correctAnswer + offset + 5; // just add
                }

            } while(answers.indexOf(wrongAnswer) > -1 || wrongAnswer === correctAnswer) // Ensure wrong answer is unique and not the correct answer
            
            document.getElementById("box"+i).innerHTML = wrongAnswer;
            answers.push(wrongAnswer);
        }
    }
}

// --- heart Challenge Logic ---

function startheartChallenge() {
    // Fetch challenge data from the PHP 
    fetch(challengeApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.question && data.solution) {
                challengeSolution = data.solution; // Store the correct solution
                
                document.getElementById("challengeImage").src = data.question;
                document.getElementById("challengeMessage").innerHTML = "";
                document.getElementById("challengeInput").value = "";
                
                show("heartChallengeModal"); // calling conainer from index.js
            } else {
                console.error("API failed to return valid challenge data.");
                // If API fails, treat it as a failed attempt to avoid halting the game
                failChallenge();
            }
        })
        .catch(error => {
            console.error('Error fetching challenge data:', error);
            // This could be a CORS issue, a 404, or the PHP script failing.
            // We'll use a local fallback challenge.
            console.warn('Using local fallback challenge.');
            // Example fallback (you can make this more robust)
            challengeSolution = "7"; // Set a default solution
            document.getElementById("challengeImage").src = "https://placehold.co/300x150/e8e8e8/a0a0a0?text=Find+the+'7'"; // A placeholder image
            document.getElementById("challengeMessage").innerHTML = "";
            document.getElementById("challengeInput").value = "";
            show("heartChallengeModal");
            // failChallenge(); // Or just fail the challenge immediately
        });
}


// Function to handle the process of losing a life
function failChallenge() {
    hearts--;
    document.getElementById("heartcount").innerHTML = hearts;
    
    // Hide the modal *before* checking for game over
    hide("heartChallengeModal"); 

    // Check if the game is truly over
    if (hearts <= 0) {
        // Game Over: No lives left
        stopCountdown(); // Stop timer immediately
        show("gameOver"); // This will now use display: flex
        
        // Updated to target the new content div
        document.getElementById("gameOverContent").innerHTML = `
            <p>Game over!</p>
            <p>You ran out of lives! </p>
            <p>Your score is ${score}.</p>
            <p style="font-size:0.6em; color:#7f8c8d;">Saving score...</p>
        `;
        
        // --- CALL THE SAVE FUNCTION HERE (User died) ---
        saveScoreToBackend(score, difficulty);

        hide("timeremaining");
        hide("hearts");
        playing = false;
        document.getElementById("startreset").innerHTML = "Main Menu";
    } else {
        // Player failed but still has lives left: Resume main game
        playing = true; 
        startCountdown(); // TIMER RESUMES HERE (after failing challenge)
        generateQA(); // Start a new main quiz question
    }
}

// --- NEW: Function to Save Score to Backend ---
function saveScoreToBackend(finalScore, difficultyLevel) {
    // We send a POST request to our new PHP endpoint
    fetch('backend/save_score.php', {
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
            // You could check data.newHighScore if you implemented that logic in PHP
        } else {
            // This usually happens if the user isn't logged in
            console.warn("Could not save score:", data.message);
        }
    })
    .catch(error => console.error('Error saving score:', error));
}