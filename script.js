/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

var settings = {
  restart: true,
};

var borders = {
  left: 0,
  right: canvas.width,
  top: 0,
  bottom: canvas.height,
};
var tankStats = {
  length: 48,
  width: 44,
  tracksLength: 54,
  tracksWidth: 8,
  turretLength: 20,
  cannonLength: 24,
  cannonWidth: 8,
  hp: 150,
  damage: 50,
  speed: 5,
  reloadDelay: 500,
};
var npcTankStats = {};
var tanks = [];
var npcTanks = [];
var walls = [];
var npcCount = 4;
var wallCount = 30;
// var npcMoveInterval = 17;
var npcMoveInterval = 1;
var visibilityPathPointNum = 50;
var wallStats = {
  width: 60,
  height: 60,
  innerWallWidth: 40,
  color: "rgb(150, 150, 150)",
  innerWallColor: "white",
  hp: 150,
};
var playerColor = "green";
var playerTurretColor = "darkgreen";
var playerDirection = "right";

var directions = ["right", "left", "top", "bottom"];
var colors = [
  "rgb(238,64,53)",
  "rgb(243,119,54)",
  "rgb(253,244,152)",
  "rgb(123,192,67)",
  "rgb(3,146,207)",
];
var turretColors = [
  "rgb(200,64,53)",
  "rgb(210,119,54)",
  "rgb(223,244,152)",
  "rgb(93,192,67)",
  "rgb(50,146,207)",
];

function log(str) {
  console.log(str);
}

function logCoords(tank) {
  console.log(
    "x0: " + tank.x0,
    "y0: " + tank.y0,
    "x1: " + tank.x1,
    "y1: " + tank.y1,
    "cX: " + tank.centerX,
    "cY: " + tank.centerY
  );
}

var collisionWallPositionDebug = {
  x0: 200,
  y0: 200,
  x1: 200 + wallStats.width,
  y1: 200 + wallStats.height,
};

// testing ground
// doesnt go through 49 width for some reason.
var collisionTestWallWidth = 49;

createWall(collisionWallPositionDebug);
collisionWallPositionDebug.x0 += wallStats.width + collisionTestWallWidth;
collisionWallPositionDebug.x1 = collisionWallPositionDebug.x0 + wallStats.width;
collisionWallPositionDebug.y0 -= 30;
collisionWallPositionDebug.y1 -= 30;
createWall(collisionWallPositionDebug);
// end of testing ground

