from manim import *

class MatrixMultiplication2x2Example(Scene):
    def construct(self):
        # Title
        title = Text("Example 2: 2x2 by 2x2 Matrix Multiplication", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Define matrices A and B
        matrix_A = MathTex(r"A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}")
        matrix_B = MathTex(r"B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}")
        
        # Position matrices
        matrix_A.shift(LEFT * 3)
        matrix_B.shift(RIGHT * 3)
        
        # Display matrices
        self.play(Write(matrix_A), Write(matrix_B))
        self.wait(1)
        
        # Setup equation A * B = C
        equation = MathTex(r"A \times B = C")
        equation.shift(DOWN * 1)
        self.play(Write(equation))
        self.wait(1)
        
        # Move matrices to better position for calculation
        self.play(
            matrix_A.animate.shift(UP * 1.5 + RIGHT * 1),
            matrix_B.animate.shift(UP * 1.5 + LEFT * 1),
            equation.animate.shift(UP * 0.5)
        )
        
        # Create result matrix C (empty initially)
        matrix_C = MathTex(r"C = \begin{bmatrix} ? & ? \\ ? & ? \end{bmatrix}")
        matrix_C.shift(DOWN * 2)
        self.play(Write(matrix_C))
        self.wait(1)
        
        # Calculate C_11
        self.calculate_element(matrix_A, matrix_B, matrix_C, 1, 1, "C_{11}")
        self.wait(1)
        
        # Calculate C_12
        self.calculate_element(matrix_A, matrix_B, matrix_C, 1, 2, "C_{12}")
        self.wait(1)
        
        # Calculate C_21
        self.calculate_element(matrix_A, matrix_B, matrix_C, 2, 1, "C_{21}")
        self.wait(1)
        
        # Calculate C_22
        self.calculate_element(matrix_A, matrix_B, matrix_C, 2, 2, "C_{22}")
        self.wait(1)
        
        # Show final result
        final_result = MathTex(r"C = \begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}")
        final_result.shift(DOWN * 2)
        
        self.play(Transform(matrix_C, final_result))
        self.wait(2)
        
        # Final message
        final_text = Text("Matrix multiplication complete!", font_size=24)
        final_text.shift(DOWN * 3.5)
        self.play(Write(final_text))
        self.wait(2)
    
    def calculate_element(self, matrix_A, matrix_B, matrix_C, row, col, element_name):
        # Highlight row in A and column in B
        if row == 1 and col == 1:
            # C_11: Row 1 of A, Column 1 of B
            calculation = MathTex(r"C_{11} = (1 \times 5) + (2 \times 7) = 5 + 14 = 19")
            row_highlight = Rectangle(width=2, height=0.5, color=BLUE, fill_opacity=0.3)
            col_highlight = Rectangle(width=0.5, height=2, color=GREEN, fill_opacity=0.3)
            
        elif row == 1 and col == 2:
            # C_12: Row 1 of A, Column 2 of B
            calculation = MathTex(r"C_{12} = (1 \times 6) + (2 \times 8) = 6 + 16 = 22")
            row_highlight = Rectangle(width=2, height=0.5, color=BLUE, fill_opacity=0.3)
            col_highlight = Rectangle(width=0.5, height=2, color=GREEN, fill_opacity=0.3)
            
        elif row == 2 and col == 1:
            # C_21: Row 2 of A, Column 1 of B
            calculation = MathTex(r"C_{21} = (3 \times 5) + (4 \times 7) = 15 + 28 = 43")
            row_highlight = Rectangle(width=2, height=0.5, color=BLUE, fill_opacity=0.3)
            col_highlight = Rectangle(width=0.5, height=2, color=GREEN, fill_opacity=0.3)
            
        else:  # row == 2 and col == 2
            # C_22: Row 2 of A, Column 2 of B
            calculation = MathTex(r"C_{22} = (3 \times 6) + (4 \times 8) = 18 + 32 = 50")
            row_highlight = Rectangle(width=2, height=0.5, color=BLUE, fill_opacity=0.3)
            col_highlight = Rectangle(width=0.5, height=2, color=GREEN, fill_opacity=0.3)
        
        # Position highlights
        if row == 1:
            row_highlight.move_to(matrix_A.get_center() + UP * 0.3)
        else:
            row_highlight.move_to(matrix_A.get_center() + DOWN * 0.3)
            
        if col == 1:
            col_highlight.move_to(matrix_B.get_center() + LEFT * 0.3)
        else:
            col_highlight.move_to(matrix_B.get_center() + RIGHT * 0.3)
        
        # Position calculation
        calculation.shift(DOWN * 0.5)
        calculation.scale(0.8)
        
        # Show highlights
        self.play(Create(row_highlight), Create(col_highlight))
        self.wait(0.5)
        
        # Show calculation
        self.play(Write(calculation))
        self.wait(2)
        
        # Remove highlights and calculation
        self.play(FadeOut(row_highlight), FadeOut(col_highlight), FadeOut(calculation))
        self.wait(0.5)