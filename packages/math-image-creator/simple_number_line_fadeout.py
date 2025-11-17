from manim import *

class SimpleNumberLineFadeout(Scene):
    def construct(self):
        # Create a horizontal line
        horizontal_line = Line(start=LEFT * 4, end=RIGHT * 4, color=WHITE)
        
        # Show the line
        self.play(Create(horizontal_line))
        self.wait(1)
        
        # Fade out the line
        self.play(FadeOut(horizontal_line))
        self.wait(1)