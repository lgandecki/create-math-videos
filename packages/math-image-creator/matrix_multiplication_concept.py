from manim import *

class MatrixMultiplicationConcept(Scene):
    def construct(self):
        # Title
        title = Text("Matrix Multiplication: The Core Concept", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create matrices A and B
        matrix_a = Matrix([
            [r"a_{11}", r"a_{12}", r"a_{13}"],
            [r"a_{21}", r"a_{22}", r"a_{23}"],
            [r"a_{31}", r"a_{32}", r"a_{33}"]
        ])
        matrix_a.scale(0.8)
        matrix_a.shift(LEFT * 3)
        
        matrix_b = Matrix([
            [r"b_{11}", r"b_{12}"],
            [r"b_{21}", r"b_{22}"],
            [r"b_{31}", r"b_{32}"]
        ])
        matrix_b.scale(0.8)
        matrix_b.shift(RIGHT * 1)
        
        # Labels for matrices
        label_a = Text("A", font_size=36).next_to(matrix_a, LEFT)
        label_b = Text("B", font_size=36).next_to(matrix_b, LEFT)
        
        # Show matrices
        self.play(Create(matrix_a), Write(label_a))
        self.wait(0.5)
        self.play(Create(matrix_b), Write(label_b))
        self.wait(1)
        
        # Show dimensions
        dim_a = Text("(3 × 3)", font_size=24, color=BLUE).next_to(matrix_a, DOWN)
        dim_b = Text("(3 × 2)", font_size=24, color=BLUE).next_to(matrix_b, DOWN)
        
        self.play(Write(dim_a), Write(dim_b))
        self.wait(1)
        
        # Emphasize dimension rule
        dimension_rule = Text("Inner dimensions must match!", font_size=32, color=RED)
        dimension_rule.move_to(DOWN * 2)
        self.play(Write(dimension_rule))
        self.wait(2)
        
        # Clear screen except title
        self.play(FadeOut(matrix_a), FadeOut(matrix_b), FadeOut(label_a), FadeOut(label_b), 
                  FadeOut(dim_a), FadeOut(dim_b), FadeOut(dimension_rule))
        
        # Show general form
        general_form = MathTex(r"C_{ij} = \text{element in row } i, \text{ column } j")
        general_form.scale(0.8)
        general_form.move_to(UP * 1.5)
        self.play(Write(general_form))
        self.wait(2)
        
        # Create smaller matrices for demonstration
        matrix_a_demo = Matrix([
            [r"a_{11}", r"a_{12}", r"a_{13}"],
            [r"a_{21}", r"a_{22}", r"a_{23}"]
        ])
        matrix_a_demo.scale(0.6)
        matrix_a_demo.shift(LEFT * 3.5)
        
        matrix_b_demo = Matrix([
            [r"b_{11}", r"b_{12}"],
            [r"b_{21}", r"b_{22}"],
            [r"b_{31}", r"b_{32}"]
        ])
        matrix_b_demo.scale(0.6)
        matrix_b_demo.shift(LEFT * 0.5)
        
        # Result matrix
        matrix_c = Matrix([
            [r"c_{11}", r"c_{12}"],
            [r"c_{21}", r"c_{22}"]
        ])
        matrix_c.scale(0.6)
        matrix_c.shift(RIGHT * 2.5)
        
        # Labels
        label_a_demo = Text("A", font_size=24).next_to(matrix_a_demo, LEFT)
        label_b_demo = Text("B", font_size=24).next_to(matrix_b_demo, LEFT)
        label_c = Text("C = A × B", font_size=24).next_to(matrix_c, LEFT)
        
        # Show matrices
        self.play(Create(matrix_a_demo), Write(label_a_demo))
        self.play(Create(matrix_b_demo), Write(label_b_demo))
        self.play(Create(matrix_c), Write(label_c))
        self.wait(1)
        
        # Focus on specific element c_11
        # Highlight row 1 of A and column 1 of B
        row_highlight = Rectangle(width=2.5, height=0.5, color=YELLOW, fill_opacity=0.3)
        row_highlight.move_to(matrix_a_demo.get_entries()[0].get_center())
        row_highlight.shift(RIGHT * 0.7)
        
        col_highlight = Rectangle(width=0.8, height=1.5, color=GREEN, fill_opacity=0.3)
        col_highlight.move_to(matrix_b_demo.get_entries()[0].get_center())
        col_highlight.shift(DOWN * 0.25)
        
        self.play(Create(row_highlight), Create(col_highlight))
        self.wait(1)
        
        # Show the calculation
        calculation = MathTex(
            r"c_{11} = a_{11} \cdot b_{11} + a_{12} \cdot b_{21} + a_{13} \cdot b_{31}"
        )
        calculation.scale(0.7)
        calculation.move_to(DOWN * 2)
        self.play(Write(calculation))
        self.wait(2)
        
        # Color-code the calculation elements
        # Highlight corresponding elements
        a11_highlight = Circle(radius=0.2, color=YELLOW).move_to(matrix_a_demo.get_entries()[0].get_center())
        b11_highlight = Circle(radius=0.2, color=YELLOW).move_to(matrix_b_demo.get_entries()[0].get_center())
        
        self.play(Create(a11_highlight), Create(b11_highlight))
        self.wait(0.5)
        
        a12_highlight = Circle(radius=0.2, color=BLUE).move_to(matrix_a_demo.get_entries()[1].get_center())
        b21_highlight = Circle(radius=0.2, color=BLUE).move_to(matrix_b_demo.get_entries()[2].get_center())
        
        self.play(Create(a12_highlight), Create(b21_highlight))
        self.wait(0.5)
        
        a13_highlight = Circle(radius=0.2, color=RED).move_to(matrix_a_demo.get_entries()[2].get_center())
        b31_highlight = Circle(radius=0.2, color=RED).move_to(matrix_b_demo.get_entries()[4].get_center())
        
        self.play(Create(a13_highlight), Create(b31_highlight))
        self.wait(2)
        
        # Show general formula
        self.play(FadeOut(calculation))
        
        general_formula = MathTex(
            r"C_{ij} = \sum_{k=1}^{n} a_{ik} \cdot b_{kj}"
        )
        general_formula.scale(0.8)
        general_formula.move_to(DOWN * 2.5)
        self.play(Write(general_formula))
        self.wait(2)
        
        # Show final dimension rule
        final_rule = Text("A (m × n) × B (n × p) = C (m × p)", font_size=32, color=GREEN)
        final_rule.move_to(DOWN * 3.5)
        self.play(Write(final_rule))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects))
        
        # Final message
        final_message = Text("Remember: Inner dimensions must match!", font_size=40, color=RED)
        self.play(Write(final_message))
        self.wait(3)