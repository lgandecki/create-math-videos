from manim import *

class ChessboardDoubling(Scene):
    def construct(self):
        # Title
        title = Text("Section: Doubling Begins", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create first row of chessboard (8 squares)
        squares = VGroup()
        square_size = 0.8
        start_x = -3.2  # Position to center 8 squares
        
        # Create 8 squares in a row
        for i in range(8):
            square = Square(side_length=square_size)
            square.move_to([start_x + i * square_size, 0, 0])
            
            # Alternate colors (chessboard pattern)
            if i % 2 == 0:
                square.set_fill(WHITE, opacity=0.8)
                square.set_stroke(BLACK, width=2)
            else:
                square.set_fill(GRAY, opacity=0.6)
                square.set_stroke(BLACK, width=2)
            
            squares.add(square)
        
        # Add square labels (A1, B1, C1, etc.)
        square_labels = VGroup()
        labels = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1']
        for i, label in enumerate(labels):
            label_text = Text(label, font_size=20, color=BLACK)
            label_text.move_to([start_x + i * square_size, -0.6, 0])
            square_labels.add(label_text)
        
        # Show the chessboard
        self.play(Create(squares))
        self.play(Write(square_labels))
        self.wait(1)
        
        # Start with square 1 (A1) - create the first grain that stays visible
        square_1_text = Text("Square 1: 1 Grain (starting point)", font_size=24, color=GREEN)
        square_1_text.to_edge(DOWN)
        self.play(Write(square_1_text))
        
        # Highlight first square briefly
        highlight_1 = squares[0].copy().set_stroke(GREEN, width=6)
        self.play(Create(highlight_1))
        
        # Create the first grain (green initially) and keep it visible
        first_grain = Dot(radius=0.04, color=GREEN)
        first_grain.move_to([start_x, 0, 0])  # Position in first square
        self.play(FadeIn(first_grain))
        self.wait(1)
        self.play(FadeOut(highlight_1), FadeOut(square_1_text))
        
        # Data for each square (square number, grains count)
        square_data = [
            (2, 2, "Square 2: 2 Grains"),
            (3, 4, "Square 3: 4 Grains"), 
            (4, 8, "Square 4: 8 Grains"),
            (5, 16, "Square 5: 16 Grains"),
            (6, 32, "Square 6: 32 Grains"),
            (7, 64, "Square 7: 64 Grains"),
            (8, 128, "Square 8: 128 Grains")
        ]
        
        # Container for grain representations and text
        all_grains = VGroup()
        # Add the first grain to the all_grains group for later management
        all_grains.add(first_grain)
        
        # Animate each square
        for square_num, grain_count, display_text in square_data:
            square_index = square_num - 1  # Convert to 0-based index
            
            # Change first grain color to yellow when we start with square 2
            if square_num == 2:
                self.play(first_grain.animate.set_color(YELLOW))
            
            # Highlight current square
            highlight = squares[square_index].copy().set_stroke(YELLOW, width=6)
            self.play(Create(highlight))
            
            # Create grain representation (small dots)
            grains = VGroup()
            
            # For small numbers, show individual grains
            if grain_count <= 16:
                # Arrange grains in a grid pattern within the square
                rows = int(grain_count ** 0.5) + 1
                cols = (grain_count + rows - 1) // rows
                
                for i in range(grain_count):
                    row = i // cols
                    col = i % cols
                    
                    grain = Dot(radius=0.04, color=YELLOW)
                    # Position within the square
                    grain_x = start_x + square_index * square_size + (col - cols/2 + 0.5) * 0.1
                    grain_y = (row - rows/2 + 0.5) * 0.1
                    grain.move_to([grain_x, grain_y, 0])
                    grains.add(grain)
            else:
                # For larger numbers, show a cluster representation
                cluster = Circle(radius=0.25, color=YELLOW, fill_opacity=0.7)
                cluster.move_to([start_x + square_index * square_size, 0, 0])
                
                # Add number in the center
                number_text = Text(str(grain_count), font_size=16, color=BLACK)
                number_text.move_to(cluster.get_center())
                
                grains.add(cluster, number_text)
            
            # Animate grains appearing
            self.play(FadeIn(grains), run_time=0.8)
            all_grains.add(grains)
            
            # Display the count text
            count_text = Text(display_text, font_size=28, color=WHITE)
            count_text.to_edge(DOWN)
            self.play(Write(count_text))
            self.wait(1.5)
            
            # Remove highlight and text before next iteration
            self.play(FadeOut(highlight), FadeOut(count_text))
        
        # Show the doubling pattern formula
        self.wait(1)
        pattern_text = Text("Doubling Pattern: Each square has twice the grains of the previous!", 
                          font_size=32, color=ORANGE)
        pattern_text.to_edge(DOWN)
        self.play(Write(pattern_text))
        
        # Show mathematical formula
        formula = MathTex(r"Grains = 2^{n-1}", font_size=36, color=RED)
        formula.next_to(pattern_text, UP, buff=0.5)
        self.play(Write(formula))
        
        self.wait(3)
        
        # Final highlight showing the exponential growth
        final_highlight = VGroup()
        for i in range(8):
            highlight = squares[i].copy().set_stroke(RED, width=4)
            final_highlight.add(highlight)
        
        self.play(Create(final_highlight))
        self.wait(2)
        
        # Clean fade out
        self.play(
            FadeOut(final_highlight),
            FadeOut(all_grains),
            FadeOut(squares),
            FadeOut(square_labels),
            FadeOut(title),
            FadeOut(pattern_text),
            FadeOut(formula)
        )
        self.wait(1)