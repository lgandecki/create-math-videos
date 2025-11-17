from manim import *

class MatrixMultiplicationConclusion(Scene):
    def construct(self):
        # Title
        title = Text("Matrix Multiplication - Conclusion", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Key takeaway
        key_takeaway_header = Text("Key Takeaway:", font_size=36, color=GREEN)
        key_takeaway_header.shift(UP * 1.5)
        
        key_takeaway_text = Text(
            "Matrix multiplication is about performing dot products\n"
            "of rows from the first matrix with columns from the second matrix.",
            font_size=32,
            color=WHITE
        )
        key_takeaway_text.next_to(key_takeaway_header, DOWN, buff=0.5)
        
        self.play(Write(key_takeaway_header))
        self.wait(0.5)
        self.play(Write(key_takeaway_text))
        self.wait(2)
        
        # Dimension rule
        dimension_header = Text("Dimension Rule:", font_size=36, color=YELLOW)
        dimension_header.shift(DOWN * 0.5)
        
        dimension_text = Text(
            "For matrices A(m×n) and B(p×q):\n"
            "Multiplication is possible only when n = p\n"
            "Result matrix will be (m×q)",
            font_size=32,
            color=WHITE
        )
        dimension_text.next_to(dimension_header, DOWN, buff=0.5)
        
        self.play(Write(dimension_header))
        self.wait(0.5)
        self.play(Write(dimension_text))
        self.wait(2)
        
        # Clear previous content
        self.play(
            FadeOut(key_takeaway_header),
            FadeOut(key_takeaway_text),
            FadeOut(dimension_header),
            FadeOut(dimension_text)
        )
        
        # Final message
        final_message = Text("Practice makes perfect!", font_size=48, color=RED)
        final_message.move_to(ORIGIN)
        
        self.play(Write(final_message))
        self.wait(1)
        
        # Add some visual flair
        self.play(
            final_message.animate.scale(1.2),
            rate_func=there_and_back,
            run_time=1
        )
        
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(title), FadeOut(final_message))
        self.wait(1)