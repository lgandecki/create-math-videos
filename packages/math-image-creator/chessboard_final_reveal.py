from manim import *
import numpy as np

class ChessboardFinalReveal(Scene):
    def construct(self):
        # Title
        title = Text("The Final Reveal", font_size=48, color=YELLOW)
        subtitle = Text("The Complete Chessboard", font_size=32, color=GOLD)
        title_group = VGroup(title, subtitle).arrange(DOWN, buff=0.3)
        title_group.to_edge(UP)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title_group))
        
        # Create a simplified chessboard visual
        def create_chessboard():
            board = VGroup()
            for i in range(8):
                for j in range(8):
                    square = Square(side_length=0.35)
                    square.move_to(RIGHT * (j - 3.5) * 0.35 + UP * (3.5 - i) * 0.35)
                    
                    # Alternate colors (chessboard pattern)
                    if (i + j) % 2 == 0:
                        square.set_fill(WHITE, opacity=0.8)
                        square.set_stroke(BLACK, width=1)
                    else:
                        square.set_fill(GRAY, opacity=0.8)
                        square.set_stroke(BLACK, width=1)
                    
                    board.add(square)
            return board
        
        # Create the board
        board = create_chessboard()
        board.shift(LEFT * 2 + UP * 0.5)
        
        self.play(Create(board))
        self.wait(1)
        
        # Add grain visualization (dots representing massive amounts)
        grains = VGroup()
        for square in board:
            # Add small dots to represent grains
            for _ in range(4):  # Just a few dots per square for visualization
                dot = Dot(radius=0.02, color=YELLOW)
                dot.move_to(square.get_center() + 
                           np.random.uniform(-0.15, 0.15, 3) * np.array([1, 1, 0]))
                grains.add(dot)
        
        self.play(Create(grains), run_time=2)
        self.wait(1)
        
        # Highlight specific squares and show their values
        # Square 60
        square_60_highlight = board[59].copy()  # 60th square (0-indexed)
        square_60_highlight.set_stroke(RED, width=4)
        
        self.play(Create(square_60_highlight))
        
        square_60_text = Text("Square 60:", font_size=24, color=WHITE)
        square_60_value = Text("576,460,752,303,423,488 grains", 
                              font_size=20, color=YELLOW)
        square_60_group = VGroup(square_60_text, square_60_value)
        square_60_group.arrange(DOWN, buff=0.1)
        square_60_group.to_edge(LEFT).shift(DOWN * 1)
        
        self.play(Write(square_60_group))
        self.wait(2)
        
        # Square 64
        square_64_highlight = board[63].copy()  # 64th square (0-indexed)
        square_64_highlight.set_stroke(BLUE, width=4)
        
        self.play(Create(square_64_highlight))
        
        square_64_text = Text("Square 64:", font_size=24, color=WHITE)
        square_64_value = Text("9,223,372,036,854,775,808 grains", 
                              font_size=20, color=BLUE)
        square_64_group = VGroup(square_64_text, square_64_value)
        square_64_group.arrange(DOWN, buff=0.1)
        square_64_group.to_edge(RIGHT).shift(DOWN * 1)
        
        self.play(Write(square_64_group))
        self.wait(2)
        
        # Grand total reveal
        self.play(FadeOut(square_60_group), FadeOut(square_64_group))
        
        total_title = Text("GRAND TOTAL", font_size=36, color=RED, weight=BOLD)
        total_title.shift(DOWN * 1.5)
        
        total_value = Text("Over 18 Quintillion Grains!", 
                          font_size=32, color=YELLOW, weight=BOLD)
        total_value.shift(DOWN * 2.2)
        
        self.play(Write(total_title))
        self.play(Write(total_value), run_time=2)
        self.wait(2)
        
        # Context comparison
        context_text = Text("This is far more than all the rice\nproduced in the world in centuries!", 
                           font_size=24, color=GREEN)
        context_text.shift(DOWN * 3.2)
        
        self.play(Write(context_text))
        self.wait(3)
        
        # Final dramatic effect - make the board "overflow" with grains
        explosion_grains = VGroup()
        for _ in range(100):
            dot = Dot(radius=0.05, color=YELLOW)
            dot.move_to(board.get_center() + 
                       np.random.uniform(-4, 4, 3) * np.array([1, 1, 0]))
            explosion_grains.add(dot)
        
        self.play(Create(explosion_grains, lag_ratio=0.05), run_time=3)
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(VGroup(*self.mobjects)))
        self.wait(1)