import copy

def check_winner(board):
    for row in board:
        if row[0] == row[1] == row[2] != '':
            return row[0]
    for col in zip(*board):
        if col[0] == col[1] == col[2] != '':
            return col[0]
    if board[0][0] == board[1][1] == board[2][2] != '':
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != '':
        return board[0][2]
    return None

def is_draw(board):
    return all(cell != '' for row in board for cell in row)

def make_move(board, x, y, player):
    if board[x][y] == '':
        board[x][y] = player
        return True
    return False

def minimax(board, is_maximizing, ai_player, human_player):
    winner = check_winner(board)
    if winner == ai_player:
        return 1, None
    elif winner == human_player:
        return -1, None
    elif is_draw(board):
        return 0, None

    best_score = float('-inf') if is_maximizing else float('inf')
    best_move = None

    for i in range(3):
        for j in range(3):
            if board[i][j] == '':
                board[i][j] = ai_player if is_maximizing else human_player
                score, _ = minimax(board, not is_maximizing, ai_player, human_player)
                board[i][j] = ''

                if is_maximizing:
                    if score > best_score:
                        best_score = score
                        best_move = (i, j)
                else:
                    if score < best_score:
                        best_score = score
                        best_move = (i, j)

    return best_score, best_move

def get_computer_move(board, ai_player='O', human_player='X'):
    _, move = minimax(copy.deepcopy(board), True, ai_player, human_player)
    return move  # returns (x, y)