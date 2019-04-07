function loadCanvas(player) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let background = new Image();
    let target = new Image();
    let sight = new Image();
    let gunshot = new Audio();
    let scream = new Audio();

    ctx.font = "24px serif";
    ctx.fillStyle = "yellow";

    let targetObj = {
        speed: 20,
        x: 0,
        y: 100,
        width: 300,
        height: 500
    };
    let mouse = {
        x: 0,
        y: 100
    };

    background.src = './imgs/parlament.png';
    target.src = './imgs/batboiko.png';
    sight.src = "imgs/sight.png";
    gunshot.src = './audio/john_ruok_gun_tikka_t3_battue_308_005_Swpph_Mono_Shot_Strong_Edit_Short.mp3';
    scream.src = './audio/zapsplat_cartoon_character_male_high_pitched_scream_003_22818.mp3';
    let backgroundPromise = new Promise((resolve, reject) => {
        $(background).on('load', resolve);
    });

    let targetPromise = new Promise((resolve, reject) => {
        $(target).on('load', resolve);
    });

    let sightPromise = new Promise((resolve, reject) => {
        $(sight).on('load', resolve);
    });

    Promise.all([backgroundPromise, targetPromise, sight]).then(() => {
        drawCanvas(canvas.width / 2, canvas.height / 2);
    });

    function drawCanvas(mouseX, mouseY) {
        ctx.drawImage(background, 0, 0, 800, 600);
        ctx.drawImage(target, targetObj.x, targetObj.y, targetObj.width, targetObj.height);
        ctx.fillText(`Player: ${player.name}`, 650, 25);
        ctx.fillText(`Money: ${player.money}`, 650, 50);
        ctx.fillText(`Bullets: ${player.bullets}`, 650, 75);

        if (player.bullets === 0) {
            ctx.font = "48px serif";
            ctx.fillStyle = "red";
            ctx.fillText(`Reload!`, canvas.width / 2 - 50, canvas.height / 2);
            ctx.font = "24px serif";
            ctx.fillStyle = "yellow";
        }

        ctx.drawImage(sight, mouseX, mouseY, 50, 50);
    }

    $(canvas).mousemove(function (event) {
        mouse.x = event.clientX - 35;
        mouse.y = event.clientY - 20;
        drawCanvas(mouse.x, mouse.y);
    });

    $(canvas).click(function (event) {
        if (player.bullets > 0) {
            gunshot.play();
            if (event.clientX > targetObj.x && event.clientX < targetObj.x + targetObj.width &&
                event.clientY > targetObj.y && event.clientY < targetObj.y + targetObj.height) {
                    setTimeout(function(){
                        scream.play();
                        
                      }, 200);
                player.money += 20;
            }

            player.bullets--;
        }
    });

    //Set a property in the Canvas to allow for cleaning the interval from outside
    canvas.intervalId = setInterval(moveTarget, 100);

    function moveTarget() {
        if (targetObj.speed > 0 && targetObj.x + targetObj.width >= canvas.width) {
            targetObj.speed = 0 - targetObj.speed;
        } else if (targetObj.speed < 0 && targetObj.x <= 0) {
            targetObj.speed = 0 - targetObj.speed;
        }

        targetObj.x += targetObj.speed;
        drawCanvas(mouse.x, mouse.y)
    }
}