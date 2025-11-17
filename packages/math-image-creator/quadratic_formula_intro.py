from manim import *

class QuadraticFormulaIntro(Scene):
    def construct(self):
        # Create the title
        title = Text("The Quadratic Formula", font_size=48, color=BLUE)
        title.to_edge(UP, buff=1)
        
        # Create the quadratic formula
        formula = MathTex(
            r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
            font_size=60,
            color=YELLOW
        ).shift(UP * 1)
        
        # Create the standard quadratic equation
        equation = MathTex(
            r"ax^2 + bx + c = 0",
            font_size=48,
            color=GREEN
        ).shift(DOWN * 0.5)
        
        # Create explanatory text
        explanation = Text(
            "This formula helps solve for 'x' in any quadratic equation",
            font_size=32,
            color=WHITE
        ).shift(DOWN * 2.5)
        
        # Animate the introduction
        self.play(Write(title), run_time=2)
        self.wait(1)
        
        self.play(Write(formula), run_time=3)
        self.wait(1)
        
        self.play(Write(equation), run_time=2)
        self.wait(1)
        
        self.play(Write(explanation), run_time=2.5)
        self.wait(3)
        
        # Final pause to view all elements
        self.wait(2)