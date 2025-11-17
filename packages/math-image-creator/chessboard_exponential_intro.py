from manim import *

class ChessboardExponentialIntro(Scene):
    def construct(self):
        # Display the title
        title = Text("The Chess & Exponential Growth", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        self.play(Write(title))
        self.wait(2)
        
        # Introduce the concept
        concept_text = Text("How quickly can things grow?", font_size=36, color=WHITE)
        concept_text.move_to(ORIGIN)
        
        self.play(Write(concept_text))
        self.wait(2)
        
        # Fade out the concept text
        self.play(FadeOut(concept_text))
        
        # Transition to the analogy
        analogy_line1 = Text("Let's explore with a classic tale:", font_size=32, color=GREEN)
        analogy_line2 = Text("a chessboard and grains of rice.", font_size=32, color=GREEN)
        
        analogy_line1.move_to(ORIGIN + UP * 0.5)
        analogy_line2.move_to(ORIGIN + DOWN * 0.5)
        
        self.play(Write(analogy_line1))
        self.wait(1)
        self.play(Write(analogy_line2))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(title), FadeOut(analogy_line1), FadeOut(analogy_line2))
        self.wait(1)