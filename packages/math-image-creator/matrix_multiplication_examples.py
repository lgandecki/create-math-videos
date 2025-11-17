from manim import *

class MatrixMultiplicationExamples(Scene):
    def construct(self):
        # Title
        title = Text("Matrix Multiplication: Examples", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Introduction rule text
        rule_text = Text(
            "Rule for multiplying matrices:",
            font_size=36,
            color=YELLOW
        )
        rule_text.next_to(title, DOWN, buff=1)
        self.play(Write(rule_text))
        self.wait(1)
        
        # Matrix dimensions explanation
        matrix_a_text = MathTex(r"\text{Matrix A: } m \times n")
        matrix_b_text = MathTex(r"\text{Matrix B: } n \times p")
        result_text = MathTex(r"\text{Result C: } m \times p")
        
        matrix_a_text.next_to(rule_text, DOWN, buff=0.8)
        matrix_b_text.next_to(matrix_a_text, DOWN, buff=0.5)
        result_text.next_to(matrix_b_text, DOWN, buff=0.5)
        
        self.play(Write(matrix_a_text))
        self.wait(0.5)
        self.play(Write(matrix_b_text))
        self.wait(0.5)
        self.play(Write(result_text))
        self.wait(1)
        
        # Highlight inner dimensions
        inner_dim_text = Text(
            "The 'inner dimensions' must match!",
            font_size=32,
            color=RED
        )
        inner_dim_text.next_to(result_text, DOWN, buff=1)
        self.play(Write(inner_dim_text))
        
        # Visual representation with highlighting
        visual_rule = MathTex(
            r"A_{m \times n} \cdot B_{n \times p} = C_{m \times p}"
        )
        visual_rule.next_to(inner_dim_text, DOWN, buff=1)
        self.play(Write(visual_rule))
        
        # Create highlighting boxes for inner dimensions
        # Find the positions of the 'n' characters in the MathTex
        n_box1 = SurroundingRectangle(visual_rule[0][4:6], color=GREEN, buff=0.1)
        n_box2 = SurroundingRectangle(visual_rule[0][8:10], color=GREEN, buff=0.1)
        
        self.play(Create(n_box1), Create(n_box2))
        self.wait(1)
        
        # Add explanation text
        match_text = Text(
            "These must be equal!",
            font_size=28,
            color=GREEN
        )
        match_text.next_to(visual_rule, DOWN, buff=0.8)
        
        # Draw arrows pointing to the highlighted dimensions
        arrow1 = Arrow(
            start=match_text.get_top() + LEFT * 0.5,
            end=n_box1.get_bottom(),
            color=GREEN,
            buff=0.1
        )
        arrow2 = Arrow(
            start=match_text.get_top() + RIGHT * 0.5,
            end=n_box2.get_bottom(),
            color=GREEN,
            buff=0.1
        )
        
        self.play(Write(match_text))
        self.play(Create(arrow1), Create(arrow2))
        self.wait(2)
        
        # Final pause
        self.wait(1)