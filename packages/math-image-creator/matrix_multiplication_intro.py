from manim import *

class MatrixMultiplicationIntro(Scene):
    def construct(self):
        # Title
        title = Text("Matrix Multiplication", font_size=48, color=RED)
        title.to_edge(UP)
        
        # Create matrices A and B with specific values
        matrix_A = MathTex(
            r"\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}",
            font_size=36
        )
        matrix_B = MathTex(
            r"\begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}",
            font_size=36
        )
        
        # Labels for matrices
        label_A = Text("A =", font_size=32, color=GREEN)
        label_B = Text("B =", font_size=32, color=GREEN)
        
        # Position matrices side by side
        matrix_A.shift(LEFT * 2)
        label_A.next_to(matrix_A, LEFT)
        
        matrix_B.shift(RIGHT * 2)
        label_B.next_to(matrix_B, LEFT)
        
        # Explanatory text
        explanation = Text(
            "Multiplying matrices isn't just element-by-element.\nIt's a powerful tool for transformations and calculations.",
            font_size=24,
            color=YELLOW,
            line_spacing=1.2
        )
        explanation.to_edge(DOWN, buff=1)
        
        # Animations
        self.play(Write(title))
        self.wait(1)
        
        self.play(
            Write(label_A),
            Write(matrix_A)
        )
        self.wait(0.5)
        
        self.play(
            Write(label_B),
            Write(matrix_B)
        )
        self.wait(1)
        
        self.play(Write(explanation))
        self.wait(3)