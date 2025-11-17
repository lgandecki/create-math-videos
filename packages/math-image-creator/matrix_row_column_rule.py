from manim import *

class MatrixRowColumnRule(Scene):
    def construct(self):
        # Title
        title = Text("The 'Row by Column' Rule", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Generic matrix multiplication setup
        setup_text = Text("Matrix Multiplication: [A] × [B] = [C]", font_size=36, color=WHITE)
        setup_text.shift(UP * 2)
        self.play(Write(setup_text))
        self.wait(1)

        # Create matrices
        matrix_a = MathTex(r"\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}", font_size=48)
        matrix_b = MathTex(r"\begin{bmatrix} b_{11} & b_{12} \\ b_{21} & b_{22} \end{bmatrix}", font_size=48)
        equals = MathTex("=", font_size=48)
        matrix_c = MathTex(r"\begin{bmatrix} c_{11} & c_{12} \\ c_{21} & c_{22} \end{bmatrix}", font_size=48)

        # Position matrices
        matrix_a.shift(LEFT * 3)
        equals.next_to(matrix_a, RIGHT, buff=0.5)
        matrix_b.next_to(equals, RIGHT, buff=0.5)
        equals2 = MathTex("=", font_size=48)
        equals2.next_to(matrix_b, RIGHT, buff=0.5)
        matrix_c.next_to(equals2, RIGHT, buff=0.5)

        # Show matrices
        self.play(
            Write(matrix_a),
            Write(matrix_b),
            Write(equals),
            Write(equals2),
            Write(matrix_c)
        )
        self.wait(2)

        # Clear and show the core concept
        self.play(FadeOut(setup_text), FadeOut(matrix_a), FadeOut(matrix_b), FadeOut(equals), FadeOut(equals2), FadeOut(matrix_c))

        # Core concept explanation
        concept_text = Text("Core Concept:", font_size=36, color=YELLOW)
        concept_text.shift(UP * 2)
        
        rule_text = Text("To find element C_ij (row i, column j):", font_size=28, color=WHITE)
        rule_text.shift(UP * 1)
        
        formula_text = Text("Take dot product of Row i from A and Column j from B", font_size=24, color=GREEN)
        formula_text.shift(UP * 0.2)

        self.play(Write(concept_text))
        self.wait(1)
        self.play(Write(rule_text))
        self.wait(1)
        self.play(Write(formula_text))
        self.wait(2)

        # Clear concept text
        self.play(FadeOut(concept_text), FadeOut(rule_text), FadeOut(formula_text))

        # Show specific example: calculating C_11
        example_title = Text("Example: Finding C₁₁", font_size=32, color=BLUE)
        example_title.shift(UP * 2.5)
        self.play(Write(example_title))

        # Show matrices with specific values
        matrix_a_example = MathTex(r"\begin{bmatrix} 2 & 3 \\ 1 & 4 \end{bmatrix}", font_size=40)
        matrix_b_example = MathTex(r"\begin{bmatrix} 5 & 1 \\ 2 & 3 \end{bmatrix}", font_size=40)
        
        matrix_a_example.shift(LEFT * 2.5 + UP * 0.5)
        matrix_b_example.shift(RIGHT * 2.5 + UP * 0.5)

        self.play(Write(matrix_a_example), Write(matrix_b_example))
        self.wait(1)

        # Highlight row 1 of A and column 1 of B
        row_highlight = Rectangle(width=2.5, height=0.7, color=RED, fill_opacity=0.3)
        row_highlight.move_to(matrix_a_example.get_top() + DOWN * 0.35)
        
        col_highlight = Rectangle(width=0.7, height=2.5, color=BLUE, fill_opacity=0.3)
        col_highlight.move_to(matrix_b_example.get_left() + RIGHT * 0.35)

        self.play(Create(row_highlight), Create(col_highlight))
        self.wait(1)

        # Show the vectors being extracted
        row_vector = MathTex(r"[2, 3]", font_size=36, color=RED)
        col_vector = MathTex(r"\begin{bmatrix} 5 \\ 2 \end{bmatrix}", font_size=36, color=BLUE)
        
        row_vector.shift(DOWN * 1.5 + LEFT * 1.5)
        col_vector.shift(DOWN * 1.5 + RIGHT * 1.5)

        row_label = Text("Row 1 from A", font_size=20, color=RED)
        row_label.next_to(row_vector, DOWN, buff=0.2)
        
        col_label = Text("Column 1 from B", font_size=20, color=BLUE)
        col_label.next_to(col_vector, DOWN, buff=0.2)

        self.play(Write(row_vector), Write(col_vector))
        self.play(Write(row_label), Write(col_label))
        self.wait(2)

        # Show dot product calculation
        dot_product_text = Text("Dot Product:", font_size=28, color=YELLOW)
        dot_product_text.shift(DOWN * 2.8)
        
        calculation = MathTex(r"2 \times 5 + 3 \times 2 = 10 + 6 = 16", font_size=32, color=WHITE)
        calculation.shift(DOWN * 3.5)

        self.play(Write(dot_product_text))
        self.wait(0.5)
        self.play(Write(calculation))
        self.wait(2)

        # Show final result
        result_text = MathTex(r"C_{11} = 16", font_size=36, color=GREEN)
        result_text.shift(DOWN * 4.2)
        self.play(Write(result_text))
        self.wait(2)

        # Final summary
        # Clear all existing objects
        self.play(
            FadeOut(example_title),
            FadeOut(matrix_a_example),
            FadeOut(matrix_b_example),
            FadeOut(row_highlight),
            FadeOut(col_highlight),
            FadeOut(row_vector),
            FadeOut(col_vector),
            FadeOut(row_label),
            FadeOut(col_label),
            FadeOut(dot_product_text),
            FadeOut(calculation),
            FadeOut(result_text)
        )
        
        summary = Text("Matrix multiplication uses the Row × Column rule", font_size=32, color=BLUE)
        summary2 = Text("Each element is a dot product of corresponding row and column", font_size=24, color=WHITE)
        summary2.shift(DOWN * 0.8)
        
        self.play(Write(summary))
        self.play(Write(summary2))
        self.wait(2)