from manim import *

class ChessboardSetup(Scene):
    def construct(self):
        # Create an 8x8 chessboard using arrange_in_grid for proper spacing
        squares = VGroup()
        square_size = 0.8
        
        # Create 64 squares (8 rows × 8 columns)
        for i in range(64):
            row = i // 8  # Calculate row (0-7)
            col = i % 8   # Calculate column (0-7)
            
            square = Square(side_length=square_size)
            
            # Alternate colors for chessboard pattern
            if (row + col) % 2 == 0:
                square.set_fill(WHITE, opacity=1)
                square.set_stroke(BLACK, width=2)
            else:
                square.set_fill(GRAY, opacity=1)
                square.set_stroke(BLACK, width=2)
            
            squares.add(square)
        
        # Arrange squares in proper 8x8 grid with no spacing between squares
        squares.arrange_in_grid(
            rows=8,
            cols=8,
            buff=0,  # No spacing for traditional chessboard look
            flow_order="rd"  # Fill right then down (standard reading order)
        )
        
        # Center the entire board
        squares.move_to(ORIGIN)
        
        # Show the empty chessboard
        self.play(Create(squares, lag_ratio=0.02))
        self.wait(1)
        
        # Create a grain of rice (small yellow dot)
        grain = Circle(radius=0.15, color=YELLOW)
        grain.set_fill(YELLOW, opacity=1)
        grain.set_stroke(ORANGE, width=2)
        
        # Position for square A1 (bottom-left corner)
        # In the arrange_in_grid with flow_order="rd", A1 is at index 56 (row 7, col 0)
        a1_index = 7 * 8 + 0  # row 7, column 0 = index 56
        a1_position = squares[a1_index].get_center()
        
        # Animate bringing in the grain of rice
        grain.move_to(UP * 4)  # Start from above
        self.play(FadeIn(grain))
        self.play(grain.animate.move_to(a1_position))
        
        # Display the text "Square 1: 1 Grain"
        text = Text("Square 1: 1 Grain", font_size=36, color=WHITE)
        text.to_edge(UP, buff=0.5)
        
        self.play(Write(text))
        self.wait(2)