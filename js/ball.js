$(document).ready(function () {
    // This is the first animation that displays menu and rules and start button:
    $(".anounce h1, .anounce h4, .anounce ol li, .anounce button").each(function (i) {
        $(this).delay(30 * i + 1000).animate({
            opacity: "1"
        }, 10);
    });

    // What happens if The user clicks on start game button:
    $(".anounce .start button").on("click", function () {
        //fading out start menu.
        $(".anounce .start").fadeOut(400, function () {
            // running a countdown from 3 then fadeout the whole menu to start the game.
            $(".anounce .countdown").css("display", "flex").children().each(function (i) {
                $(this).delay(1000 * i + 500).fadeIn(500).fadeOut(500, function () {
                    if (i == 2) {
                        $(".anounce").fadeOut();
                        duringThePlay.loop = true;
                        duringThePlay.play()
                    }
                });
            });
        });
        // Decalaring game Variables.
        let ballInitPos = [$(".ball").position().left, $(".ball").position().top],
            score = 0,
            lives = 3,
            speed = score * 5 + 120,
            enemyWidth = 0.2,
            enemySpeed = score + 150,
            numOfEnemies = 100 / enemyWidth,
            numOfVisibleEnemies = (score * 10 + 50 > numOfEnemies) ? numOfEnemies : (score * 10 + 50),
            timeBetweenAttacks = (1000 - score * 20 >= 50) ? 1000 - score * 20 : 100,
            attackOrder = new Array(numOfVisibleEnemies).fill("").map((e, i) => i + 1).sort(() => Math.round((Math.random() * numOfVisibleEnemies * 2) - numOfVisibleEnemies)),
            s = 1,
            toStartAttacking = true;
        const easingFunctions = ["linear", "swing", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInSine", "easeOutSine", "easeInOutSine", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeInBounce", "easeOutBounce", "easeInOutBounce"],
            gameOverAud = new Audio("../music/Game Over.mp3"),
            losingLifeAud = new Audio("../music/You lost a life.wav"),
            gainPointAud = new Audio("../music/You gained a point.mp3"),
            depassingWaveAud = new Audio("../music/You passed a wave.mp3"),
            duringThePlay = new Audio("../music/during the play.m4a");
        // a function that restarts or change dynamic variables.
        function restartingVars() {
            s = 1;
            speed = score * 5 + 120;
            enemySpeed = score + 150;
            numOfVisibleEnemies = (score * 10 + 50 > numOfEnemies) ? numOfEnemies : (score * 10 + 50);
            timeBetweenAttacks = (1000 - score * 20 >= 50) ? 1000 - score * 20 : 100;
            attackOrder = new Array(numOfVisibleEnemies).fill("").map((e, i) => i + 1).sort(() => Math.round((Math.random() * numOfVisibleEnemies * 2) - numOfVisibleEnemies));
            toStartAttacking = true;
        }
        // appending enemies and distanging the visible ones.
        function appendindEnemies() {
            for (let i = 0; i < numOfEnemies; i++) {
                if (i < numOfVisibleEnemies)
                    $(".gamecanvas .waves").append("<div class='enemy visible'></div>");
                else
                    $(".gamecanvas .waves").append("<div class='enemy'></div>");
            }
        }

        function detachingOldWaves() {
            $(".gamecanvas .waves .enemy").detach();
        }
        // a function that return true if there is a collision between two elements.
        function collision(div1, div2) {
            let x1 = div1.offset().left,
                y1 = div1.offset().top,
                b1 = y1 + div1.outerHeight(true),
                r1 = x1 + div1.outerWidth(true),
                x2 = div2.offset().left,
                y2 = div2.offset().top,
                b2 = y2 + div2.outerHeight(true),
                r2 = x2 + div2.outerWidth(true);

            if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
            return true;
        }
        // a function that lunches a wave of enemies.
        function lunchingOneWave() {
            $(".gamecanvas .waves .enemy.visible").each(function (ind) {
                $(this).delay(timeBetweenAttacks * attackOrder[ind] + 500).animate({
                    top: $(".gamecanvas").outerHeight() + $(this).height() + $(".ball").height() / 2 + "px"
                }, {
                    duration: (($(".gamecanvas").outerHeight() + $(this).height() + $(".ball").height() / 2) / enemySpeed) * 1000,
                    easing: easingFunctions[(ind >= easingFunctions.length) ? ind % easingFunctions.length : ind], //"easeInBounce",
                    progress: function (a, p, ms) {
                        if (collision($(this), $(".ball"))) {
                            s++;
                            $(this).stop(true).fadeOut(500, function () {
                                $(this).removeClass("visible");
                            });
                            losingLifeAud.play();
                            lives--;
                            $(".lives span").text((lives == 2) ? ("❤️❤️") : ((lives == 1) ? ("❤️") : ""))
                            if (lives == 0) {
                                duringThePlay.pause();
                                gameOverAud.play();
                                $(".gamecanvas .waves .enemy.visible").stop(true).fadeOut(500, function () {
                                    $(this).removeClass("visible");
                                });
                                $(".gameover").fadeIn(2000, function () {
                                    $(this).css("display", "flex").children().first().animate({
                                        fontSize: 16.8 + "vw"
                                    }, 2000, "easeOutBounce", function () {
                                        $(this).next().animate({
                                            fontSize: 5 + "vw"
                                        }, 1000, "easeOutExpo", function () {
                                            s = 0;
                                            let wat = $(this)
                                            t = setInterval(function () {
                                                wat.find("span").text(s);
                                                if (gainPointAud.paused) {
                                                    gainPointAud.play();
                                                } else {
                                                    gainPointAud.currentTime = 0
                                                }
                                                s++;
                                                if (s > score) {
                                                    clearInterval(t);
                                                }
                                            }, 100);

                                        });
                                    });
                                });
                            }
                        }
                    },
                    complete: function () {
                        s++;
                        if (s == numOfVisibleEnemies) {
                            // you passed the wave
                            s = score;
                            score += 10;
                            let t = setInterval(function () {
                                $(".score span").text(s);
                                if (gainPointAud.paused) {
                                    gainPointAud.play();
                                } else {
                                    gainPointAud.currentTime = 0
                                }
                                s++;
                                if (s > score) {
                                    depassingWaveAud.play()
                                    restartingVars();
                                    detachingOldWaves();
                                    appendindEnemies();
                                    clearInterval(t);
                                }
                            }, 100);
                        }
                    }
                });
            });
        }
        appendindEnemies();
        $("html").contextmenu(function (e) {

            e.preventDefault();
            let marginLeft = ($(window).width() - $(".gamecanvas").outerWidth()) / 2, // + 10 - 2
                marginTop = ($(window).height() - $(".gamecanvas").outerHeight()) / 2; // + 10 - 2
            // ball movement.
            if (e.pageX >= marginLeft && e.pageX <= ($(".gamecanvas").outerWidth() + marginLeft) && e.pageY >= marginTop && e.pageY <= ($(".gamecanvas").outerHeight() + marginTop)) {


                ballInitPos = [$(".ball").position().left, $(".ball").position().top]

                let xLeftPositions, yTopPositions,
                    left = `calc(${e.pageX}px - ${marginLeft}px)`,
                    top = `calc(${e.pageY}px - ${marginTop}px)`

                $("#steps").prepend('<div class="dot" style="top:' + top + ';left:' + left + ';"></div>');

                xLeftPositions = [$("#steps .dot:nth-child(1)").position().left, ballInitPos[0]]
                yTopPositions = [$("#steps .dot:nth-child(1)").position().top, ballInitPos[1]]
                distance = Math.sqrt(Math.pow((Math.max(...xLeftPositions) - Math.min(...xLeftPositions)), 2) + Math.pow((Math.max(...yTopPositions) - Math.min(...yTopPositions)), 2))

                $(".ball").css({
                    "transition-duration": distance / speed + "s",
                    "left": left.substr(0, left.length - 1) + " - " + $(".ball").width() / 2 + "px)",
                    "top": top.substr(0, top.length - 1) + " - " + $(".ball").height() / 2 + "px)"
                }, 500);

                setTimeout(function () {
                    $('#steps .dot:nth-child(3)').detach();
                }, 2000);

                if (toStartAttacking == true) {
                    toStartAttacking = false;
                    lunchingOneWave();
                }

            }
        });
    });
});