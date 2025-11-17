from manim import *

class MatrixMultiplication2x2by2x1(Scene):
    def construct(self):
        # Title
        title = Text("Matrix Multiplication: 2×2 by 2×1", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Define matrices
        matrix_A = Matrix([
            ["1", "2"],
            ["3", "4"]
        ], element_alignment_corner=ORIGIN)
        
        matrix_B = Matrix([
            ["5"],
            ["6"]
        ], element_alignment_corner=ORIGIN)
        
        matrix_C = Matrix([
            ["?"],
            ["?"]
        ], element_alignment_corner=ORIGIN)
        
        # Position matrices
        matrix_A.shift(LEFT * 3)
        matrix_B.shift(LEFT * 0.5)
        matrix_C.shift(RIGHT * 2)
        
        # Labels
        label_A = MathTex("A", "=").next_to(matrix_A, LEFT)
        label_B = MathTex("B", "=").next_to(matrix_B, LEFT)
        label_C = MathTex("C", "=").next_to(matrix_C, LEFT)
        
        # Multiplication symbol
        mult_symbol = MathTex("\\times").move_to((matrix_A.get_right() + matrix_B.get_left()) / 2)
        equals_symbol = MathTex("=").move_to((matrix_B.get_right() + matrix_C.get_left()) / 2)
        
        # Display initial setup
        self.play(
            Write(label_A), Write(matrix_A),
            Write(mult_symbol),
            Write(label_B), Write(matrix_B),
            Write(equals_symbol),
            Write(label_C), Write(matrix_C)
        )
        self.wait(2)
        
        # Section header for Example 1
        section_text = Text("Section: Example 1: 2×2 by 2×1", font_size=24, color=YELLOW)
        section_text.to_edge(DOWN, buff=0.5)
        self.play(Write(section_text))
        self.wait(1)
        
        # Calculate C_11 (first row, first column)
        calc_text = Text("Calculating C₁₁ (first row, first column):", font_size=20, color=GREEN)
        calc_text.next_to(section_text, UP, buff=0.3)
        self.play(Write(calc_text))
        
        # Highlight Row 1 of A and Column 1 of B
        row1_A = SurroundingRectangle(VGroup(matrix_A.get_entries()[0], matrix_A.get_entries()[1]), color=BLUE, buff=0.1)
        col1_B = SurroundingRectangle(VGroup(matrix_B.get_entries()[0], matrix_B.get_entries()[1]), color=RED, buff=0.1)
        
        self.play(Create(row1_A), Create(col1_B))
        self.wait(1)
        
        # Show calculation for C_11
        calc_c11 = MathTex("(1 \\times 5) + (2 \\times 6)", "=", "5 + 12", "=", "17")
        calc_c11.scale(0.8).next_to(calc_text, DOWN, buff=0.3)
        
        self.play(Write(calc_c11[0]))
        self.wait(1)
        self.play(Write(calc_c11[1]), Write(calc_c11[2]))
        self.wait(1)
        self.play(Write(calc_c11[3]), Write(calc_c11[4]))
        self.wait(1)
        
        # Place 17 into C_11 position
        new_entry_c11 = MathTex("17").move_to(matrix_C.get_entries()[0].get_center())
        self.play(Transform(matrix_C.get_entries()[0], new_entry_c11))
        self.wait(1)
        
        # Clear highlights and calculation
        self.play(FadeOut(row1_A), FadeOut(col1_B), FadeOut(calc_c11), FadeOut(calc_text))
        
        # Calculate C_21 (second row, first column)
        calc_text2 = Text("Calculating C₂₁ (second row, first column):", font_size=20, color=GREEN)
        calc_text2.next_to(section_text, UP, buff=0.3)
        self.play(Write(calc_text2))
        
        # Highlight Row 2 of A and Column 1 of B
        row2_A = SurroundingRectangle(VGroup(matrix_A.get_entries()[2], matrix_A.get_entries()[3]), color=BLUE, buff=0.1)
        col1_B2 = SurroundingRectangle(VGroup(matrix_B.get_entries()[0], matrix_B.get_entries()[1]), color=RED, buff=0.1)
        
        self.play(Create(row2_A), Create(col1_B2))
        self.wait(1)
        
        # Show calculation for C_21
        calc_c21 = MathTex("(3 \\times 5) + (4 \\times 6)", "=", "15 + 24", "=", "39")
        calc_c21.scale(0.8).next_to(calc_text2, DOWN, buff=0.3)
        
        self.play(Write(calc_c21[0]))
        self.wait(1)
        self.play(Write(calc_c21[1]), Write(calc_c21[2]))
        self.wait(1)
        self.play(Write(calc_c21[3]), Write(calc_c21[4]))
        self.wait(1)
        
        # Place 39 into C_21 position
        new_entry_c21 = MathTex("39").move_to(matrix_C.get_entries()[1].get_center())
        self.play(Transform(matrix_C.get_entries()[1], new_entry_c21))
        self.wait(1)
        
        # Clear highlights and calculation
        self.play(FadeOut(row2_A), FadeOut(col1_B2), FadeOut(calc_c21), FadeOut(calc_text2))
        
        # Show final result
        final_text = Text("Final result:", font_size=24, color=YELLOW)
        final_text.next_to(section_text, UP, buff=0.3)
        
        final_result = MathTex("C = \\begin{bmatrix} 17 \\\\ 39 \\end{bmatrix}")
        final_result.next_to(final_text, DOWN, buff=0.5)
        
        self.play(Write(final_text))
        self.play(Write(final_result))
        self.wait(3)