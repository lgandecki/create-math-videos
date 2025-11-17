from manim import *

class LinearEquationConclusion(Scene):
    def construct(self):
        # Display the equation y = mx + b prominently
        equation = MathTex("y = mx + b", font_size=72, color=BLUE)
        equation.to_edge(UP, buff=1)
        
        # Create summary text
        summary = Text(
            "Every straight line can be described by its slope (m) and y-intercept (b).",
            font_size=32,
            color=WHITE
        )
        summary.next_to(equation, DOWN, buff=1)
        
        # Create slope explanation
        slope_text = Text(
            "m = Slope (steepness/direction)",
            font_size=28,
            color=GREEN
        )
        slope_text.next_to(summary, DOWN, buff=1)
        
        # Create y-intercept explanation
        intercept_text = Text(
            "b = Y-intercept (where it crosses the Y-axis)",
            font_size=28,
            color=YELLOW
        )
        intercept_text.next_to(slope_text, DOWN, buff=0.5)
        
        # Animate the content
        self.play(Write(equation), run_time=2)
        self.wait(1)
        
        self.play(Write(summary), run_time=3)
        self.wait(1)
        
        self.play(Write(slope_text), run_time=2)
        self.wait(1)
        
        self.play(Write(intercept_text), run_time=2)
        self.wait(2)
        
        # Final pause to let viewers read
        self.wait(3)