from manim import *

class TextDisplayIntro(Scene):
    def construct(self):
        # Display the title "Displaying Text in Manim"
        title = Text("Displaying Text in Manim", font_size=56, color=BLUE)
        title.to_edge(UP, buff=0.8)
        
        # Add a subtitle: "Making Words Come Alive"
        subtitle = Text("Making Words Come Alive", font_size=36, color=GRAY)
        subtitle.next_to(title, DOWN, buff=0.6)
        
        # Animate title appearing
        self.play(FadeIn(title, shift=DOWN), run_time=1.5)
        self.wait(0.5)
        
        # Animate subtitle appearing
        self.play(FadeIn(subtitle, shift=UP), run_time=1.2)
        self.wait(2)
        
        # Fade everything out
        self.play(
            FadeOut(title, shift=UP),
            FadeOut(subtitle, shift=DOWN),
            run_time=1.5
        )
        self.wait(0.5)