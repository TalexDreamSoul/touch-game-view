import { reactive } from 'vue'

export type Direction = "up" | "down" | "left" | "right"

export type Status = "start" | "pending" | "end"

export interface Track {
  from: [number, number]
  to: [number, number]
}

export interface GameState {
  status: Status
  score: number
}

export class Game2048 {
  map: Array<Array<number>>
  state: GameState

  directions = {
    'up': (i: number, j: number) => [i + 1, j],
    'down': (i: number, j: number) => [i - 1, j],
    'left': (i: number, j: number) => [i, j + 1],
    'right': (i: number, j: number) => [i, j - 1],
  }

  constructor() {
    this.map = reactive([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    this.state = reactive({
      status: "pending",
      score: 0,
    })

    // console.log("Game 2048");
  }

  _randomSlot() {
    const rows = this.map.length
    const cols = this.map[0].length

    let x = Math.floor(Math.random() * rows);
    let y = Math.floor(Math.random() * cols);

    return { x, y };
  }

  isGameOver(board) {
    // 检查棋盘上是否还有空格
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          return false; // 存在空格，游戏未结束
        }
      }
    }

    // 检查是否有可以合并的相邻方块
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        // 检查上方方块
        if (i > 0 && board[i][j] === board[i - 1][j]) {
          return false; // 存在可合并的相邻方块，游戏未结束
        }
        // 检查下方方块
        if (i < board.length - 1 && board[i][j] === board[i + 1][j]) {
          return false; // 存在可合并的相邻方块，游戏未结束
        }
        // 检查左侧方块
        if (j > 0 && board[i][j] === board[i][j - 1]) {
          return false; // 存在可合并的相邻方块，游戏未结束
        }
        // 检查右侧方块
        if (j < board[i].length - 1 && board[i][j] === board[i][j + 1]) {
          return false; // 存在可合并的相邻方块，游戏未结束
        }
      }
    }

    // 如果没有空格，且没有可以合并的相邻方块，游戏结束

    return true;
  }

  start() {
    let __map = localStorage.getItem('__map')
    if (__map?.length) {
      Object.assign(this.map, JSON.parse(__map))

      const __state = JSON.parse(localStorage.getItem('__state')!)
      Object.assign(this.state, __state)
    } else {
      Object.assign(this.map, [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])

      // 随机抽取两个格子赋值为 2
      var { x, y } = this._randomSlot();
      this.map[x][y] = 2;

      var { x, y } = this._randomSlot();
      this.map[x][y] = 2;
    }

    this.state.score = 0
    this.state.status = 'start'
  }

  move(direction: Direction) {
    const rows = this.map.length
    const cols = this.map[0].length

    const tracks = new Array<Track | null>()

    const _inRange = (i: number, j: number) => {
      const rows = this.map.length
      const cols = this.map[0].length

      return i >= 0 && i < rows && j >= 0 && j < cols
    }

    const _nextNoneZero = (i: number, j: number, d: Direction) => {
      let [nextI, nextJ] = this.directions[d](i, j)
      if (!_inRange(nextI, nextJ)) return null

      while (_inRange(nextI, nextJ)) {
        const value = this.map[nextI][nextJ]
        if (value !== 0) {
          return [nextI, nextJ, value]
        }

        [nextI, nextJ] = this.directions[d](nextI, nextJ)
      }

      return null;
    }

    const _cal = (direction: Direction, i: number, j: number) => {
      if (!_inRange(i, j)) return

      const next = _nextNoneZero(i, j, direction)
      if (next) {
        const [nextI, nextJ, nextValue] = next
        if (this.map[i][j] === 0) {
          this.map[i][j] = nextValue
          this.map[nextI][nextJ] = 0
          _cal(direction, i, j)

          tracks.push({
            to: [j, i],
            from: [nextJ, nextI]
          })
        } else if (this.map[i][j] === nextValue) {
          this.map[i][j] *= 2;
          this.map[nextI][nextJ] = 0;

          tracks.push({
            to: [j, i],
            from: [nextJ, nextI]
          })

          this.state.score += this.map[i][j]
        }
      }

      const [ni, nj] = this.directions[direction](i, j)
      _cal(direction, ni, nj)
    }

    if (direction === 'up') {
      for (let j = 0; j < cols; ++j) {
        _cal(direction, 0, j)
      }
    } else if (direction === 'down') {
      for (let j = 0; j < cols; ++j) {
        _cal(direction, rows - 1, j)
      }
    } else if (direction === 'left') {
      for (let i = 0; i < rows; ++i) {
        _cal(direction, i, 0)
      }
    } else if (direction === 'right') {
      for (let i = 0; i < rows; ++i) {
        _cal(direction, i, cols - 1)
      }
    }

    // 如果没有 tracks 就代表着没有方块移动 不生成方块
    if (!tracks.length) return null

    // 随机一个地方生成
    let obj = this._randomSlot()
    let amo = 0

    while (this.map[obj.x][obj.y] !== 0) {
      if (amo >= rows * cols) return null

      obj = this._randomSlot()
      amo += 1;
    }

    // 30%的概率生成 4

    this.map[obj.x][obj.y] =
      Math.random() < 0.3 ? 4 : 2

    return tracks
  }

  listenTouch(callback: Function) {
    // 判断滑动手势
    var startx: number, starty: number;
    //获得角度
    function getAngle(angx: number, angy: number) {
      return Math.atan2(angy, angx) * 180 / Math.PI;
    };

    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
    function getDirection(startx: number, starty: number, endx: number, endy: number) {
      var angx = endx - startx;
      var angy = endy - starty;
      var result = 0;

      //如果滑动距离太短
      if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result;
      }

      var angle = getAngle(angx, angy);
      if (angle >= -135 && angle <= -45) {
        result = 1;
      } else if (angle > 45 && angle < 135) {
        result = 2;
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
      } else if (angle >= -45 && angle <= 45) {
        result = 4;
      }

      return result;
    }

    //手指接触屏幕
    document.addEventListener("touchstart", function (e) {
      if (window._ignore) return

      startx = e.touches[0].pageX;
      starty = e.touches[0].pageY;
    }, false);

    // document.body.addEventListener('touchmove', function (e) {

    //   e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)

    // }, { passive: false })

    //手指离开屏幕
    document.addEventListener("touchend", (e) => {
      if (window._ignore) return

      var endx, endy;
      endx = e.changedTouches[0].pageX;
      endy = e.changedTouches[0].pageY;
      var direction = getDirection(startx, starty, endx, endy);

      let res

      switch (direction) {
        case 0:
          e.preventDefault();
          // alert("未滑动！");
          break;
        case 1:
          res = this.move('up')
          break;
        case 2:
          res = this.move('down')
          break;
        case 3:
          res = this.move('left')
          break;
        case 4:
          res = this.move('right')
          break;
        default:
      }

      const over = this.isGameOver(this.map)
      if (over)
        this.state.status = "end"

      callback(res)

    }, false);
  }

  listen(_callback: Function) {
    const callback = (res: any) => {
      localStorage.setItem('__map', JSON.stringify(this.map))
      localStorage.setItem('__state', JSON.stringify(this.state))

      _callback(res)
    }

    this.listenTouch(callback)
    this.listenKeyboard(callback)
  }

  listenKeyboard(callback: Function) {
    document.addEventListener('keydown', (e) => {
      let res
      switch (e.key) {
        case 'ArrowUp':
          res = this.move('up')
          break;
        case 'ArrowDown':
          res = this.move('down')
          break;
        case 'ArrowLeft':
          res = this.move('left')
          break;
        case 'ArrowRight':
          res = this.move('right')
          break;
      }

      const over = this.isGameOver(this.map)
      if (over)
        this.state.status = "end"

      callback(res)
    })
  }
}

const baseUrl = 'https://124.223.71.129:9981'

export function getUserStatus(user: string, cb: Function) {
  // 向 baseUrl/status 发送 get
  fetch(`${baseUrl}/games/2048/score/${user}`)
    .then(res => res.json())
    .then(data => {
      cb(data)
      console.log('data', data)
    })
    .catch(err => {
      console.log(err)
    })
}
