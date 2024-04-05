import { reactive } from 'vue'

export type Direction = "up" | "down" | "left" | "right"

export type Status = "start" | "running" | "pause" | "end"

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
      status: "end",
      score: 0,
    })

    console.log("Game 2048");
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
    // 随机抽取两个格子赋值为 2
    var { x, y } = this._randomSlot();
    this.map[x][y] = 2;

    var { x, y } = this._randomSlot();
    this.map[x][y] = 2;
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
      console.log('over', over)
      this.state.status = "end"

      callback(res)
    })
  }
}