function getRandomIndex(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFreePosition(direction) {
  var x0 = Math.round(Math.random() * (canvas.width - 50 - 50) + 50);
  var x1 =
    direction == "right" || direction == "left"
      ? x0 + tankStats.length
      : x0 + tankStats.width;
  var y0 = Math.round(Math.random() * (canvas.height - 50 - 50) + 50);
  var y1 =
    direction == "right" || direction == "left"
      ? y0 + tankStats.width
      : y0 + tankStats.length;

  var isOccupied = false;

  if (walls.length) {
    walls.forEach(function (wall) {
      if (x1 >= wall.x0 && x0 <= wall.x1 && y1 >= wall.y0 && y0 <= wall.y1) {
        isOccupied = true;
      }
    });
  }

  if (tanks.length) {
    tanks.forEach(function (tank) {
      if (x1 >= tank.x0 && x0 <= tank.x1 && y1 >= tank.y0 && y0 <= tank.y1) {
        isOccupied = true;
      }
    });
  }

  if (isOccupied) {
    var position = getFreePosition();
    return position;
  } else return { x0, y0, x1, y1 };
}

function getFreePositionWall() {
  var x0 = Math.round(Math.random() * (canvas.width - 50 - 50) + 50);
  var x1 = x0 + wallStats.width;
  var y0 = Math.round(Math.random() * (canvas.height - 50 - 50) + 50);
  var y1 = y0 + wallStats.height;

  var isOccupied = false;

  if (walls.length) {
    walls.forEach(function (wall) {
      if (x1 >= wall.x0 && x0 <= wall.x1 && y1 >= wall.y0 && y0 <= wall.y1) {
        isOccupied = true;
      }
    });
  }

  if (isOccupied) {
    var position = getFreePositionWall();
    return position;
  } else return { x0, x1, y0, y1 };
}

function createNPCTanks() {
  for (i = 0; i < npcCount; i++) {
    var direction = getRandomIndex(directions);
    var position = getFreePosition(direction);
    var color = getRandomIndex(colors);
    var turretColor = getRandomIndex(turretColors);

    var npcTankActions = {
      isMoveable: true,
      patrolCoords: { x: undefined, y: undefined },
      patrolPath: { x: [], y: [] },
      chaseCoords: { x: undefined, y: undefined },
      chasePath: { x: [], y: [] },
      isDirectionHorizontal: undefined,
      isDirectionVertical: undefined,
      isPastDiagonalPoint: false,
      isHorizontalLonger: undefined,
      isVerticalLonger: undefined,
      isHorizontalShorter: undefined,
      isVerticalShorter: undefined,
      checkLine: function () {
        var vision;
        var visionAngle = 60;
        var tankCenterX = this.x0 + this.length / 2;
        var tankCenterY = this.y0 + this.width / 2;
      },
      generatePath: function () {
        var coords = getFreePosition(this.direction);
        this.patrolCoords.x = coords.x0 + (coords.x1 - coords.x0);
        this.patrolCoords.y = coords.y0 + (coords.y1 - coords.y0);
        if (this.centerX < this.patrolCoords.x) {
        }
      },
      patrol: function () {
        if (this.isPlayerVisible == false) {
        }
      },
      chase: function () {
        if (this.isPlayerVisible == true) {
          this.chaseCoords.x = playerTank.centerX;
          this.chaseCoords.y = playerTank.centerY;

          var dx = Math.abs(this.centerX - playerTank.centerX);
          var dy = Math.abs(this.centerY - playerTank.centerY);

          var toRight;
          var toLeft;
          var toTop;
          var toBottom;

          if (this.centerX < playerTank.centerX) {
            toRight = true;
          } else {
            toLeft = true;
          }

          if (this.centerY < playerTank.centerY) {
            toBottom = true;
          } else {
            toTop = true;
          }

          var dxdyDiff = Math.abs(dx - dy);

          if (!this.isPastDiagonalPoint) {
            if (dxdyDiff <= this.speed) {
              this.isPastDiagonalPoint = true;
            }

            if (dx <= dy) {
              this.isHorizontalShorter = true;
            } else {
              this.isVerticalShorter = true;
            }
          }

          if (dx > this.speed * 10 || dy > this.speed * 10) {
            // if (this.isPastDiagonalPoint) {
            //   if (this.direction == "right" || this.direction == "left") {
            //     if (dx <= this.speed || dx <= this.speed * 4) {
            //       if (toBottom) {
            //         this.directionPrev = this.direction;
            //         this.direction = "bottom";
            //         this.rotate();
            //       } else {
            //         this.directionPrev = this.direction;
            //         this.direction = "top";
            //         this.rotate();
            //       }
            //     }
            //   } else {
            //     if (dy <= this.speed) {
            //       if (toRight) {
            //         this.directionPrev = this.direction;
            //         this.direction = "right";
            //         this.rotate();
            //       } else {
            //         this.directionPrev = this.direction;
            //         this.direction = "left";
            //         this.rotate();
            //       }
            //     }
            //   }
            // }
            if (dx <= this.speed * 4) {
              if (toBottom && this.direction != "bottom") {
                this.directionPrev = this.direction;
                this.direction = "bottom";
                this.rotate();
              } else if (toTop && this.direction != "top") {
                this.directionPrev = this.direction;
                this.direction = "top";
                this.rotate();
              }
            } else if (dy <= this.speed * 4) {
              if (toRight && this.direction != "right") {
                this.directionPrev = this.direction;
                this.direction = "right";
                this.rotate();
              } else if (toLeft && this.direction != "left") {
                this.directionPrev = this.direction;
                this.direction = "left";
                this.rotate();
              }
            } else {
              if (this.isHorizontalShorter && dx > this.speed * 10) {
                if (toRight && this.direction != "right") {
                  this.directionPrev = this.direction;
                  this.direction = "right";
                  this.rotate();
                } else if (toLeft && this.direction != "left") {
                  this.directionPrev = this.direction;
                  this.direction = "left";
                  this.rotate();
                }
              } else if (this.isVerticalShorter && dy > this.speed * 10) {
                if (toBottom && this.direction != "bottom") {
                  this.directionPrev = this.direction;
                  this.direction = "bottom";
                  this.rotate();
                } else if (toTop && this.direction != "top") {
                  this.directionPrev = this.direction;
                  this.direction = "top";
                  this.rotate();
                }
              }
            }
          } else return;

          this.move();
        }
      },
    };

    var npcTank = createTank(
      false,
      position,
      direction,
      color,
      turretColor,
      tanks,
      npcTankActions
    );

    // var npcTank = createTank(
    //   false,
    //   position,
    //   direction,
    //   color,
    //   turretColor,
    //   tanks,
    //   npcTankActions
    // );

    // npcTank = { ...npcTank, ...npcTankActions };
    // npcTanks.push(npcTank);
  }
}

function createTank(
  isPlayer,
  position,
  direction,
  color,
  turretColor,
  tanks,
  npc
) {
  var tank = {
    isPlayer: isPlayer,
    isPlayerVisible: undefined,
    visibilityPath: { x: [], y: [] },
    x0: position.x0,
    y0: position.y0,
    x1: position.x1,
    y1: position.y1,
    direction: direction,
    directionPrev: direction,
    color: color,
    colorTurret: turretColor,
    colorTracks: "#555",
    isMoving: false,
    isReloading: false,
    projectiles: [],
    collision: {
      isCollidedRight: false,
      isCollidedLeft: false,
      isCollidedTop: false,
      isCollidedBottom: false,
    },
    sides: {
      isRightAvailable: true,
      isLeftAvailable: true,
      isTopAvailable: true,
      isBottomAvailable: true,
    },
    centerX: position.x0 + (position.x1 - position.x0) / 2,
    centerY: position.y0 + (position.y1 - position.y0) / 2,
    ...tankStats,
    rotate: function () {
      // log("rotating... " + this.directionPrev + " >> " + this.direction);

      if (this.direction != this.directionPrev) {
        // checkSides(this);
        if (this.direction == "right" && this.sides.isRightAvailable) {
          rotateCoordsHorizontal(this);
        } else if (this.direction == "left" && this.sides.isLeftAvailable) {
          rotateCoordsHorizontal(this);
        } else if (this.direction == "bottom" && this.sides.isBottomAvailable) {
          rotateCoordsVertical(this);
        } else if (this.direction == "top" && this.sides.isTopAvailable) {
          rotateCoordsVertical(this);
        } else {
          this.direction = this.directionPrev;
        }
        // removeSidesData(this);
      }
    },
    draw: function () {
      if (this.isPlayer == false && this.isMoveable) {
        if (this.isPlayerVisible) {
          this.chase();
        } else this.patrol();

        this.isMoveable = false;
        setTimeout(() => (this.isMoveable = true), npcMoveInterval);
      }

      ctx.save();
      // ctx.translate(this.x0 + this.length / 2, this.y0 + this.width / 2);
      // ctx.translate(this.x0, this.y0);

      if (this.direction == "right" || this.direction == "left") {
        ctx.translate(this.x0 + this.length / 2, this.y0 + this.width / 2);
      } else {
        ctx.translate(this.x0 + this.width / 2, this.y0 + this.length / 2);
      }

      // console.log(this.directionPrev, this.direction);
      // if no rotateCoords. cX, cY gets undefined

      if (this.direction == "right") {
        ctx.rotate(0);
      } else if (this.direction == "left") {
        ctx.rotate((180 * Math.PI) / 180);
      } else if (this.direction == "bottom") {
        ctx.rotate((90 * Math.PI) / 180);
      } else if (this.direction == "top") {
        ctx.rotate((-90 * Math.PI) / 180);
      }

      // tank body
      ctx.fillStyle = this.color;
      ctx.fillRect(
        0 - this.length / 2,
        0 - this.width / 2,
        this.length,
        this.width
      );

      // tank tracks
      ctx.fillStyle = this.colorTracks;
      ctx.fillRect(
        0 - this.length / 2 - (this.tracksLength - this.length) / 2,
        0 - this.width / 2,
        this.tracksLength,
        this.tracksWidth
      );
      ctx.fillRect(
        0 - this.length / 2 - (this.tracksLength - this.length) / 2,
        0 + this.width / 2 - this.tracksWidth,
        this.tracksLength,
        this.tracksWidth
      );

      // tank turret
      ctx.fillStyle = this.colorTurret;
      ctx.fillRect(
        0 - this.turretLength / 2,
        0 - this.turretLength / 2,
        this.turretLength,
        this.turretLength
      );
      ctx.fillRect(
        0 + this.turretLength / 2,
        0 - this.cannonWidth / 2,
        this.cannonLength,
        this.cannonWidth
      );

      // debug position pointers
      // ctx.fillStyle = "red";
      // ctx.fillRect(0 - this.length / 2, 0 - this.width / 2, 5, 5);
      // ctx.fillRect(0 + this.length / 2 - 5, 0 - this.width / 2, 5, 5);
      // ctx.fillRect(0 - this.length / 2, 0 + this.width / 2 - 5, 5, 5);
      // ctx.fillRect(0 + this.length / 2 - 5, 0 + this.width / 2 - 5, 5, 5);

      ctx.restore();

      // debug x0, y0
      // ctx.fillStyle = "lightgreen";
      // ctx.fillRect(this.x0, this.y0, 10, 10);

      if (this.isPlayer == false) {
        ctx.lineWidth = 1;

        var x = this.centerX;
        var y = this.centerY;

        var xPointDistance = Math.abs(
          (this.centerX - playerTank.centerX) / visibilityPathPointNum
        );
        var yPointDistance = Math.abs(
          (this.centerY - playerTank.centerY) / visibilityPathPointNum
        );

        this.isPlayerVisible = true;
        this.visibilityPath = { x: [], y: [] };

        for (var i = 0; i < visibilityPathPointNum; i++) {
          if (this.centerX < playerTank.centerX) {
            x += xPointDistance;
          } else {
            x -= xPointDistance;
          }
          if (this.centerY < playerTank.centerY) {
            y += yPointDistance;
          } else {
            y -= yPointDistance;
          }

          for (var j = 0; j < walls.length; j++) {
            var wall = walls[j];
            if (ctx.isPointInPath(wall.path, x, y)) {
              this.isPlayerVisible = false;
            }
          }

          this.visibilityPath.x.push(x);
          this.visibilityPath.y.push(y);
        }

        if (this.isPlayerVisible) {
          ctx.strokeStyle = "green";
          if (this.isReloading == false) {
            this.shoot();
            this.isReloading = true;
            setTimeout(() => (this.isReloading = false), this.reloadDelay);
          }
        } else {
          ctx.strokeStyle = "red";
        }

        var path = new Path2D();
        path.moveTo(this.centerX, this.centerY);
        path.lineTo(playerTank.centerX, playerTank.centerY);
        // ctx.stroke(path);
      }
    },
    move: function () {
      checkCollision(this);

      // logCoords(this);
      // return;

      // if (this.direction == this.directionPrev) {
      if (
        // !this.collision.isCollidedLeft &&
        this.direction == "right" &&
        this.x1 < borders.right
      ) {
        this.x0 += this.speed;
        this.x1 += this.speed;
        this.centerX = this.x0 + this.length / 2;
        checkCollision(this);
        removeCollision(this);
      } else if (
        // !this.collision.isCollidedRight &&
        this.direction == "left" &&
        this.x0 > borders.left
      ) {
        this.x0 -= this.speed;
        this.x1 -= this.speed;
        this.centerX = this.x0 + this.length / 2;
        checkCollision(this);
        removeCollision(this);
      } else if (
        // !this.collision.isCollidedTop &&
        this.direction == "bottom" &&
        this.y1 < borders.bottom
      ) {
        this.y0 += this.speed;
        this.y1 += this.speed;
        this.centerY = this.y0 + this.length / 2;
        checkCollision(this);
        removeCollision(this);
      } else if (
        // !this.collision.isCollidedBottom &&
        this.direction == "top" &&
        this.y0 > borders.top
      ) {
        this.y0 -= this.speed;
        this.y1 -= this.speed;
        this.centerY = this.y0 + this.length / 2;
        checkCollision(this);
        removeCollision(this);
      }

      // }
    },
    shoot: function () {
      var projectile = createProjectile(this);
      this.projectiles.push(projectile);
    },
  };

  // if (isPlayer) tank.damage = 999999;

  if (isPlayer == false) tank = { ...tank, ...npc };
  tanks.push(tank);
  return tank;
}

function checkCollision(tankThis) {
  for (var i = 0; i < walls.length; i++) {
    var wall = walls[i];
    if (
      tankThis.x1 >= wall.x0 &&
      tankThis.x0 <= wall.x1 &&
      tankThis.y1 >= wall.y0 &&
      tankThis.y0 <= wall.y1
    ) {
      if (tankThis.x1 >= wall.x0 && tankThis.direction == "right") {
        tankThis.collision.isCollidedRight = true;
        tankThis.x0 = wall.x0 - tankThis.length - 1;
        tankThis.x1 = tankThis.x0 + tankThis.length;
      }
      if (tankThis.x0 <= wall.x1 && tankThis.direction == "left") {
        tankThis.collision.isCollidedLeft = true;
        tankThis.x0 = wall.x1 + 1;
        tankThis.x1 = tankThis.x0 + tankThis.length;
      }
      if (tankThis.y0 <= wall.y1 && tankThis.direction == "top") {
        tankThis.collision.isCollidedTop = true;
        tankThis.y0 = wall.y1 + 1;
        tankThis.y1 = tankThis.y0 + tankThis.length;
      }
      if (tankThis.y1 >= wall.y0 && tankThis.direction == "bottom") {
        tankThis.collision.isCollidedBottom = true;
        tankThis.y0 = wall.y0 - tankThis.length - 1;
        tankThis.y1 = tankThis.y0 + tankThis.length;
      }

      // if (tankThis.x0 < wall.x0) {
      //   tankThis.collision.isCollidedLeft = true;
      // }
      // if (tankThis.x1 > wall.x1) {
      //   tankThis.collision.isCollidedRight = true;
      // }
      // if (tankThis.y0 < wall.y0) {
      //   tankThis.collision.isCollidedBottom = true;
      // }
      // if (tankThis.y1 > wall.y1) {
      //   tankThis.collision.isCollidedTop = true;
      // }
    }
  }

  for (var i = 0; i < tanks.length; i++) {
    var tank = tanks[i];
    if (
      tank != tankThis &&
      tankThis.x1 >= tank.x0 &&
      tankThis.x0 <= tank.x1 &&
      tankThis.y1 >= tank.y0 &&
      tankThis.y0 <= tank.y1
    ) {
      if (tankThis.x1 >= tank.x0 && tankThis.direction == "right") {
        tankThis.collision.isCollidedRight = true;
        tankThis.x0 = tank.x0 - tankThis.length - 1;
        tankThis.x1 = tankThis.x0 + tankThis.length;
      }
      if (tankThis.x0 <= tank.x1 && tankThis.direction == "left") {
        tankThis.collision.isCollidedLeft = true;
        tankThis.x0 = tank.x1 + 1;
        tankThis.x1 = tankThis.x0 + tankThis.length;
      }
      if (tankThis.y0 <= tank.y1 && tankThis.direction == "top") {
        tankThis.collision.isCollidedTop = true;
        tankThis.y0 = tank.y1 + 1;
        tankThis.y1 = tankThis.y0 + tankThis.length;
      }
      if (tankThis.y1 >= tank.y0 && tankThis.direction == "bottom") {
        tankThis.collision.isCollidedBottom = true;
        tankThis.y0 = tank.y0 - tankThis.length - 1;
        tankThis.y1 = tankThis.y0 + tankThis.length;
      }
    }
  }
}

function removeCollision(tank) {
  for (let direction in tank.collision) {
    tank.collision[direction] = false;
  }
}

function checkSides(tank) {
  var ifRotatedTank = {
    direction: undefined,
    directionPrev: undefined,
    x0: tank.x0,
    y0: tank.y0,
    x1: tank.x1,
    y1: tank.y1,
    centerX: tank.centerX,
    centerY: tank.centerY,
    collision: { ...tank.collision },
    sides: { ...tank.sides },
    ...tankStats,
  };

  ifRotatedTank = tank;

  // if (tank.direction == "right" || tank.direction == "left") {
  //   ifRotatedTank.directionPrev = "right";
  //   ifRotatedTank.direction = "top";
  //   rotateCoordsVertical(ifRotatedTank);
  // }

  // if (tank.direction == "top" || tank.direction == "bottom") {
  //   ifRotatedTank.directionPrev = "top";
  //   ifRotatedTank.direction = "right";
  //   rotateCoordsHorizontal(ifRotatedTank);
  // }

  // checkCollision(ifRotatedTank);
  checkCollision(tank);

  tank.sides.isRightAvailable = ifRotatedTank.collision.isCollidedRight
    ? false
    : true;
  tank.sides.isLeftAvailable = ifRotatedTank.collision.isCollidedLeft
    ? false
    : true;
  tank.sides.isTopAvailable = ifRotatedTank.collision.isCollidedTop
    ? false
    : true;
  tank.sides.isBottomAvailable = ifRotatedTank.collision.isCollidedBottom
    ? false
    : true;

  // for (i = 0; i < walls.length; i++) {
  //   var wall = walls[i];

  //   // if ((tank.direction == "right" || tank.direction == "left" ) &&
  //   //       ifRotatedTank.collision.isCollidedTop) {
  //   //   tank.collision
  //   // }

  //   // if (tank.direction == "top" || tank.direction == "bottom") {
  //   //   rotateCoordsTop(ifRotatedTank);
  //   // }
  // }
}

function removeSidesData(tank) {
  for (let side in tank.sides) {
    tank.sides[side] = true;
  }
}

var rotateCoordsDebug = true;

var tankLengthWidthDiff = tankStats.length - tankStats.width;

function rotateCoordsHorizontal(tank) {
  if (
    rotateCoordsDebug &&
    (tank.directionPrev == "top" || tank.directionPrev == "bottom")
  ) {
    tank.x0 = tank.x0 - tankLengthWidthDiff / 2;
    tank.y0 = tank.y0 + tankLengthWidthDiff / 2;
    tank.x1 = tank.x1 + tankLengthWidthDiff / 2;
    tank.y1 = tank.y1 - tankLengthWidthDiff / 2;
  }
  // else {
  //   tank.x1 = tank.x0 + tank.length;
  //   tank.y1 = tank.y0 + tank.width;
  // }

  tank.centerX = tank.x0 + tank.length / 2;
  tank.centerY = tank.y0 + tank.width / 2;
}

function rotateCoordsVertical(tank) {
  if (
    rotateCoordsDebug &&
    (tank.directionPrev == "right" || tank.directionPrev == "left")
  ) {
    tank.x0 = tank.x0 + tankLengthWidthDiff / 2;
    tank.y0 = tank.y0 - tankLengthWidthDiff / 2;
    tank.x1 = tank.x1 - tankLengthWidthDiff / 2;
    tank.y1 = tank.y1 + tankLengthWidthDiff / 2;
  }
  // else {
  //   tank.x1 = tank.x0 + tank.width;
  //   tank.y1 = tank.y0 + tank.length;
  // }
  tank.centerX = tank.x0 + tank.width / 2;
  tank.centerY = tank.y0 + tank.length / 2;
}

function createWalls() {
  for (i = 0; i < wallCount; i++) {
    var position = getFreePositionWall();
    createWall(position);
  }
}

function createWall(position) {
  var wall = {
    x0: position.x0,
    y0: position.y0,
    x1: position.x1,
    y1: position.y1,
    path: undefined,
    ...wallStats,
    draw: function () {
      ctx.fillStyle = this.color;
      var path = new Path2D();
      path.rect(this.x0, this.y0, this.width, this.height);
      ctx.fill(path);

      ctx.fillStyle = this.innerWallColor;
      var surfaceWidth = (this.width - this.innerWallWidth) / 2;
      var path2 = new Path2D();
      path2.rect(
        this.x0 + surfaceWidth,
        this.y0 + surfaceWidth,
        this.innerWallWidth,
        this.innerWallWidth
      );
      ctx.fill(path2);
      this.path = path;
    },
  };

  walls.push(wall);
}

function createProjectile(tankSource) {
  var projectile = {
    x: (function () {
      if (tankSource.direction == "right") {
        return (
          tankSource.x0 +
          tankSource.length / 2 +
          tankSource.turretLength / 2 +
          tankSource.cannonLength
        );
      } else if (tankSource.direction == "left") {
        return (
          tankSource.x0 +
          tankSource.length / 2 -
          tankSource.turretLength / 2 -
          tankSource.cannonLength -
          tankSource.cannonWidth
        );
      } else if (tankSource.direction == "top") {
        return (
          tankSource.x0 + tankSource.width / 2 - tankSource.cannonWidth / 2
        );
      } else if (tankSource.direction == "bottom") {
        return (
          tankSource.x0 + tankSource.width / 2 - tankSource.cannonWidth / 2
        );
      }
    })(),
    y: (function () {
      if (tankSource.direction == "right") {
        return (
          tankSource.y0 + tankSource.width / 2 - tankSource.cannonWidth / 2
        );
      } else if (tankSource.direction == "left") {
        return (
          tankSource.y0 + tankSource.width / 2 - tankSource.cannonWidth / 2
        );
      } else if (tankSource.direction == "top") {
        return (
          tankSource.y0 +
          tankSource.length / 2 -
          tankSource.turretLength / 2 -
          tankSource.cannonLength -
          tankSource.cannonWidth
        );
      } else if (tankSource.direction == "bottom") {
        return (
          tankSource.y0 +
          tankSource.length / 2 +
          tankSource.turretLength / 2 +
          tankSource.cannonLength
        );
      }
    })(),
    direction: tankSource.direction,
    width: tankSource.cannonWidth,
    height: tankSource.cannonWidth,
    speed: tankSource.speed * 2,
    color: "yellow",
    owner: tankSource,
    draw: function () {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    move: function () {
      if (this.direction == "right") {
        this.x += this.speed;
      } else if (this.direction == "left") {
        this.x -= this.speed;
      } else if (this.direction == "top") {
        this.y -= this.speed;
      } else if (this.direction == "bottom") {
        this.y += this.speed;
      }
    },
  };

  return projectile;
}

function checkProjectileCollision(
  projectile,
  projectileIndex,
  projectiles,
  sourceTank
) {
  var projectileX = projectile.x + projectile.width / 2;
  var projectileY = projectile.y + projectile.height / 2;
  tanks.forEach(function (tank, tankIndex, tanks) {
    if (
      !(projectileX <= tank.x0 || projectileX >= tank.x1) &&
      !(projectileY <= tank.y0 || projectileY >= tank.y1)
    ) {
      tank.hp -= sourceTank.damage;
      if (tank.hp <= 0) {
        tanks.splice(tankIndex, 1);
        removeCollision(playerTank);
      }

      // if (sourceTank.isPlayer == false) projectiles.splice(projectileIndex, 1);
      projectiles.splice(projectileIndex, 1);
    }
  });

  walls.forEach(function (wall, wallIndex, walls) {
    if (
      !(projectileX <= wall.x0 || projectileX >= wall.x1) &&
      !(projectileY <= wall.y0 || projectileY >= wall.y1)
    ) {
      wall.hp -= sourceTank.damage;
      if (wall.hp <= 0) {
        walls.splice(wallIndex, 1);
        removeCollision(playerTank);
      }
      projectiles.splice(projectileIndex, 1);
    }
  });
}

function clearProjectiles() {
  tanks.forEach(function (tank) {
    tank.projectiles.forEach(function (projectile, ind, projectiles) {
      if (
        projectile.x > borders.right ||
        projectile.x < borders.left ||
        projectile.y > borders.bottom ||
        projectile.y < borders.top
      ) {
        projectiles.splice(ind, 1);
      }
    });
  });
}

function drawStatusBar() {
  ctx.font = "bold 80px Tunga";
  ctx.fillText(playerTank.hp, canvas.width - 200, 60);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStatusBar();

  if (settings.restart && (tanks.length <= 1 || playerTank.hp <= 0)) {
    clearLevel();
    startLevel();
  }

  for (let keyCode in keysToggle) {
    if (keysToggle[keyCode]) {
      // playerTank.directionPrev = playerTank.direction;
      if (keysToggle[keyCode] == 68) {
        // playerTank.direction = "right";
        playerTank.move();
      } else if (keysToggle[keyCode] == 65) {
        // playerTank.direction = "left";
        playerTank.move();
      } else if (keysToggle[keyCode] == 87) {
        // playerTank.direction = "top";
        playerTank.move();
      } else if (keysToggle[keyCode] == 83) {
        // playerTank.direction = "bottom";
        playerTank.move();
      }
    }
  }

  walls.forEach(function (wall) {
    wall.draw();
  });

  tanks.forEach(function (tank) {
    tank.draw();
    tank.projectiles.forEach(function (projectile, ind, projectiles) {
      projectile.move();
      projectile.draw();
      checkProjectileCollision(projectile, ind, projectiles, tank);
    });
  });

  window.requestAnimationFrame(update);
}

var keysToggle = {
  68: null,
  65: null,
  87: null,
  83: null,
};

// w - 87, a - 65, s - 83, d - 68, k - 75
function onKeyDown(key) {
  var keysCount = 0;
  // for (let key in keysToggle) {
  //   if (keysToggle[key]) keysCount++;
  // }
  // if (keysCount > 1)
  //   console.log("multiple keys toggled: " + keysCount + keysToggle);

  if (key.keyCode == 75) {
    playerTank.shoot();
  }

  if (keysToggle.hasOwnProperty(key.keyCode)) {
    for (const keyCode in keysToggle) {
      keysToggle[keyCode] = null;
    }
    keysToggle[key.keyCode] = key.keyCode;
  }

  // if (keysToggle[key.keyCode] == 68) {
  //   playerTank.directionPrev = playerTank.direction;
  //   playerTank.direction = "right";
  //   playerTank.rotate();
  // } else if (keysToggle[key.keyCode] == 65) {
  //   playerTank.directionPrev = playerTank.direction;
  //   playerTank.direction = "left";
  //   playerTank.rotate();
  // } else if (keysToggle[key.keyCode] == 87) {
  //   playerTank.directionPrev = playerTank.direction;
  //   playerTank.direction = "top";
  //   playerTank.rotate();
  // } else if (keysToggle[key.keyCode] == 83) {
  //   playerTank.directionPrev = playerTank.direction;
  //   playerTank.direction = "bottom";
  //   playerTank.rotate();
  // }

  var directionPrevRestore = playerTank.directionPrev;
  var directionRestore = playerTank.direction;

  if (keysToggle[key.keyCode] == 68) {
    playerTank.directionPrev = playerTank.direction;
    playerTank.direction = "right";

    if (
      playerTank.directionPrev == "top" ||
      playerTank.directionPrev == "bottom"
    ) {
      rotateCoordsHorizontal(playerTank);
      checkCollision(playerTank);
      log(playerTank.direction);
      log(playerTank.collision);
    }

    if (
      playerTank.collision.isCollidedRight ||
      playerTank.collision.isCollidedLeft
    ) {
      playerTank.directionPrev = directionPrevRestore;
      playerTank.direction = directionRestore;
      removeCollision(playerTank);
      rotateCoordsVertical(playerTank);
      keysToggle[key.keyCode] = null;
    } else {
      playerTank.rotate();
    }
  } else if (keysToggle[key.keyCode] == 65) {
    playerTank.directionPrev = playerTank.direction;
    playerTank.direction = "left";
    if (
      playerTank.directionPrev == "top" ||
      playerTank.directionPrev == "bottom"
    ) {
      rotateCoordsHorizontal(playerTank);
      checkCollision(playerTank);
      log(playerTank.collision);
    }

    if (
      playerTank.collision.isCollidedRight ||
      playerTank.collision.isCollidedLeft
    ) {
      playerTank.directionPrev = directionPrevRestore;
      playerTank.direction = directionRestore;
      removeCollision(playerTank);
      rotateCoordsVertical(playerTank);
      keysToggle[key.keyCode] = null;
    } else {
      playerTank.rotate();
    }
  } else if (keysToggle[key.keyCode] == 87) {
    playerTank.directionPrev = playerTank.direction;
    playerTank.direction = "top";
    if (
      playerTank.directionPrev == "right" ||
      playerTank.directionPrev == "left"
    ) {
      rotateCoordsVertical(playerTank);
      checkCollision(playerTank);
      log(playerTank.collision);
    }

    if (
      playerTank.collision.isCollidedBottom ||
      playerTank.collision.isCollidedTop
    ) {
      playerTank.directionPrev = directionPrevRestore;
      playerTank.direction = directionRestore;
      removeCollision(playerTank);
      rotateCoordsHorizontal(playerTank);
      keysToggle[key.keyCode] = null;
    } else {
      playerTank.rotate();
    }
  } else if (keysToggle[key.keyCode] == 83) {
    playerTank.directionPrev = playerTank.direction;
    playerTank.direction = "bottom";
    if (
      playerTank.directionPrev == "right" ||
      playerTank.directionPrev == "left"
    ) {
      rotateCoordsVertical(playerTank);
      checkCollision(playerTank);
      log(playerTank.collision);
    }

    if (
      playerTank.collision.isCollidedBottom ||
      playerTank.collision.isCollidedTop
    ) {
      playerTank.directionPrev = directionPrevRestore;
      playerTank.direction = directionRestore;
      removeCollision(playerTank);
      rotateCoordsHorizontal(playerTank);
      keysToggle[key.keyCode] = null;
    } else {
      playerTank.rotate();
    }
  }
}

function onKeyUp(key) {
  var keysCount = 0;
  for (let key in keysToggle) {
    if (keysToggle[key]) keysCount++;
  }
  if (keysCount > 1)
    console.log("multiple keys toggled: " + keysCount + keysToggle);

  if (keysToggle.hasOwnProperty(key.keyCode)) keysToggle[key.keyCode] = null;
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

var playerTank;

function clearLevel() {
  playerTank = null;
  tanks = [];
  walls = [];
}

function startLevel() {
  createWalls();
  playerTank = createTank(
    true,
    getFreePosition(),
    playerDirection,
    playerColor,
    playerTurretColor,
    tanks
  );
  createNPCTanks();
}

setInterval(clearProjectiles, 5000);
startLevel();
update();
