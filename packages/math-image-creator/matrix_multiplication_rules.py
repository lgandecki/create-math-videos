from manim import *

class MatrixMultiplicationRules(Scene):
    def construct(self):
        # Create title
        title = Text("Section: The Rules of Multiplication", font_size=36, color=BLUE)
        title.to_edge(UP, buff=0.8)
        
        # Create matrix A label
        matrix_label = Text("Matrix A (m × n):", font_size=28, color=WHITE)
        matrix_label.shift(UP * 1.5)
        
        # Create the general matrix A using MathTex for proper mathematical formatting
        matrix_a = MathTex(
            r"\begin{bmatrix}"
            r"a_{11} & a_{12} & \cdots & a_{1n} \\"
            r"a_{21} & a_{22} & \cdots & a_{2n} \\"
            r"\vdots & \vdots & \ddots & \vdots \\"
            r"a_{m1} & a_{m2} & \cdots & a_{mn}"
            r"\end{bmatrix}",
            font_size=32
        )
        matrix_a.shift(DOWN * 0.5)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Write(matrix_label))
        self.wait(0.5)
        
        self.play(Write(matrix_a))
        self.wait(3)
        
        # Hold the final display
        self.wait(2)