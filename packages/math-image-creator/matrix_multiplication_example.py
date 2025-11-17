from manim import *

class MatrixMultiplicationExample(Scene):
    def construct(self):
        # Title
        title = Text("Step-by-Step Matrix Multiplication", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Display specific example matrices as requested
        matrix_a = MathTex(r"A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}")
        matrix_b = MathTex(r"B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}")
        matrix_c = MathTex(r"C = \begin{bmatrix} ? & ? \\ ? & ? \end{bmatrix}")
        
        # Position matrices
        matrix_a.shift(LEFT * 4)
        matrix_b.shift(UP * 0.5)
        matrix_c.shift(RIGHT * 4)
        
        # Display matrices
        self.play(Write(matrix_a))
        self.wait(0.5)
        self.play(Write(matrix_b))
        self.wait(0.5)
        self.play(Write(matrix_c))
        self.wait(1)
        
        # Add multiplication symbol and equals
        mult_symbol = MathTex(r"\times").move_to((matrix_a.get_right() + matrix_b.get_left()) / 2)
        equals_symbol = MathTex(r"=").move_to((matrix_b.get_right() + matrix_c.get_left()) / 2)
        
        self.play(Write(mult_symbol), Write(equals_symbol))
        self.wait(1)
        
        # Section title for calculating C[0,0]
        calc_title = Text("Calculating C[0,0]:", font_size=28, color=YELLOW)
        calc_title.to_edge(DOWN, buff=2.5)
        self.play(Write(calc_title))
        self.wait(1)
        
        # Highlight row 0 of A (first row: [1, 2])
        row_highlight_a = Rectangle(
            width=1.5, height=0.4, 
            color=BLUE, fill_opacity=0.3
        ).move_to(matrix_a.get_center() + UP * 0.3)
        
        # Highlight column 0 of B (first column: [5, 7])
        col_highlight_b = Rectangle(
            width=0.4, height=1.2,
            color=GREEN, fill_opacity=0.3
        ).move_to(matrix_b.get_center() + LEFT * 0.3)
        
        self.play(Create(row_highlight_a), Create(col_highlight_b))
        self.wait(1)
        
        # Show extracted row and column
        row_text = MathTex(r"\text{Row 0 of A: } [1, 2]", color=BLUE)
        col_text = MathTex(r"\text{Column 0 of B: } \begin{bmatrix} 5 \\ 7 \end{bmatrix}", color=GREEN)
        
        row_text.next_to(calc_title, DOWN, buff=0.5)
        col_text.next_to(row_text, DOWN, buff=0.3)
        
        self.play(Write(row_text))
        self.wait(0.5)
        self.play(Write(col_text))
        self.wait(1)
        
        # Show dot product calculation
        dot_product = MathTex(r"\text{Dot product: } (1 \times 5) + (2 \times 7)")
        dot_product.next_to(col_text, DOWN, buff=0.5)
        self.play(Write(dot_product))
        self.wait(1)
        
        # Show calculation steps
        step1 = MathTex(r"= 5 + 14")
        step1.next_to(dot_product, DOWN, buff=0.3)
        self.play(Write(step1))
        self.wait(1)
        
        result = MathTex(r"= 19", color=RED)
        result.next_to(step1, DOWN, buff=0.3)
        self.play(Write(result))
        self.wait(1)
        
        # Update matrix C with the result
        matrix_c_updated = MathTex(r"C = \begin{bmatrix} 19 & ? \\ ? & ? \end{bmatrix}")
        matrix_c_updated.move_to(matrix_c)
        
        # Highlight the position being filled
        result_highlight = Rectangle(
            width=0.4, height=0.4,
            color=RED, fill_opacity=0.3
        ).move_to(matrix_c_updated.get_center() + UP * 0.3 + LEFT * 0.3)
        
        self.play(
            Transform(matrix_c, matrix_c_updated),
            Create(result_highlight)
        )
        self.wait(2)
        
        # Final message
        final_text = Text("C[0,0] = 19", font_size=32, color=RED)
        final_text.next_to(result, DOWN, buff=0.5)
        self.play(Write(final_text))
        self.wait(3)