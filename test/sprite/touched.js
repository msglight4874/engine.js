var bird_1 = Game.createSprite("./assets/bird.png");
var bird_2 = Game.createSprite("./assets/bird_2.png");

Game.forever(function() {
    bird_1.moveTo(Game.cursor);
    Game.print(bird_1.touched(bird_2), 200, 100, 'red', 50);
});