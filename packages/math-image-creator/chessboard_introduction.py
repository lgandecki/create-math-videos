from manim import *

class ChessboardIntroduction(Scene):
    def construct(self):
        # Create title
        title = Text(
            "The Power of Accelerating Growth:\nGrains on a Chessboard",
            font_size=48,
            color=BLUE
        ).move_to(UP * 2)
        
        # Create subtitle
        subtitle = Text(
            "Even small beginnings can lead to\nastonishingly large numbers.",
            font_size=32,
            color=WHITE
        ).move_to(ORIGIN)
        
        # Create a 6x6 chessboard
        squares = VGroup()
        square_size = 0.4
        
        for row in range(6):
            for col in range(6):
                # Alternate colors for chessboard pattern
                if (row + col) % 2 == 0:
                    color = WHITE
                else:
                    color = GRAY
                
                square = Square(
                    side_length=square_size,
                    fill_color=color,
                    fill_opacity=0.8,
                    stroke_color=BLACK,
                    stroke_width=1
                )
                
                # Position the square
                x_pos = (col - 2.5) * square_size
                y_pos = (2.5 - row) * square_size - 1.5
                square.move_to([x_pos, y_pos, 0])
                
                squares.add(square)
        
        chessboard = squares
        
        # Animation sequence
        # 1. Display title
        self.play(Write(title), run_time=2)
        self.wait(1)
        
        # 2. Display subtitle
        self.play(Write(subtitle), run_time=2)
        self.wait(1.5)
        
        # 3. Show chessboard appearing in background
        self.play(
            title.animate.scale(0.7).move_to(UP * 3),
            subtitle.animate.scale(0.8).move_to(UP * 0.5),
            run_time=1
        )
        
        # 4. Create chessboard with animation
        self.play(Create(chessboard), run_time=3)
        self.wait(2)
        
        # 5. Final pause
        self.wait(1)