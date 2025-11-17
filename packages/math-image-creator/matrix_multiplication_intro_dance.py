from manim import *

class MatrixMultiplicationIntroDance(Scene):
    def construct(self):
        # Create title
        title = Text("Matrix Multiplication Introduction", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        # Create Matrix A (2x2)
        matrix_a = Matrix([
            ["a_{11}", "a_{12}"],
            ["a_{21}", "a_{22}"]
        ], left_bracket="[", right_bracket="]")
        matrix_a.set_color(GREEN)
        
        # Create Matrix B (2x2)
        matrix_b = Matrix([
            ["b_{11}", "b_{12}"],
            ["b_{21}", "b_{22}"]
        ], left_bracket="[", right_bracket="]")
        matrix_b.set_color(YELLOW)
        
        # Create multiplication symbol and question mark
        multiply_symbol = MathTex("\\times", font_size=60, color=WHITE)
        equals_symbol = MathTex("=", font_size=60, color=WHITE)
        question_mark = MathTex("?", font_size=80, color=RED)
        
        # Position matrices and symbols
        matrix_a.shift(LEFT * 3)
        multiply_symbol.next_to(matrix_a, RIGHT, buff=0.5)
        matrix_b.next_to(multiply_symbol, RIGHT, buff=0.5)
        equals_symbol.next_to(matrix_b, RIGHT, buff=0.5)
        question_mark.next_to(equals_symbol, RIGHT, buff=0.5)
        
        # Create labels
        label_a = Text("Matrix A", font_size=24, color=GREEN)
        label_a.next_to(matrix_a, DOWN, buff=0.3)
        
        label_b = Text("Matrix B", font_size=24, color=YELLOW)
        label_b.next_to(matrix_b, DOWN, buff=0.3)
        
        # Create introduction text
        intro_text = Text(
            "How do we multiply matrices?",
            font_size=36,
            color=WHITE
        )
        intro_text.shift(DOWN * 2)
        
        dance_text = Text(
            "It's all about the 'Dot Product Dance'!",
            font_size=36,
            color=ORANGE
        )
        dance_text.shift(DOWN * 2.8)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        # Display matrices
        self.play(
            Create(matrix_a),
            Write(label_a)
        )
        self.wait(0.5)
        
        self.play(Write(multiply_symbol))
        self.wait(0.5)
        
        self.play(
            Create(matrix_b),
            Write(label_b)
        )
        self.wait(0.5)
        
        self.play(Write(equals_symbol))
        self.wait(0.5)
        
        self.play(Write(question_mark))
        self.wait(1)
        
        # Introduce the concept
        self.play(Write(intro_text))
        self.wait(1)
        
        self.play(
            Write(dance_text),
            question_mark.animate.set_color(ORANGE)
        )
        self.wait(2)
        
        # Final emphasis animation
        self.play(
            dance_text.animate.scale(1.2).set_color(PINK),
            rate_func=there_and_back,
            run_time=1.5
        )
        
        self.wait(2)