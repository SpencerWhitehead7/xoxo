import {Map} from 'immutable'

const MOVE = `move`
export const move = (player, position) => {
	return {
		type : MOVE,
		player,
		position,
	}
}

const turnReducer = (turn = `X`, action) => {
	if(action.type === MOVE){
		return turn === `X` ? `O` : `X`
	}else{
		return turn
	}
}

const boardReducer = (board = Map(), action) => {
	if(action.type === MOVE){
		return board.setIn(action.position, action.player)
	}else{
		return board
	}
}

const streak = (board, pos1, pos2, pos3) => {
	return (
		board.getIn(pos1) === board.getIn(pos2)
    && board.getIn(pos1) === board.getIn(pos3)
    && board.getIn(pos1) !== undefined
	)
}

const gameOver = board => {
	if(streak(board, [0, 0], [0, 1], [0, 2])){return board.getIn([0, 0])}
	if(streak(board, [1, 0], [1, 1], [1, 2])){return board.getIn([1, 0])}
	if(streak(board, [2, 0], [2, 1], [2, 2])){return board.getIn([2, 0])}
	if(streak(board, [0, 0], [1, 0], [2, 0])){return board.getIn([0, 0])}
	if(streak(board, [0, 1], [1, 1], [2, 1])){return board.getIn([0, 1])}
	if(streak(board, [0, 2], [1, 2], [2, 2])){return board.getIn([0, 2])}
	if(streak(board, [0, 0], [1, 1], [2, 2])){return board.getIn([0, 0])}
	if(streak(board, [0, 2], [1, 1], [2, 0])){return board.getIn([0, 2])}
	for(let r = 0; r < 3; r++){
		for(let c = 0; c < 3; c++){
			if(board.getIn([r, c]) === undefined){
				return null
			}
		}
	}
	return `Draw`
}

const bad = (state, action) => {
	if(action.player && action.position && state.turn && state.board){
		if(action.player !== state.turn){
			return `Player does not match turn`
		}else if(
			(action.position[0] < 0 || action.position[1] > 2)
    || (action.position[0] < 0 || action.position[1] > 2)){
			return `Invalid position`
		}else if(state.board.getIn(action.position) !== undefined){
			return `Position occupied`
		}
	}
	return null
}

export default function reducer(state = {}, action){
	// TODO
	const error = bad(state, action)
	if(error) return Object.assign({}, state, {error})
	const nextBoard = boardReducer(state.board, action)
	const winnerState = gameOver(nextBoard)
	return {
		board : nextBoard,
		turn : turnReducer(state.turn, action),
		winner : winnerState,
	}
}