from manim import *

class FadeInFadeOutDemo(Scene):
    def construct(self):
        # Create title text
        title = Text("Manim's FadeIn and FadeOut", font_size=48, color=BLUE)
        title.to_edge(UP, buff=1)
        
        # Create subtitle text
        subtitle = Text("Mastering smooth object appearances and disappearances.", font_size=24, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        # Animate the title appearing with FadeIn
        self.play(FadeIn(title))
        self.wait(0.5)
        
        # Animate the subtitle appearing with FadeIn
        self.play(FadeIn(subtitle))
        self.wait(2)
        
        # Optional: Demonstrate FadeOut
        self.play(FadeOut(subtitle))
        self.wait(0.5)
        self.play(FadeOut(title))
        self.wait(1)