from manim import *

class AdditionOnNumberLine(Scene):
    def construct(self):
        # Create number line
        number_line = NumberLine(
            x_range=[-3, 10, 1],
            length=12,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
        )
        number_line.move_to(ORIGIN)
        
        # Add number line to scene
        self.play(Create(number_line))
        self.wait(1)
        
        # First example: 3 + 5 = ?
        equation1 = Text("3 + 5 = ?", font_size=48)
        equation1.to_edge(UP, buff=1)
        
        self.play(Write(equation1))
        self.wait(1)
        
        # Show explanation text
        explanation1 = Text("For addition, we start at the first number.", font_size=24)
        explanation1.to_edge(UP, buff=2.5)
        
        self.play(Write(explanation1))
        self.wait(1)
        
        # Create starting dot at position 3
        start_dot = Dot(color=BLUE, radius=0.1)
        start_dot.move_to(number_line.number_to_point(3))
        
        self.play(Create(start_dot))
        self.wait(1)
        
        # Create arrow from 3 to 8 (3 + 5)
        arrow_start = number_line.number_to_point(3)
        arrow_end = number_line.number_to_point(8)
        arrow = Arrow(arrow_start, arrow_end, color=GREEN, buff=0.1)
        arrow.shift(UP * 0.5)  # Move arrow slightly above the number line
        
        # Show explanation for movement
        explanation2 = Text("Then, we move to the right by the second number.\nFive steps to the right from three...", font_size=24)
        explanation2.to_edge(UP, buff=2.5)
        
        self.play(Transform(explanation1, explanation2))
        self.wait(1)
        
        # Animate the arrow and highlight numbers
        self.play(Create(arrow))
        
        # Highlight numbers 4, 5, 6, 7, 8 as we pass them
        numbers_to_highlight = [4, 5, 6, 7, 8]
        highlights = []
        
        for num in numbers_to_highlight:
            highlight = Circle(radius=0.3, color=YELLOW)
            highlight.move_to(number_line.number_to_point(num))
            highlights.append(highlight)
            self.play(Create(highlight), run_time=0.3)
        
        self.wait(1)
        
        # Move dot to final position
        self.play(start_dot.animate.move_to(number_line.number_to_point(8)))
        self.wait(1)
        
        # Show completed equation
        completed_equation1 = Text("3 + 5 = 8", font_size=48)
        completed_equation1.to_edge(UP, buff=1)
        
        self.play(Transform(equation1, completed_equation1))
        self.wait(2)
        
        # Clear the scene for second example
        self.play(
            FadeOut(explanation1),
            FadeOut(arrow),
            FadeOut(start_dot),
            *[FadeOut(highlight) for highlight in highlights]
        )
        
        # Second example: -2 + 6 = ?
        equation2 = Text("-2 + 6 = ?", font_size=48)
        equation2.to_edge(UP, buff=1)
        
        self.play(Transform(equation1, equation2))
        self.wait(1)
        
        # Create starting dot at position -2
        start_dot2 = Dot(color=BLUE, radius=0.1)
        start_dot2.move_to(number_line.number_to_point(-2))
        
        self.play(Create(start_dot2))
        self.wait(1)
        
        # Create arrow from -2 to 4 (-2 + 6)
        arrow_start2 = number_line.number_to_point(-2)
        arrow_end2 = number_line.number_to_point(4)
        arrow2 = Arrow(arrow_start2, arrow_end2, color=GREEN, buff=0.1)
        arrow2.shift(UP * 0.5)  # Move arrow slightly above the number line
        
        self.play(Create(arrow2))
        
        # Highlight numbers -1, 0, 1, 2, 3, 4 as we pass them
        numbers_to_highlight2 = [-1, 0, 1, 2, 3, 4]
        highlights2 = []
        
        for num in numbers_to_highlight2:
            highlight = Circle(radius=0.3, color=YELLOW)
            highlight.move_to(number_line.number_to_point(num))
            highlights2.append(highlight)
            self.play(Create(highlight), run_time=0.3)
        
        self.wait(1)
        
        # Move dot to final position
        self.play(start_dot2.animate.move_to(number_line.number_to_point(4)))
        self.wait(1)
        
        # Show completed equation
        completed_equation2 = Text("-2 + 6 = 4", font_size=48)
        completed_equation2.to_edge(UP, buff=1)
        
        self.play(Transform(equation1, completed_equation2))
        self.wait(3)