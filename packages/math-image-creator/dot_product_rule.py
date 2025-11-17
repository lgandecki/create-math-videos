from manim import *

class DotProductRule(Scene):
    def construct(self):
        # Title
        title = Text("The Dot Product Rule", font_size=48, color=YELLOW).to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Show Matrix A row vector
        matrix_a_label = Text("Matrix A:", font_size=36).shift(LEFT * 4 + UP * 2)
        row_vector = MathTex(r"[a, b]", font_size=40).next_to(matrix_a_label, RIGHT)
        
        self.play(Write(matrix_a_label))
        self.play(Write(row_vector))
        self.wait(1)
        
        # Highlight that this is a row vector
        row_explanation = Text("Generic row vector", font_size=24, color=BLUE).next_to(row_vector, DOWN)
        self.play(Write(row_explanation))
        self.wait(1)

        # Show Matrix B column vector
        matrix_b_label = Text("Matrix B:", font_size=36).shift(RIGHT * 2 + UP * 2)
        column_vector = MathTex(r"\begin{bmatrix} c \\ d \end{bmatrix}", font_size=40).next_to(matrix_b_label, RIGHT)
        
        self.play(Write(matrix_b_label))
        self.play(Write(column_vector))
        self.wait(1)
        
        # Highlight that this is a column vector
        column_explanation = Text("Generic column vector", font_size=24, color=GREEN).next_to(column_vector, DOWN)
        self.play(Write(column_explanation))
        self.wait(2)

        # Clear the explanations
        self.play(FadeOut(row_explanation), FadeOut(column_explanation))
        
        # Main explanation
        explanation = Text(
            'To find an element in the result matrix,\nwe take a "row" from the first matrix\nand a "column" from the second.',
            font_size=32,
            line_spacing=1.5
        ).shift(DOWN * 1.5)
        
        self.play(Write(explanation))
        self.wait(2)

        # Visual demonstration - highlight the row and column
        row_highlight = SurroundingRectangle(row_vector, color=BLUE, buff=0.1)
        column_highlight = SurroundingRectangle(column_vector, color=GREEN, buff=0.1)
        
        self.play(Create(row_highlight))
        self.wait(0.5)
        self.play(Create(column_highlight))
        self.wait(1)

        # Show the dot product calculation
        calculation_label = Text("Dot Product Calculation:", font_size=28).shift(DOWN * 3.5)
        calculation = MathTex(r"[a, b] \cdot \begin{bmatrix} c \\ d \end{bmatrix} = a \cdot c + b \cdot d", 
                             font_size=36).next_to(calculation_label, DOWN)
        
        self.play(Write(calculation_label))
        self.play(Write(calculation))
        self.wait(3)

        # Final pause
        self.wait(2)