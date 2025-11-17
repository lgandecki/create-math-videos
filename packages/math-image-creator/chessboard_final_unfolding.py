from manim import *

class ChessboardFinalUnfolding(Scene):
    def construct(self):
        # Title
        title = Text("The Final Unfolding", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create a simplified 6x6 chessboard focused on the last square
        board_size = 6
        square_size = 0.8
        board = VGroup()
        
        # Create the board with alternating colors
        for row in range(board_size):
            for col in range(board_size):
                square = Rectangle(width=square_size, height=square_size)
                if (row + col) % 2 == 0:
                    square.set_fill(WHITE, opacity=0.8)
                else:
                    square.set_fill(GRAY, opacity=0.8)
                square.set_stroke(BLACK, width=1)
                square.move_to([
                    (col - board_size/2 + 0.5) * square_size,
                    (board_size/2 - row - 0.5) * square_size,
                    0
                ])
                board.add(square)
        
        board.scale(0.7).shift(LEFT * 3)
        self.play(Create(board))
        self.wait(1)
        
        # Highlight Square 36 (bottom-right corner)
        square_36 = board[-1].copy()  # Last square
        highlight = square_36.copy()
        highlight.set_stroke(RED, width=8)
        highlight.set_fill(YELLOW, opacity=0.5)
        
        self.play(Create(highlight))
        
        # Label Square 36
        square_label = Text("Square 36", font_size=24, color=RED)
        square_label.next_to(highlight, DOWN, buff=0.3)
        self.play(Write(square_label))
        self.wait(1)
        
        # Display the calculation
        calculation = MathTex(r"36^2 = 1296", font_size=36, color=GREEN)
        calculation.move_to(RIGHT * 2 + UP * 2)
        self.play(Write(calculation))
        self.wait(1)
        
        calculation_text = Text("On Square 36: 1296 grains!", font_size=28, color=GREEN)
        calculation_text.next_to(calculation, DOWN, buff=0.5)
        self.play(Write(calculation_text))
        self.wait(1)
        
        # Create a massive pile of grains on the final square
        grains = VGroup()
        
        # Create multiple layers of dots to represent grains
        for layer in range(8):
            layer_grains = VGroup()
            for i in range(20 - layer * 2):  # Decreasing number per layer
                grain = Dot(radius=0.02, color=YELLOW)
                angle = i * TAU / (20 - layer * 2)
                radius = 0.15 + layer * 0.03
                grain.move_to([
                    highlight.get_center()[0] + radius * np.cos(angle),
                    highlight.get_center()[1] + radius * np.sin(angle) + layer * 0.05,
                    0
                ])
                layer_grains.add(grain)
            grains.add(layer_grains)
        
        # Animate grains appearing layer by layer
        for layer in grains:
            self.play(FadeIn(layer), run_time=0.3)
        self.wait(1)
        
        # Show comparison - single grain vs massive pile
        single_grain = Dot(radius=0.05, color=YELLOW)
        single_grain.move_to(LEFT * 5 + UP * 1)
        single_grain_label = Text("1 grain\n(Square 1)", font_size=20, color=WHITE)
        single_grain_label.next_to(single_grain, DOWN, buff=0.2)
        
        self.play(FadeIn(single_grain), Write(single_grain_label))
        
        # Arrow pointing from single grain to massive pile
        comparison_arrow = Arrow(single_grain.get_right(), highlight.get_left(), color=WHITE)
        self.play(Create(comparison_arrow))
        
        massive_pile_label = Text("1296 grains\n(Square 36)", font_size=20, color=WHITE)
        massive_pile_label.next_to(highlight, RIGHT, buff=0.5)
        self.play(Write(massive_pile_label))
        self.wait(2)
        
        # Clear some elements to make room for the final total
        self.play(
            FadeOut(single_grain),
            FadeOut(single_grain_label),
            FadeOut(comparison_arrow),
            FadeOut(calculation),
            FadeOut(calculation_text)
        )
        
        # Reveal the final cumulative total
        total_calculation = MathTex(
            r"\text{Total grains} = \sum_{i=1}^{36} i^2",
            font_size=32,
            color=BLUE
        )
        total_calculation.move_to(RIGHT * 2 + UP * 2.5)
        self.play(Write(total_calculation))
        self.wait(1)
        
        # Show the formula
        formula = MathTex(
            r"= \frac{36 \times 37 \times 73}{6}",
            font_size=28,
            color=BLUE
        )
        formula.next_to(total_calculation, DOWN, buff=0.3)
        self.play(Write(formula))
        self.wait(1)
        
        # Show the final impressive number
        final_total = MathTex(r"= 16,206", font_size=48, color=RED)
        final_total.next_to(formula, DOWN, buff=0.5)
        
        # Make the final number very prominent
        final_box = SurroundingRectangle(final_total, color=RED, buff=0.3)
        final_box.set_stroke(width=4)
        
        self.play(Write(final_total))
        self.play(Create(final_box))
        self.wait(1)
        
        # Add emphasis text
        emphasis = Text("16,206 GRAINS TOTAL!", font_size=36, color=RED)
        emphasis.next_to(final_box, DOWN, buff=0.5)
        self.play(Write(emphasis))
        self.wait(1)
        
        # Final comparison text
        comparison_text = VGroup(
            Text("From 1 grain on the first square...", font_size=24, color=WHITE),
            Text("...to 1,296 grains on the last square...", font_size=24, color=WHITE),
            Text("...totaling 16,206 grains across all squares!", font_size=24, color=YELLOW)
        )
        comparison_text.arrange(DOWN, buff=0.3)
        comparison_text.to_edge(DOWN, buff=1)
        
        for line in comparison_text:
            self.play(Write(line), run_time=1.5)
            self.wait(0.5)
        
        # Final dramatic pause
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(Group(*self.mobjects)))
        self.wait(1)