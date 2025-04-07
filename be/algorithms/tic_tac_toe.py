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