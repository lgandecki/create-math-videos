from manim import *

class MatrixSimpleTest(Scene):
    def construct(self):
        # Simple test first
        title = Text("Matrix Row-Column Rule", font_size=36, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Show simple example
        matrix_a = Matrix([[2, 3], [1, 4]], h_buff=1.5)
        matrix_b = Matrix([[5, 1], [2, 3]], h_buff=1.5)
        
        matrix_a.shift(LEFT * 2)
        matrix_b.shift(RIGHT * 2)
        
        self.play(Create(matrix_a), Create(matrix_b))
        self.wait(2)
        
        # Show explanation
        explanation = Text("Row × Column = Element", font_size=24)
        explanation.shift(DOWN * 2)
        self.play(Write(explanation))
        self.wait(3)